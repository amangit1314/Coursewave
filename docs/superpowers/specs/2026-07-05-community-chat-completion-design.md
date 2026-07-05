# Community Chat — Completion Design

Date: 2026-07-05

## Context

The community chat feature is already largely built:

- Prisma models: `Community`, `CommunityMember`, `Message`, `Reaction`, `PinnedMessage`, `ModerationLog`.
- `backend/src/config/socket.ts`: full socket.io server — join (sends last 50 messages + presence), send (with `parentId` reply + attachments), edit (owner-only), delete (owner or admin/moderator), react (toggle, broadcasts full reaction list), pin/unpin, typing, disconnect (sets offline, broadcasts presence).
- `backend/src/api/communities/`: REST CRUD — list, get by id, create, join, leave, get messages (fallback), send message (fallback), delete message (moderator-gated).
- Frontend: `communitySocket.ts` wraps every socket event, `communityChatStore.ts` (zustand) holds all chat state, `[communityId]/page.tsx` wires socket → store → UI (`ChatHeaderComponent`, `PinnedMessagesTopBanner`, `ChatMessages`, `ReplyPreview`, `MessageInput`, `PinnedMessagesPanel`, `OnlineUsersSidebar`).

This spec covers only the remaining gaps, scoped with the user:

1. Real file-attachment storage (Cloudinary) — attachments currently use `URL.createObjectURL`, which only exists in the sender's own tab.
2. Consolidate the instructor communities chat (a separate, older, 15s-REST-polling implementation with no reactions/pin/edit/typing) into the same real-time chat used publicly.
3. Moderation/admin routes — member list, role changes, kick, community edit/delete. `isCommunityAdmin` middleware currently exists but is unused (dead code); no route lets an admin edit or delete a community, and there's no member-list endpoint at all.
4. Reply thread view — replies are currently write-only: you can reply to a message but there's no way to see "N replies" or open a thread.
5. Wire up the header's "More" menu (currently five decorative buttons with no `onClick`) and fix `OnlineUsersSidebar`, which fakes user names from `userId.substring(0, 8)` instead of joining real member data — both depend on the members endpoint from (3).

Out of scope: message search across full history (only the loaded 50-message window), read receipts, unread counts, push notifications, file preview/thumbnails beyond what Cloudinary returns by default.

## 1. File attachments (Cloudinary)

**Backend**
- Add `cloudinary` npm package.
- Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` to the zod-validated env schema in `backend/src/config/config.ts`.
- New route: `POST /api/communities/:communityId/upload`, `verifyToken` + member check, `multer` memory storage, single file, 15MB cap, MIME allowlist (images, pdf, doc/docx, txt, zip — matching the existing frontend `accept` attribute).
- Controller uploads the buffer to Cloudinary via `upload_stream` (resource_type `auto`) and returns `{ type: "image" | "file", url, name, size }` matching the existing `ChatMessage["attachments"]` shape.

**Frontend**
- `communitiesService` gets an `uploadAttachment(communityId, file): Promise<Attachment>` method (multipart `FormData`).
- `MessageInput.handleFileUpload` becomes async: upload first (show a small pending/spinner state on the attach button), then `sendMessage(communityId, ...)` with the real returned attachment. On upload failure, show an inline error and do not send.

## 2. Instructor chat consolidation

- Extract a new shared component `frontend/src/components/community/CommunityChatWindow.tsx` containing: socket init/teardown (`initCommunitySocket`/`disconnectSocket`), `ChatMessages`, `ReplyPreview`, `MessageInput`. Props: `communityId`, `isAdmin`.
- `[communityId]/page.tsx` (public route) keeps its header/pinned-banner/online-sidebar chrome, and renders `CommunityChatWindow` for the actual message area instead of inlining the socket logic itself.
- Instructor's `communities/_components/CommunityChat.tsx` is deleted; `instructor/communities/page.tsx` renders `CommunityChatWindow` directly in its right-hand pane instead.
- The old REST-polling hooks `useCommunityMessages`/`useSendMessage` in `useCommunities.ts` are removed if nothing else references them (to be confirmed during implementation — do not delete blind).

## 3. Moderation/admin routes

New endpoints on `backend/src/api/communities/communities.routes.ts`:

| Method | Path | Guard | Notes |
|---|---|---|---|
| GET | `/:communityId/members` | `verifyToken` (member) | Returns members with `user{id,name,profileImageUrl}`, `role`, `isOnline`, `joinedAt` |
| PATCH | `/:communityId` | `verifyToken` + `isCommunityAdmin` | Edit `title`/`description`/`tags`/`isPublic` |
| DELETE | `/:communityId` | `verifyToken` + `isCommunityAdmin` | Deletes community (cascades via existing `onDelete: Cascade` FKs) |
| PATCH | `/:communityId/members/:userId/role` | `verifyToken` + `isCommunityAdmin` | Body `{ role: "MODERATOR" \| "MEMBER" }`; cannot change own role; cannot leave a community with zero admins |
| DELETE | `/:communityId/members/:userId` | `verifyToken` + `isCommunityModerator` | Kick; a moderator can only kick `MEMBER`s, only an admin can kick a `MODERATOR` |

**Frontend**
- `useCommunities.ts`: `useCommunityMembers`, `useUpdateCommunity`, `useDeleteCommunity`, `useUpdateMemberRole`, `useKickMember`.
- New `CommunityInfoPanel` (dialog) opened from the header's "Community Info" and "Community Settings" entries: member list with role badges + promote/demote/kick buttons (visible only when `isAdmin`/`isModerator`), and an edit form for admins. A "Delete Community" action is admin-only and asks for confirmation.

## 4. Reply thread view

- `MessageCard`: when `msg.replyCount > 0`, render a small pill button "↩ N replies" beneath the bubble.
- Clicking opens a `ThreadDialog` (shadcn `Dialog`) showing the root message followed by every message in `store.messages` where `parentId === msg.id`, in order, plus a reply input that always sends with `parentId` fixed to the thread root.
- Threads are derived from the already-loaded message window (last 50 + anything arriving live via socket) — no new backend query needed, since `sendMessage`/`messages:init` already include `parentId` and `replies: { id }[]`.

## 5. Header "More" menu + OnlineUsersSidebar

- **Search Messages**: opens an inline search input (popover) filtering `store.messages` by `content` substring (client-side, current window only); selecting a result scrolls to it (`document.getElementById(`message-${id}`)`; `MessageCard`'s root gets `id={`message-${msg.id}`}`).
- **Community Info** / **Community Settings**: open `CommunityInfoPanel` from (3), on the info tab or settings tab respectively.
- **Shared Files**: filters `store.messages` for non-empty `attachments`, lists them in a popover/dialog with download links.
- **Leave Community**: calls the existing `leaveCommunity` mutation, then redirects to `/communityChat`.
- **OnlineUsersSidebar**: fetches `useCommunityMembers(communityId)` once, merges each member's `user{name, profileImageUrl}` with the live `onlineUsers` presence map from the store (falling back to the member's `isOnline` field from the REST payload before any socket presence event arrives), and renders real names/avatars instead of `userId.substring(0, 8)`.

## Error handling

- All new REST routes follow the existing `asyncHandler` + `AppError` + `sendSuccess` pattern already used across `communities.controller.ts`.
- Upload failures (bad MIME, oversize, Cloudinary error) surface as a 400/502 `AppError` and the frontend shows an inline toast/error without sending a message.
- Role-change/kick edge cases (self-demotion, last-admin removal, moderator kicking an admin) are rejected with 403/409 `AppError`s rather than silently no-op'ing.

## Testing

- Manual verification via the `run`/`verify` flow: upload an image and confirm the URL persists across a page refresh and is visible from a second logged-in session; promote/demote/kick a test member and confirm socket-driven UI updates; open a thread and confirm replies render; confirm instructor and public chat panes both show reactions/pins/typing after consolidation.
- No new automated test suite exists for this feature currently; this spec does not introduce one (matches current codebase convention of no tests under `backend/src/api/communities`).

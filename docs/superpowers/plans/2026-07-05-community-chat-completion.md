# Community Chat Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the remaining gaps in the (already largely built) community chat feature: real Cloudinary-backed attachments, one shared real-time chat window for both the public and instructor routes, moderation/admin routes, a reply-thread view, and a fully wired header/sidebar.

**Architecture:** Backend stays in the existing Express + Prisma + Socket.IO structure (`backend/src/api/communities/*`, `backend/src/config/socket.ts`). Frontend stays in the existing Next.js App Router + Zustand + TanStack Query structure. No new frameworks, no test runner is introduced (none exists in this repo today — `backend/package.json`'s `test` script is a placeholder and there are zero `*.test.ts(x)` files anywhere in the repo), so each task is verified manually (curl / dev server) instead of with automated tests, matching current project convention.

**Tech Stack:** Express, Prisma, Socket.IO, multer (already a dependency), `cloudinary` (new dependency), Next.js, Zustand, TanStack Query, shadcn/ui (`Dialog`, `Badge`, `Tabs`).

## Global Constraints

- Follow the existing controller pattern exactly: `asyncHandler` + `AppError` + `sendSuccess` from `backend/src/core/middleware/errorHandler.ts` (re-exported via `backend/src/core/middleware/index.ts`).
- Follow the existing service/controller split: Prisma queries live in `*.service.ts`, request/response glue lives in `*.controller.ts` (see `backend/src/api/communities/communities.service.ts` / `communitites.controller.ts` — note the controller file's existing typo `communitites` must be kept, don't rename it).
- All new REST routes require `verifyToken` (imported from `../../core/middleware`) at minimum; admin/moderator routes additionally require `isCommunityAdmin` / `isCommunityModerator` from `backend/src/core/middleware/isCommunityAdmin.ts` / `isCommunityModerator.ts`.
- `CommunityRole` enum values are exactly `ADMIN`, `MODERATOR`, `MEMBER` (`backend/prisma/schema.prisma:1052-1056`). `ReactionType` enum values are `LIKE`, `DISLIKE`, `LOVE`, `LAUGH`.
- Frontend API calls go through `communitiesService` (`frontend/src/lib/api/services/communitiesService.ts`), which wraps the singleton `apiManager` (`frontend/src/lib/api/api-manager.ts`). `apiManager` already exposes `.get/.post/.put/.patch/.delete<T>(url, data?, config?)` and `.upload<T>(url, file, onProgress?, config?)` (the last one posts a `FormData` with field name `"file"`).
- Hooks go in `frontend/src/hooks/useCommunities.ts`, using `useQuery`/`useMutation` from `@tanstack/react-query`, following the exact pattern already in that file (e.g. `useJoinCommunity`).
- Do not touch the `messages:init` / `sendMessage` / `editMessage` / `deleteMessage` / `reactToMessage` / `togglePinMessage` / `typing` socket contract in `backend/src/config/socket.ts` or `frontend/src/lib/socket/communitySocket.ts` — those already work end to end and are out of scope.
- Commit after each task with a message describing that task's change only.

---

### Task 1: Cloudinary config + upload endpoint (backend)

**Files:**
- Modify: `backend/package.json` (add `cloudinary` dependency)
- Modify: `backend/src/config/config.ts` (add 3 env vars to the zod schema)
- Create: `backend/src/config/cloudinary.ts`
- Create: `backend/src/api/communities/upload.controller.ts`
- Modify: `backend/src/api/communities/communities.routes.ts` (add `POST /:communityId/upload`)

**Interfaces:**
- Consumes: `env` from `backend/src/config/config.ts`, `prisma` from `backend/src/config/prisma.ts`, `AppError`/`asyncHandler`/`sendSuccess` from `../../core/middleware`, `verifyToken` from `../../core/middleware`.
- Produces: `uploadCommunityAttachment` Express handler exported from `upload.controller.ts`, mounted at `POST /api/communities/:communityId/upload`. Response body: `ApiResponse<{ type: "image" | "file"; url: string; name: string; size: string }>` (the `size` field is a human string like `"1.4 MB"`, matching the shape already used by `ChatMessage["attachments"]` in `frontend/src/zustand/communityChatStore.ts:37`).

- [ ] **Step 1: Install the Cloudinary SDK**

Run: `cd backend && npm install cloudinary`

Expected: `backend/package.json` gains a `"cloudinary": "^..."` dependency and `package-lock.json` updates.

- [ ] **Step 2: Add Cloudinary env vars to the validated config**

Open `backend/src/config/config.ts` and add these three lines inside `envSchema`, next to the existing `STRIPE_API_KEY` block (same optional/required style — these are required because the upload feature has no fallback):

```typescript
  // Cloudinary (community chat attachments)
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
```

Then add the matching keys to `backend/.env` (or `backend/.env.example` if that's the file tracked in git — check with `ls backend/.env*` first) with real/placeholder values so the server can boot locally.

- [ ] **Step 2b: Verify the env schema still parses**

Run: `cd backend && npx ts-node -e "require('./src/config/config')"`

Expected: no `ZodError` thrown (if `ts-node` isn't available, run `npm run build` instead and check for the same absence of a Zod error at import time).

- [ ] **Step 3: Create the Cloudinary client module**

Create `backend/src/config/cloudinary.ts`:

```typescript
import { v2 as cloudinary } from "cloudinary";
import { env } from "./config";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string
): Promise<{ secure_url: string; resource_type: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload returned no result"));
          return;
        }
        resolve({ secure_url: result.secure_url, resource_type: result.resource_type });
      }
    );
    stream.end(buffer);
  });
}
```

- [ ] **Step 4: Create the upload controller**

Create `backend/src/api/communities/upload.controller.ts`:

```typescript
import { Request, Response } from "express";
import multer from "multer";
import { asyncHandler, sendSuccess, AppError } from "../../core/middleware";
import { prisma } from "../../config/prisma";
import { uploadBufferToCloudinary } from "../../config/cloudinary";

const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/zip",
]);

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(new AppError(`Unsupported file type: ${file.mimetype}`, 400));
      return;
    }
    cb(null, true);
  },
}).single("file");

function formatSize(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export const uploadCommunityAttachment = asyncHandler(
  async (req: Request, res: Response) => {
    const { communityId } = req.params;
    const userId = req.user?.id;
    if (!userId) throw new AppError("Unauthorized", 401);

    const isMember = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId, communityId } },
    });
    if (!isMember) {
      throw new AppError("Access denied. You are not a member of this community.", 403);
    }

    const file = req.file;
    if (!file) throw new AppError("No file uploaded", 400);

    const { secure_url, resource_type } = await uploadBufferToCloudinary(
      file.buffer,
      `communities/${communityId}`
    );

    sendSuccess(
      res,
      {
        type: resource_type === "image" ? "image" : "file",
        url: secure_url,
        name: file.originalname,
        size: formatSize(file.size),
      },
      "File uploaded successfully",
      201
    );
  }
);
```

- [ ] **Step 5: Mount the route**

Open `backend/src/api/communities/communities.routes.ts` and change it to:

```typescript
import { Router } from "express";
import { verifyToken } from "../../core/middleware";
import { checkAccessToken } from "../../core/middleware";
import { isCommunityModerator } from "../../core/middleware/isCommunityModerator";
import {
  getAllCommunities,
  getCommunityById,
  createCommunity,
  joinCommunity,
  getCommunityMessages,
  deleteMessage,
  sendMessage,
  leaveCommunity,
} from "./communitites.controller";
import { uploadMiddleware, uploadCommunityAttachment } from "./upload.controller";

const router: Router = Router();

// Get all communities (public ones)
router.get("/", getAllCommunities);

// Get a specific community by ID
router.get("/:communityId", verifyToken, getCommunityById);

// Create a new community (requires authentication)
router.post("/", verifyToken, createCommunity);

// User joins a community
router.post("/:communityId/join", verifyToken, joinCommunity);

// Get messages for a community (requires membership)
router.get("/:communityId/messages", verifyToken, getCommunityMessages);

// Send a message to a community (requires membership)
router.post("/:communityId/messages", verifyToken, sendMessage);

// Leave a community (requires membership)
router.post("/:communityId/leave", verifyToken, leaveCommunity);

// Upload a chat attachment (requires membership)
router.post(
  "/:communityId/upload",
  verifyToken,
  uploadMiddleware,
  uploadCommunityAttachment
);

// Delete a message (requires admin/moderator role)
router.delete(
  "/:communityId/messages/:messageId",
  verifyToken,
  isCommunityModerator,
  deleteMessage
);

export default router;
```

- [ ] **Step 6: Manual verification**

Run: `cd backend && npm run build`

Expected: TypeScript compiles with no errors referencing `upload.controller.ts` or `cloudinary.ts`.

Then start the dev server and, with a valid JWT for a user who is a member of an existing community, run:

```bash
curl -X POST http://localhost:5002/api/communities/<communityId>/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/small-test-image.png"
```

Expected: `200`/`201` JSON body `{"success":true,"data":{"type":"image","url":"https://res.cloudinary.com/...","name":"small-test-image.png","size":"0.1 MB"},...}`. Open the returned `url` in a browser to confirm it's publicly reachable.

- [ ] **Step 7: Commit**

```bash
git add backend/package.json backend/package-lock.json backend/src/config/config.ts backend/src/config/cloudinary.ts backend/src/api/communities/upload.controller.ts backend/src/api/communities/communities.routes.ts
git commit -m "feat(backend): add Cloudinary-backed community attachment upload endpoint"
```

---

### Task 2: Wire real uploads into MessageInput (frontend)

**Files:**
- Modify: `frontend/src/lib/api/services/communitiesService.ts`
- Modify: `frontend/src/app/(public)/communityChat/[communityId]/_components/MessageInput.tsx`

**Interfaces:**
- Consumes: `apiManager.upload<T>(url, file, onProgress?, config?)` (existing, `frontend/src/lib/api/api-manager.ts:464`), `sendMessage(communityId, content, parentId?, attachments?)` (existing, `frontend/src/lib/socket/communitySocket.ts:53`).
- Produces: `communitiesService.uploadAttachment(communityId: string, file: File): Promise<{ type: "image" | "file"; url: string; name: string; size: string }>`.

- [ ] **Step 1: Add the service method**

Open `frontend/src/lib/api/services/communitiesService.ts` and add this method inside the `CommunitiesService` class, right after `deleteMessage`:

```typescript
  // === Attachments ===
  async uploadAttachment(
    communityId: string,
    file: File
  ): Promise<{ type: "image" | "file"; url: string; name: string; size: string }> {
    const response = await this.api.upload<{
      type: "image" | "file";
      url: string;
      name: string;
      size: string;
    }>(`/communities/${communityId}/upload`, file);
    return response.data;
  }
```

- [ ] **Step 2: Make the upload async and real in MessageInput**

Open `frontend/src/app/(public)/communityChat/[communityId]/_components/MessageInput.tsx`. Add `useState` to the imports (already imports `useRef, useCallback` from `"react"` — change to `useRef, useCallback, useState`), add `communitiesService` and `toast` imports, then replace `handleFileUpload`:

```typescript
import React, { useRef, useCallback, useState } from "react";
```

```typescript
import { toast } from "sonner";
import { communitiesService } from "@/lib/api/services/communitiesService";
```

Replace the existing `handleFileUpload` function with:

```typescript
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const attachment = await communitiesService.uploadAttachment(communityId, file);
      sendMessage(communityId, `Shared ${file.name}`, undefined, [attachment]);
    } catch (err) {
      toast.error("Couldn't upload the file. Try again.");
    } finally {
      setIsUploading(false);
    }
  };
```

Then update the attach button to show a loading state and prevent double-uploads — replace:

```tsx
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-10 w-10 items-center justify-center rounded-md"
              >
                <MdAttachFile className="h-5 w-5" />
              </Button>
```

with:

```tsx
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex h-10 w-10 items-center justify-center rounded-md"
              >
                {isUploading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <MdAttachFile className="h-5 w-5" />
                )}
              </Button>
```

- [ ] **Step 3: Manual verification**

Run: `cd frontend && npm run build`

Expected: build succeeds with no type errors in `MessageInput.tsx` or `communitiesService.ts`.

Then run the dev server, open a community chat, attach a small image, and confirm: the attach button shows a spinner briefly, the message appears with a real `https://res.cloudinary.com/...` image, and refreshing the page still shows the image (proving it isn't a blob URL).

- [ ] **Step 4: Commit**

```bash
git add frontend/src/lib/api/services/communitiesService.ts frontend/src/app/'(public)'/communityChat/'[communityId]'/_components/MessageInput.tsx
git commit -m "feat(frontend): upload chat attachments to Cloudinary instead of local blob URLs"
```

---

### Task 3: Community members list endpoint (backend)

**Files:**
- Modify: `backend/src/api/communities/communities.service.ts`
- Modify: `backend/src/api/communities/communitites.controller.ts`
- Modify: `backend/src/api/communities/communities.routes.ts`

**Interfaces:**
- Produces: `GET /api/communities/:communityId/members` → `ApiResponse<CommunityMemberDTO[]>` where
  ```typescript
  interface CommunityMemberDTO {
    userId: string;
    role: "ADMIN" | "MODERATOR" | "MEMBER";
    joinedAt: string;
    isOnline: boolean;
    user: { id: string; name: string | null; profileImageUrl: string | null };
  }
  ```
  This exact shape is consumed by Task 8 (`CommunityInfoPanel`) and Task 9 (`OnlineUsersSidebar`).

- [ ] **Step 1: Add the service function**

Open `backend/src/api/communities/communities.service.ts` and add this function after `getCommunityMessages`:

```typescript
export const getCommunityMembers = async (
  communityId: string,
  userId: string
) => {
  const isMember = await prisma.communityMember.findUnique({
    where: { userId_communityId: { userId, communityId } },
  });
  if (!isMember) {
    throw new AppError(
      "Access denied. You are not a member of this community.",
      403
    );
  }

  return prisma.communityMember.findMany({
    where: { communityId },
    select: {
      userId: true,
      role: true,
      joinedAt: true,
      isOnline: true,
      user: {
        select: { id: true, name: true, profileImageUrl: true },
      },
    },
    orderBy: { joinedAt: "asc" },
  });
};
```

- [ ] **Step 2: Add the controller function**

Open `backend/src/api/communities/communitites.controller.ts` and add this after `getCommunityMessages`:

```typescript
export const getCommunityMembers = asyncHandler(
  async (req: Request, res: Response) => {
    const { communityId } = req.params;
    const userId = requireUserId(req);

    const members = await communitiesService.getCommunityMembers(
      communityId,
      userId
    );
    sendSuccess(res, members, "Members fetched successfully");
  }
);
```

- [ ] **Step 3: Add the route**

Open `backend/src/api/communities/communities.routes.ts`, add `getCommunityMembers` to the import from `./communitites.controller`, and add this route right after `getCommunityMessages`:

```typescript
// Get members for a community (requires membership)
router.get("/:communityId/members", verifyToken, getCommunityMembers);
```

- [ ] **Step 4: Manual verification**

Run: `cd backend && npm run build`

Expected: no TypeScript errors.

Then with a valid JWT for a member of an existing community:

```bash
curl http://localhost:5002/api/communities/<communityId>/members -H "Authorization: Bearer <token>"
```

Expected: `200` with `data` as an array of objects matching `CommunityMemberDTO`, including real `user.name`.

- [ ] **Step 5: Commit**

```bash
git add backend/src/api/communities/communities.service.ts backend/src/api/communities/communitites.controller.ts backend/src/api/communities/communities.routes.ts
git commit -m "feat(backend): add community members list endpoint"
```

---

### Task 4: Community update/delete + member role/kick endpoints (backend)

**Files:**
- Modify: `backend/src/api/communities/communities.service.ts`
- Modify: `backend/src/api/communities/communitites.controller.ts`
- Modify: `backend/src/api/communities/communities.routes.ts`

**Interfaces:**
- Produces:
  - `PATCH /api/communities/:communityId` (admin-only) → body `{ title?, description?, tags?, isPublic? }`, returns updated `Community`.
  - `DELETE /api/communities/:communityId` (admin-only).
  - `PATCH /api/communities/:communityId/members/:userId/role` (admin-only) → body `{ role: "MODERATOR" | "MEMBER" }`.
  - `DELETE /api/communities/:communityId/members/:userId` (moderator-or-admin) — kicks the target.

- [ ] **Step 1: Add service functions**

Open `backend/src/api/communities/communities.service.ts` and add these after `getCommunityMembers` (from Task 3):

```typescript
export const updateCommunity = async (
  communityId: string,
  data: {
    title?: string;
    description?: string;
    tags?: string[];
    isPublic?: boolean;
  }
) => {
  return prisma.community.update({
    where: { id: communityId },
    data,
  });
};

export const deleteCommunity = async (communityId: string) => {
  await prisma.community.delete({ where: { id: communityId } });
  return null;
};

export const updateMemberRole = async (
  communityId: string,
  actingUserId: string,
  targetUserId: string,
  role: "MODERATOR" | "MEMBER"
) => {
  if (actingUserId === targetUserId) {
    throw new AppError("You cannot change your own role.", 400);
  }

  const target = await prisma.communityMember.findUnique({
    where: { userId_communityId: { userId: targetUserId, communityId } },
  });
  if (!target) {
    throw new AppError("That user is not a member of this community.", 404);
  }
  if (target.role === "ADMIN") {
    throw new AppError("You cannot change another admin's role.", 403);
  }

  return prisma.communityMember.update({
    where: { userId_communityId: { userId: targetUserId, communityId } },
    data: { role },
  });
};

export const kickMember = async (
  communityId: string,
  actingUserId: string,
  actingRole: "ADMIN" | "MODERATOR",
  targetUserId: string
) => {
  if (actingUserId === targetUserId) {
    throw new AppError("You cannot kick yourself. Use leave instead.", 400);
  }

  const target = await prisma.communityMember.findUnique({
    where: { userId_communityId: { userId: targetUserId, communityId } },
  });
  if (!target) {
    throw new AppError("That user is not a member of this community.", 404);
  }
  if (target.role === "ADMIN") {
    throw new AppError("Admins cannot be kicked.", 403);
  }
  if (target.role === "MODERATOR" && actingRole !== "ADMIN") {
    throw new AppError("Only an admin can remove a moderator.", 403);
  }

  await prisma.communityMember.delete({
    where: { userId_communityId: { userId: targetUserId, communityId } },
  });
  return null;
};
```

- [ ] **Step 2: Add controller functions**

Open `backend/src/api/communities/communitites.controller.ts` and add after `getCommunityMembers` (from Task 3):

```typescript
export const updateCommunity = asyncHandler(
  async (req: Request, res: Response) => {
    const { communityId } = req.params;
    const { title, description, tags, isPublic } = req.body;

    const community = await communitiesService.updateCommunity(communityId, {
      title,
      description,
      tags,
      isPublic,
    });
    sendSuccess(res, community, "Community updated successfully");
  }
);

export const deleteCommunity = asyncHandler(
  async (req: Request, res: Response) => {
    const { communityId } = req.params;
    await communitiesService.deleteCommunity(communityId);
    sendSuccess(res, null, "Community deleted successfully");
  }
);

export const updateMemberRole = asyncHandler(
  async (req: Request, res: Response) => {
    const { communityId, userId: targetUserId } = req.params;
    const actingUserId = requireUserId(req);
    const { role } = req.body;

    if (role !== "MODERATOR" && role !== "MEMBER") {
      throw new AppError('Role must be "MODERATOR" or "MEMBER"', 400);
    }

    const member = await communitiesService.updateMemberRole(
      communityId,
      actingUserId,
      targetUserId,
      role
    );
    sendSuccess(res, member, "Member role updated successfully");
  }
);

export const kickMember = asyncHandler(
  async (req: Request, res: Response) => {
    const { communityId, userId: targetUserId } = req.params;
    const actingUserId = requireUserId(req);
    const actingRole = (req as any).communityRole as "ADMIN" | "MODERATOR";

    await communitiesService.kickMember(
      communityId,
      actingUserId,
      actingRole,
      targetUserId
    );
    sendSuccess(res, null, "Member removed successfully");
  }
);
```

`kickMember` needs to know the acting user's role, but `isCommunityModerator` (Task's guard) doesn't currently attach the role to the request. Update `backend/src/core/middleware/isCommunityModerator.ts`'s success path — change:

```typescript
    // User has the required role, proceed
    next();
```

to:

```typescript
    // User has the required role, proceed
    (req as any).communityRole = member.role;
    next();
```

- [ ] **Step 3: Add routes**

Open `backend/src/api/communities/communities.routes.ts`. Add `isCommunityAdmin` to the imports:

```typescript
import { isCommunityAdmin } from "../../core/middleware/isCommunityAdmin";
```

Add `updateCommunity, deleteCommunity, updateMemberRole, kickMember` to the import from `./communitites.controller`. Then add these routes after the members route from Task 3:

```typescript
// Update a community (admin only)
router.patch("/:communityId", verifyToken, isCommunityAdmin, updateCommunity);

// Delete a community (admin only)
router.delete("/:communityId", verifyToken, isCommunityAdmin, deleteCommunity);

// Change a member's role (admin only)
router.patch(
  "/:communityId/members/:userId/role",
  verifyToken,
  isCommunityAdmin,
  updateMemberRole
);

// Kick a member (moderator or admin)
router.delete(
  "/:communityId/members/:userId",
  verifyToken,
  isCommunityModerator,
  kickMember
);
```

- [ ] **Step 4: Manual verification**

Run: `cd backend && npm run build`

Expected: no TypeScript errors.

With a JWT for an admin of a test community:

```bash
curl -X PATCH http://localhost:5002/api/communities/<communityId> \
  -H "Authorization: Bearer <adminToken>" -H "Content-Type: application/json" \
  -d '{"title":"Renamed Community"}'
```

Expected: `200` with updated `title` in the response. Then, with a JWT for a non-admin member, repeat the same request and expect a `403`.

- [ ] **Step 5: Commit**

```bash
git add backend/src/api/communities/communities.service.ts backend/src/api/communities/communitites.controller.ts backend/src/api/communities/communities.routes.ts backend/src/core/middleware/isCommunityModerator.ts
git commit -m "feat(backend): add community update/delete and member role/kick endpoints"
```

---

### Task 5: Frontend hooks + types for members/moderation (frontend)

**Files:**
- Modify: `frontend/src/lib/api/services/communitiesService.ts`
- Modify: `frontend/src/types/community.service.types.ts`
- Modify: `frontend/src/hooks/useCommunities.ts`

**Interfaces:**
- Consumes: nothing new beyond `apiManager` and `Community`/`CreateCommunityRequest`/`UpdateCommunityRequest` types (already defined).
- Produces:
  - `CommunityMember` type: `{ userId: string; role: "ADMIN" | "MODERATOR" | "MEMBER"; joinedAt: string; isOnline: boolean; user: { id: string; name: string | null; profileImageUrl: string | null } }`.
  - `communitiesService.getMembers(communityId): Promise<ApiResponse<CommunityMember[]>>`
  - `communitiesService.updateCommunity(id, data: UpdateCommunityRequest): Promise<ApiResponse<Community>>`
  - `communitiesService.deleteCommunity(id): Promise<ApiResponse<void>>`
  - `communitiesService.updateMemberRole(communityId, userId, role): Promise<ApiResponse<CommunityMember>>`
  - `communitiesService.kickMember(communityId, userId): Promise<ApiResponse<void>>`
  - Hooks: `useCommunityMembers(communityId)`, `useUpdateCommunity()`, `useDeleteCommunity()`, `useUpdateMemberRole(communityId)`, `useKickMember(communityId)` — all consumed by Task 8 and Task 9.

- [ ] **Step 1: Add the `CommunityMember` type**

Open `frontend/src/types/community.service.types.ts` and add at the end:

```typescript
export interface CommunityMember {
  userId: string;
  role: "ADMIN" | "MODERATOR" | "MEMBER";
  joinedAt: string;
  isOnline: boolean;
  user: {
    id: string;
    name: string | null;
    profileImageUrl: string | null;
  };
}
```

- [ ] **Step 2: Add service methods**

Open `frontend/src/lib/api/services/communitiesService.ts`. Add `CommunityMember` to the type import at the top:

```typescript
import {
  Community,
  CreateCommunityRequest,
  UpdateCommunityRequest,
  CommunityMember,
} from "@/types/community.service.types";
```

Add these methods inside the class, after `getCommunityMembers` is not yet there — add right after `leaveCommunity`:

```typescript
  async getMembers(id: string): Promise<ApiResponse<CommunityMember[]>> {
    return this.api.get<CommunityMember[]>(`/communities/${id}/members`);
  }

  async updateCommunity(
    id: string,
    data: UpdateCommunityRequest
  ): Promise<ApiResponse<Community>> {
    return this.api.patch<Community>(`/communities/${id}`, data);
  }

  async deleteCommunityPermanently(id: string): Promise<ApiResponse<void>> {
    return this.api.delete<void>(`/communities/${id}`);
  }

  async updateMemberRole(
    communityId: string,
    userId: string,
    role: "MODERATOR" | "MEMBER"
  ): Promise<ApiResponse<CommunityMember>> {
    return this.api.patch<CommunityMember>(
      `/communities/${communityId}/members/${userId}/role`,
      { role }
    );
  }

  async kickMember(
    communityId: string,
    userId: string
  ): Promise<ApiResponse<void>> {
    return this.api.delete<void>(
      `/communities/${communityId}/members/${userId}`
    );
  }
```

(Named `deleteCommunityPermanently` to read clearly next to the existing `leaveCommunity` method on the same class — `communitiesService.ts` has no pre-existing `deleteCommunity` method, so there is no collision to check for.)

- [ ] **Step 3: Add hooks**

Open `frontend/src/hooks/useCommunities.ts` and add `CommunityMember` to imports:

```typescript
import { Community } from "@/types/community";
```

stays as-is; add at the bottom of the file:

```typescript
export const useCommunityMembers = (communityId: string) => {
  return useQuery({
    queryKey: ["community-members", communityId],
    queryFn: async () => {
      const response = await communitiesService.getMembers(communityId);
      return response.data || [];
    },
    enabled: !!communityId,
    staleTime: 30 * 1000,
  });
};

export const useUpdateCommunity = (communityId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title?: string;
      description?: string;
      tags?: string[];
      isPublic?: boolean;
    }) => {
      const response = await communitiesService.updateCommunity(communityId, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community", communityId] });
      queryClient.invalidateQueries({ queryKey: ["communities"] });
    },
  });
};

export const useDeleteCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (communityId: string) => {
      await communitiesService.deleteCommunityPermanently(communityId);
      return communityId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
    },
  });
};

export const useUpdateMemberRole = (communityId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { userId: string; role: "MODERATOR" | "MEMBER" }) => {
      const response = await communitiesService.updateMemberRole(
        communityId,
        data.userId,
        data.role
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-members", communityId] });
    },
  });
};

export const useKickMember = (communityId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      await communitiesService.kickMember(communityId, userId);
      return userId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-members", communityId] });
    },
  });
};
```

- [ ] **Step 4: Manual verification**

Run: `cd frontend && npm run build`

Expected: no TypeScript errors from `useCommunities.ts`, `communitiesService.ts`, or `community.service.types.ts`.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/types/community.service.types.ts frontend/src/lib/api/services/communitiesService.ts frontend/src/hooks/useCommunities.ts
git commit -m "feat(frontend): add members/moderation service methods and hooks"
```

---

### Task 6: CommunityInfoPanel dialog (frontend)

**Files:**
- Create: `frontend/src/app/(public)/communityChat/[communityId]/_components/CommunityInfoPanel.tsx`

**Interfaces:**
- Consumes: `useCommunityMembers`, `useUpdateCommunity`, `useDeleteCommunity`, `useUpdateMemberRole`, `useKickMember` (Task 5), `useLeaveCommunity` (existing), `Community` type (existing), shadcn `Dialog`/`DialogContent`/`DialogHeader`/`DialogTitle`/`Tabs`/`TabsList`/`TabsTrigger`/`TabsContent`/`Badge`/`Button`/`Input`/`Textarea`.
- Produces: `<CommunityInfoPanel communityId, community: Community, isAdmin, isModerator, open, onOpenChange, initialTab?: "info" | "settings" | "members" />` — consumed by Task 7 (header wiring).

- [ ] **Step 1: Write the component**

Create `frontend/src/app/(public)/communityChat/[communityId]/_components/CommunityInfoPanel.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { Community } from "@/types/community";
import {
  useCommunityMembers,
  useUpdateCommunity,
  useDeleteCommunity,
  useUpdateMemberRole,
  useKickMember,
  useLeaveCommunity,
} from "@/hooks/useCommunities";

interface CommunityInfoPanelProps {
  communityId: string;
  community: Community;
  isAdmin: boolean;
  isModerator: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: "info" | "settings" | "members";
}

const CommunityInfoPanel = ({
  communityId,
  community,
  isAdmin,
  isModerator,
  open,
  onOpenChange,
  initialTab = "info",
}: CommunityInfoPanelProps) => {
  const router = useRouter();
  const { data: members, isLoading: loadingMembers } = useCommunityMembers(communityId);
  const updateCommunity = useUpdateCommunity(communityId);
  const deleteCommunity = useDeleteCommunity();
  const updateRole = useUpdateMemberRole(communityId);
  const kickMember = useKickMember(communityId);
  const leaveCommunity = useLeaveCommunity();

  const [title, setTitle] = useState(community.title);
  const [description, setDescription] = useState(community.description || "");

  const handleSaveSettings = () => {
    updateCommunity.mutate(
      { title, description },
      {
        onSuccess: () => toast.success("Community updated"),
        onError: () => toast.error("Couldn't update the community. Try again."),
      }
    );
  };

  const handleDeleteCommunity = () => {
    if (!confirm(`Delete "${community.title}"? This cannot be undone.`)) return;
    deleteCommunity.mutate(communityId, {
      onSuccess: () => {
        toast.success("Community deleted");
        router.push("/communityChat");
      },
      onError: () => toast.error("Couldn't delete the community. Try again."),
    });
  };

  const handleLeave = () => {
    leaveCommunity.mutate(communityId, {
      onSuccess: () => {
        onOpenChange(false);
        router.push("/communityChat");
      },
      onError: () => toast.error("Couldn't leave the community. Try again."),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{community.title}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={initialTab}>
          <TabsList>
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            {isAdmin && <TabsTrigger value="settings">Settings</TabsTrigger>}
          </TabsList>

          <TabsContent value="info" className="space-y-3">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {community.description || "No description yet."}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {community.tags?.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <Button variant="destructive" size="sm" onClick={handleLeave}>
              Leave Community
            </Button>
          </TabsContent>

          <TabsContent value="members" className="space-y-2 max-h-80 overflow-y-auto">
            {loadingMembers ? (
              <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
            ) : (
              members?.map((member) => (
                <div
                  key={member.userId}
                  className="flex items-center justify-between rounded-lg p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.user.profileImageUrl || undefined} />
                      <AvatarFallback>
                        {(member.user.name || "?").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{member.user.name}</div>
                      <Badge variant="outline" className="text-[10px]">
                        {member.role}
                      </Badge>
                    </div>
                  </div>
                  {isAdmin && member.role !== "ADMIN" && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={updateRole.isPending}
                        onClick={() =>
                          updateRole.mutate({
                            userId: member.userId,
                            role: member.role === "MODERATOR" ? "MEMBER" : "MODERATOR",
                          })
                        }
                      >
                        {member.role === "MODERATOR" ? "Demote" : "Promote"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={kickMember.isPending}
                        onClick={() => kickMember.mutate(member.userId)}
                      >
                        Kick
                      </Button>
                    </div>
                  )}
                  {isModerator && !isAdmin && member.role === "MEMBER" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={kickMember.isPending}
                      onClick={() => kickMember.mutate(member.userId)}
                    >
                      Kick
                    </Button>
                  )}
                </div>
              ))
            )}
          </TabsContent>

          {isAdmin && (
            <TabsContent value="settings" className="space-y-3">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} />
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                maxLength={280}
              />
              <div className="flex items-center justify-between">
                <Button onClick={handleSaveSettings} disabled={updateCommunity.isPending}>
                  {updateCommunity.isPending && (
                    <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  )}
                  Save changes
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteCommunity}
                  disabled={deleteCommunity.isPending}
                >
                  Delete Community
                </Button>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CommunityInfoPanel;
```

- [ ] **Step 2: Manual verification**

Run: `cd frontend && npm run build`

Expected: no TypeScript errors in this new file (it isn't imported anywhere yet, so a build failure here means a real type mismatch — check against Task 5's exact hook signatures).

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/'(public)'/communityChat/'[communityId]'/_components/CommunityInfoPanel.tsx
git commit -m "feat(frontend): add CommunityInfoPanel dialog (info/members/settings tabs)"
```

---

### Task 7: Wire the header "More" menu + Search + Shared Files (frontend)

**Files:**
- Modify: `frontend/src/app/(public)/communityChat/[communityId]/_components/ChatHeaderComponent.tsx`
- Modify: `frontend/src/app/(public)/communityChat/[communityId]/_components/MessageCard.tsx` (add `id` attribute for scroll-to-search)

**Interfaces:**
- Consumes: `CommunityInfoPanel` (Task 6), `useCommunityChatStore().messages` (existing), `useLeaveCommunity` (existing).
- Produces: fully functional More menu; no new exports (this is a leaf UI wiring task).

- [ ] **Step 1: Add an `id` to each message bubble for scroll-to-search**

Open `frontend/src/app/(public)/communityChat/[communityId]/_components/MessageCard.tsx` and change the outermost `motion.div`'s className line to also set an id — replace:

```tsx
      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
```

with:

```tsx
      id={`message-${msg.id}`}
      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
```

- [ ] **Step 2: Rewrite `ChatHeaderComponent.tsx`**

Open `frontend/src/app/(public)/communityChat/[communityId]/_components/ChatHeaderComponent.tsx`. Replace the whole file:

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { BiArrowBack, BiFile } from "react-icons/bi";
import {
  MdMoreVert,
  MdClose,
  MdSearch,
  MdPeople,
  MdSettings,
  MdPushPin,
} from "react-icons/md";
import { ThemeModeToggle } from "@/components/common/ThemeModeToggle";
import { Community } from "@/types/community";

import PinnedMessagesButton from "./PinnedMessagesButton";
import CommunityInfoPanel from "./CommunityInfoPanel";
import { useCommunityChatStore } from "@/zustand/communityChatStore";
import { useLeaveCommunity } from "@/hooks/useCommunities";
import { getCategoryColor } from "../../_components/categoryColors";

const headerIconButtonClass =
  "relative group h-10 w-10 border-zinc-200 dark:border-zinc-700 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors duration-200";

type ChatHeaderComponentProps = {
  userId: string;
  community: Community | null | undefined;
  onlineCount: number;
  isAdmin: boolean;
  isModerator?: boolean;
};

const ChatHeaderComponent = (props: ChatHeaderComponentProps) => {
  const {
    messages,
    showPinnedPanel,
    setShowPinnedPanel,
    togglePinMessage,
    setShowOnlineUsers,
    showOnlineUsers,
  } = useCommunityChatStore();

  const [infoPanelOpen, setInfoPanelOpen] = useState(false);
  const [infoPanelTab, setInfoPanelTab] = useState<"info" | "settings" | "members">("info");

  const pinnedMessages = messages.filter((msg) => msg.isPinned);
  const color = props.community?.category
    ? getCategoryColor(props.community.category.name)
    : getCategoryColor("all");
  const initials = (props.community?.title || "?")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const openInfoPanel = (tab: "info" | "settings" | "members") => {
    setInfoPanelTab(tab);
    setInfoPanelOpen(true);
  };

  return (
    <div className="flex h-16 items-center justify-between bg-white px-4 py-3 shadow-sm dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
      <div className="flex items-center space-x-3">
        <Link href="/communityChat">
          <Button variant="outline" size="icon" className={headerIconButtonClass}>
            <BiArrowBack className="h-[1.2rem] w-[1.2rem] text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform duration-200" />
          </Button>
        </Link>

        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className={`${color.bg} ${color.text} font-semibold`}>
              {initials}
            </AvatarFallback>
          </Avatar>

          <div>
            <h2 className="font-semibold tracking-tight text-gray-900 dark:text-white">
              {props.community?.title}
            </h2>

            <div className="flex items-center space-x-2">
              <div
                className={`h-2 w-2 rounded-full ${props.onlineCount > 0 ? "bg-green-500" : "bg-zinc-300 dark:bg-zinc-600"}`}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {props.onlineCount} online
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <SearchMessagesButton />

        <PinnedMessagesButton
          pinnedMessages={pinnedMessages}
          showPinnedPanel={showPinnedPanel}
          setShowPinnedPanel={setShowPinnedPanel}
          isAdmin={props.isAdmin}
          togglePinMessage={togglePinMessage}
        />

        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowOnlineUsers(!showOnlineUsers)}
          aria-pressed={showOnlineUsers}
          className={`${headerIconButtonClass} ${showOnlineUsers ? "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-800" : ""}`}
        >
          <MdPeople
            className={`h-[1.2rem] w-[1.2rem] group-hover:scale-110 transition-transform duration-200 ${showOnlineUsers ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}
          />
        </Button>

        <ThemeModeToggle />

        <MoreIconButton
          isAdmin={props.isAdmin}
          onOpenInfo={() => openInfoPanel("info")}
          onOpenSettings={() => openInfoPanel("settings")}
          onOpenMembers={() => openInfoPanel("members")}
        />
      </div>

      {props.community && (
        <CommunityInfoPanel
          communityId={props.community.id}
          community={props.community}
          isAdmin={props.isAdmin}
          isModerator={!!props.isModerator}
          open={infoPanelOpen}
          onOpenChange={setInfoPanelOpen}
          initialTab={infoPanelTab}
        />
      )}
    </div>
  );
};

export default ChatHeaderComponent;

// ------------------------------------------- SEARCH MESSAGES -------------------------------------------
const SearchMessagesButton = () => {
  const { messages } = useCommunityChatStore();
  const [query, setQuery] = useState("");

  const results = query.trim()
    ? messages.filter((m) => m.content.toLowerCase().includes(query.trim().toLowerCase()))
    : [];

  const scrollTo = (messageId: string) => {
    document
      .getElementById(`message-${messageId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className={headerIconButtonClass}>
          <MdSearch className="h-[1.2rem] w-[1.2rem] text-gray-600 dark:text-gray-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2" align="end">
        <Input
          autoFocus
          placeholder="Search messages..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="mt-2 max-h-56 space-y-1 overflow-y-auto">
          {results.map((m) => (
            <button
              key={m.id}
              onClick={() => scrollTo(m.id)}
              className="w-full rounded-md p-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700"
            >
              <span className="font-medium">{m.senderName}: </span>
              <span className="text-zinc-500">{m.content}</span>
            </button>
          ))}
          {query.trim() && results.length === 0 && (
            <p className="p-2 text-sm text-zinc-400">No matches in the loaded messages.</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

// ------------------------------------------- MORE ICON BUTTON -------------------------------------------
type MoreIconButtonProps = {
  isAdmin: boolean;
  onOpenInfo: () => void;
  onOpenSettings: () => void;
  onOpenMembers: () => void;
};

const MoreIconButton = ({ isAdmin, onOpenInfo, onOpenSettings, onOpenMembers }: MoreIconButtonProps) => {
  const router = useRouter();
  const { messages } = useCommunityChatStore();
  const leaveCommunity = useLeaveCommunity();
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const communityId = typeof window !== "undefined" ? window.location.pathname.split("/").pop() : "";

  const sharedFiles = messages.filter((m) => m.attachments.length > 0);

  const handleLeave = () => {
    if (!communityId) return;
    leaveCommunity.mutate(communityId, {
      onSuccess: () => router.push("/communityChat"),
      onError: () => toast.error("Couldn't leave the community. Try again."),
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className={headerIconButtonClass}>
          <MdMoreVert className="h-[1.2rem] w-[1.2rem] text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform duration-200" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-0 border border-gray-200 dark:border-zinc-700 shadow-xl bg-white dark:bg-zinc-800 rounded-xl"
        align="end"
      >
        <div className="p-2">
          <div className="space-y-1">
            <button
              onClick={onOpenInfo}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-300 rounded-lg transition-all duration-200"
            >
              <MdPeople className="h-4 w-4" />
              <span>Community Info</span>
            </button>

            <button
              onClick={onOpenMembers}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 rounded-lg transition-all duration-200"
            >
              <MdPeople className="h-4 w-4" />
              <span>Members</span>
            </button>

            {isAdmin && (
              <button
                onClick={onOpenSettings}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300 rounded-lg transition-all duration-200"
              >
                <MdSettings className="h-4 w-4" />
                <span>Community Settings</span>
              </button>
            )}
          </div>

          <Separator className="my-2 bg-gray-200 dark:bg-zinc-700" />

          <Popover>
            <PopoverTrigger asChild>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-700 dark:hover:text-yellow-300 rounded-lg transition-all duration-200">
                <BiFile className="h-4 w-4" />
                <span>Shared Files ({sharedFiles.length})</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 max-h-64 overflow-y-auto p-2" align="start">
              {sharedFiles.length === 0 ? (
                <p className="p-2 text-sm text-zinc-400">No files shared yet.</p>
              ) : (
                sharedFiles.flatMap((m) =>
                  m.attachments.map((att, i) => (
                    <a
                      key={`${m.id}-${i}`}
                      href={att.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-md p-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700"
                    >
                      <BiFile className="h-4 w-4 shrink-0 text-blue-500" />
                      <span className="truncate">{att.name}</span>
                    </a>
                  ))
                )
              )}
            </PopoverContent>
          </Popover>

          <Separator className="my-2 bg-gray-200 dark:bg-zinc-700" />

          <button
            onClick={handleLeave}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 rounded-lg transition-all duration-200"
          >
            <MdClose className="h-4 w-4" />
            <span>Leave Community</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
```

- [ ] **Step 3: Fix the `Community` type's role casing, then update the page to pass `isModerator`**

`frontend/src/types/community.ts`'s `members[].role` is currently typed as `"member" | "admin" | "owner"` (lowercase), but the backend's `CommunityRole` Prisma enum (`backend/prisma/schema.prisma:1052-1056`) is `ADMIN | MODERATOR | MEMBER` (uppercase), and Express/Prisma serializes enum values to JSON as-is with no casing transform — so the API has always actually returned uppercase values. This mismatch was never caught because the page previously hardcoded `isAdmin={false}` instead of comparing against `member.role`. Fix the type to match reality:

Open `frontend/src/types/community.ts` and change:

```typescript
    role: "member" | "admin" | "owner"; // role of the user in the community
```

to:

```typescript
    role: "ADMIN" | "MODERATOR" | "MEMBER"; // matches the backend's CommunityRole enum
```

Then open `frontend/src/app/(public)/communityChat/[communityId]/page.tsx` and change:

```tsx
        <ChatHeaderComponent
          userId={userId}
          community={community}
          onlineCount={onlineUsers.filter((u) => u.isOnline).length}
          isAdmin={false}
        />
```

to:

```tsx
        <ChatHeaderComponent
          userId={userId}
          community={community}
          onlineCount={onlineUsers.filter((u) => u.isOnline).length}
          isAdmin={community.members?.some((m) => m.user.id === userId && m.role === "ADMIN") ?? false}
          isModerator={community.members?.some((m) => m.user.id === userId && (m.role === "ADMIN" || m.role === "MODERATOR")) ?? false}
        />
```

- [ ] **Step 4: Manual verification**

Run: `cd frontend && npm run build`

Expected: no TypeScript errors.

Then in the dev server: open a community you're an admin of, confirm "Community Settings" appears and editing the title/description works and is reflected after reopening the panel; open "Members" and confirm promote/demote/kick buttons work and update in real time for the kicked/promoted user (open two browser sessions); type into "Search Messages" and confirm clicking a result scrolls to that message; click "Shared Files" after sending an attachment (Task 2) and confirm it's listed; click "Leave Community" and confirm you're redirected to `/communityChat` and removed from the community.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/'(public)'/communityChat/'[communityId]'/_components/ChatHeaderComponent.tsx frontend/src/app/'(public)'/communityChat/'[communityId]'/_components/MessageCard.tsx frontend/src/app/'(public)'/communityChat/'[communityId]'/page.tsx
git commit -m "feat(frontend): wire up chat header more-menu (info, settings, members, search, shared files, leave)"
```

---

### Task 8: Real names in OnlineUsersSidebar (frontend)

**Files:**
- Modify: `frontend/src/app/(public)/communityChat/[communityId]/_components/OnlineUsersSidebar.tsx`

**Interfaces:**
- Consumes: `useCommunityMembers(communityId)` (Task 5), `useCommunityChatStore().onlineUsers` (existing).
- Produces: no new exports; this is a leaf UI fix.

- [ ] **Step 1: Rewrite the component to merge members with live presence**

Open `frontend/src/app/(public)/communityChat/[communityId]/_components/OnlineUsersSidebar.tsx`. Replace the whole file:

```tsx
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MdClose } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCommunityChatStore } from "@/zustand/communityChatStore";
import { useCommunityMembers } from "@/hooks/useCommunities";
import { useParams } from "next/navigation";

const OnlineUsersSidebar = () => {
  const { showOnlineUsers, setShowOnlineUsers, onlineUsers } =
    useCommunityChatStore();
  const params = useParams<{ communityId?: string }>();
  const communityId = params?.communityId || "";
  const { data: members } = useCommunityMembers(communityId);

  if (!showOnlineUsers) return null;

  const presenceMap = new Map(onlineUsers.map((u) => [u.userId, u.isOnline]));

  const rows = (members || []).map((member) => ({
    userId: member.userId,
    name: member.user.name || "Unknown",
    avatar: member.user.profileImageUrl,
    isOnline: presenceMap.has(member.userId) ? !!presenceMap.get(member.userId) : member.isOnline,
  }));

  const online = rows.filter((r) => r.isOnline);
  const offline = rows.filter((r) => !r.isOnline);

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 280, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      className="border-l border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-800"
    >
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Online — {online.length}
          </h3>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowOnlineUsers(false)}
            className="h-8 w-8"
          >
            <MdClose className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-1">
            {online.map((user) => (
              <UserRow key={user.userId} {...user} />
            ))}

            {offline.length > 0 && (
              <>
                <div className="pb-1 pt-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                  Offline — {offline.length}
                </div>
                {offline.map((user) => (
                  <UserRow key={user.userId} {...user} />
                ))}
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </motion.div>
  );
};

const UserRow = ({
  name,
  avatar,
  isOnline,
}: {
  userId: string;
  name: string;
  avatar: string | null;
  isOnline: boolean;
}) => {
  return (
    <div className="flex items-center space-x-3 rounded-lg p-2 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-700">
      <div className="relative">
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatar || undefined} />
          <AvatarFallback className="text-xs">{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div
          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-800 ${
            isOnline ? "bg-green-500" : "bg-gray-400"
          }`}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-gray-900 dark:text-white">{name}</div>
        <div className="text-xs capitalize text-gray-500 dark:text-gray-400">
          {isOnline ? "Online" : "Offline"}
        </div>
      </div>
    </div>
  );
};

export default OnlineUsersSidebar;
```

- [ ] **Step 2: Manual verification**

Run: `cd frontend && npm run build`

Expected: no TypeScript errors.

In the dev server, open the online users sidebar and confirm real member names/avatars show instead of truncated user IDs; open a second session as another member and confirm their online/offline status updates live when they connect/disconnect.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/'(public)'/communityChat/'[communityId]'/_components/OnlineUsersSidebar.tsx
git commit -m "fix(frontend): show real member names/avatars in OnlineUsersSidebar"
```

---

### Task 9: Reply thread view (frontend)

**Files:**
- Modify: `frontend/src/zustand/communityChatStore.ts` (add `openThreadId` state)
- Create: `frontend/src/app/(public)/communityChat/[communityId]/_components/ThreadDialog.tsx`
- Modify: `frontend/src/app/(public)/communityChat/[communityId]/_components/MessageCard.tsx` (add "N replies" pill)
- Modify: `frontend/src/app/(public)/communityChat/[communityId]/page.tsx` (render `ThreadDialog`)

**Interfaces:**
- Consumes: `ChatMessage` type (existing), `sendMessage` from `communitySocket.ts` (existing).
- Produces: `useCommunityChatStore().openThreadId: string | null`, `setOpenThreadId(id: string | null): void` — consumed by `MessageCard` and `ThreadDialog`.

- [ ] **Step 1: Add thread state to the store**

Open `frontend/src/zustand/communityChatStore.ts`. Add to `CommunityChatState`:

```typescript
  openThreadId: string | null;
```

Add to `CommunityChatActions`:

```typescript
  setOpenThreadId: (id: string | null) => void;
```

Add to `initialState`:

```typescript
  openThreadId: null,
```

Add to the store implementation (next to `setShowOnlineUsers`):

```typescript
    setOpenThreadId: (id) => set({ openThreadId: id }),
```

- [ ] **Step 2: Add the "N replies" pill to MessageCard**

Open `frontend/src/app/(public)/communityChat/[communityId]/_components/MessageCard.tsx`. Add `setOpenThreadId` to the store destructure:

```typescript
  const {
    quickReactions,
    showReactionPicker,
    setShowReactionPicker,
    setReplyingTo,
    setEditingMessage,
    setOpenThreadId,
  } = useCommunityChatStore();
```

Then, right after the closing `</div>` of the "Reactions + timestamp" block (i.e., right before the `{/* Actions */}` comment), add:

```tsx
        {msg.replyCount > 0 && (
          <button
            onClick={() => setOpenThreadId(msg.id)}
            className={`mt-1 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400`}
          >
            ↩ {msg.replyCount} {msg.replyCount === 1 ? "reply" : "replies"}
          </button>
        )}
```

- [ ] **Step 3: Create ThreadDialog**

Create `frontend/src/app/(public)/communityChat/[communityId]/_components/ThreadDialog.tsx`:

```tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCommunityChatStore } from "@/zustand/communityChatStore";
import { sendMessage } from "@/lib/socket/communitySocket";
import { formatCommunityTime } from "@/lib/utils/utils";

interface ThreadDialogProps {
  communityId: string;
}

const ThreadDialog = ({ communityId }: ThreadDialogProps) => {
  const { messages, openThreadId, setOpenThreadId } = useCommunityChatStore();
  const [replyText, setReplyText] = useState("");

  const rootMessage = messages.find((m) => m.id === openThreadId);
  const replies = openThreadId
    ? messages.filter((m) => m.parentId === openThreadId)
    : [];

  const handleReply = () => {
    if (!replyText.trim() || !openThreadId) return;
    sendMessage(communityId, replyText.trim(), openThreadId);
    setReplyText("");
  };

  return (
    <Dialog open={!!openThreadId} onOpenChange={(open) => !open && setOpenThreadId(null)}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Thread</DialogTitle>
        </DialogHeader>

        {rootMessage && (
          <div className="max-h-96 space-y-3 overflow-y-auto">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
              <div className="mb-1 flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={rootMessage.senderAvatar || undefined} />
                  <AvatarFallback>{rootMessage.senderName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{rootMessage.senderName}</span>
              </div>
              <p className="text-sm">{rootMessage.content}</p>
            </div>

            {replies.map((reply) => (
              <div key={reply.id} className="ml-4 border-l-2 border-blue-200 pl-3 dark:border-blue-800">
                <div className="mb-1 flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={reply.senderAvatar || undefined} />
                    <AvatarFallback>{reply.senderName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{reply.senderName}</span>
                  <span className="text-xs text-gray-400">{formatCommunityTime(reply.createdAt)}</span>
                </div>
                <p className="text-sm">{reply.content}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 border-t border-gray-200 pt-3 dark:border-zinc-700">
          <input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleReply();
              }
            }}
            placeholder="Reply in thread..."
            className="h-9 flex-1 rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 dark:border-zinc-600 dark:bg-zinc-700"
          />
          <Button size="sm" onClick={handleReply} disabled={!replyText.trim()}>
            Reply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThreadDialog;
```

- [ ] **Step 4: Render ThreadDialog on the chat page**

Open `frontend/src/app/(public)/communityChat/[communityId]/page.tsx`. Add the import:

```typescript
import ThreadDialog from "./_components/ThreadDialog";
```

Add `<ThreadDialog communityId={communityId} />` right before the closing `</div>` of the outermost `<div className="flex h-screen flex-col ...">` (i.e., as the last child of the page, after the `{/* Main Content Area */}` block).

- [ ] **Step 5: Manual verification**

Run: `cd frontend && npm run build`

Expected: no TypeScript errors.

In the dev server: reply to a message, confirm a "1 reply" pill appears on the original message, click it, confirm the thread dialog shows the root message and the reply, type a new reply in the thread box and confirm it appears both in the thread and as a normal reply-linked message in the main feed.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/zustand/communityChatStore.ts frontend/src/app/'(public)'/communityChat/'[communityId]'/_components/ThreadDialog.tsx frontend/src/app/'(public)'/communityChat/'[communityId]'/_components/MessageCard.tsx frontend/src/app/'(public)'/communityChat/'[communityId]'/page.tsx
git commit -m "feat(frontend): add reply thread view (N replies pill + thread dialog)"
```

---

### Task 10: Extract shared CommunityChatWindow (frontend)

**Files:**
- Create: `frontend/src/components/community/CommunityChatWindow.tsx`
- Modify: `frontend/src/app/(public)/communityChat/[communityId]/page.tsx`

**Interfaces:**
- Consumes: `initCommunitySocket`/`disconnectSocket` (existing), `useCommunityChatStore` (existing), `ChatMessages`/`ReplyPreview`/`MessageInput` (existing, imported via relative path from the public route's `_components` folder), `ThreadDialog` (Task 9).
- Produces: `<CommunityChatWindow communityId, token, userId, communityTitle />` — self-contained: owns its own socket lifecycle, renders the scrollable message list + reply preview + input + thread dialog. Consumed by both the public page (Task 10 Step 2) and the instructor page (Task 11).

- [ ] **Step 1: Create the shared component**

Create `frontend/src/components/community/CommunityChatWindow.tsx`. This pulls the socket-wiring `useEffect` and message-rendering JSX out of the public page, reusing the exact same `_components` (imported via relative path since they aren't exported from a shared barrel):

```tsx
"use client";

import { useEffect, useRef } from "react";
import { MessageSquareText } from "lucide-react";
import { useCommunityChatStore } from "@/zustand/communityChatStore";
import { initCommunitySocket, disconnectSocket } from "@/lib/socket/communitySocket";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessages from "@/app/(public)/communityChat/[communityId]/_components/ChatMessages";
import ReplyPreview from "@/app/(public)/communityChat/[communityId]/_components/ReplyPreview";
import MessageInput from "@/app/(public)/communityChat/[communityId]/_components/MessageInput";
import PinnedMessagesTopBanner from "@/app/(public)/communityChat/[communityId]/_components/PinnedMessagesTopBanner";
import ThreadDialog from "@/app/(public)/communityChat/[communityId]/_components/ThreadDialog";

interface CommunityChatWindowProps {
  communityId: string;
  token: string;
  communityTitle?: string;
  isAdmin?: boolean;
}

const CommunityChatWindow = ({
  communityId,
  token,
  communityTitle,
  isAdmin = false,
}: CommunityChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    setMessages,
    addMessage,
    updateMessage,
    removeMessage,
    setReactions,
    setPinned,
    setTypingUser,
    setUserPresence,
    reset,
  } = useCommunityChatStore();

  useEffect(() => {
    if (!token || !communityId) return;

    initCommunitySocket(communityId, token, {
      onInitMessages: (msgs) => setMessages(msgs),
      onNewMessage: (msg) => addMessage(msg),
      onMessageEdited: (msg) => updateMessage(msg),
      onMessageDeleted: ({ messageId }) => removeMessage(messageId),
      onReaction: ({ messageId, reactions }) => setReactions(messageId, reactions),
      onPinned: ({ message, isPinned }) => {
        if (message) setPinned(message.id, isPinned);
      },
      onTypingUpdate: ({ userId, name, isTyping }) =>
        setTypingUser(userId, name || "Someone", isTyping),
      onPresenceUpdate: ({ userId, isOnline }) => setUserPresence(userId, isOnline),
    });

    return () => {
      disconnectSocket();
      reset();
    };
  }, [communityId, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 p-4">
        <PinnedMessagesTopBanner isAdmin={isAdmin} />

        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center px-4 py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-500/10 mb-4">
              <MessageSquareText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">
              Welcome to {communityTitle || "this community"}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
              This is the start of the conversation. Be respectful and enjoy the discussion!
            </p>
          </div>
        ) : (
          <>
            <ChatMessages />
            <div ref={messagesEndRef} />
          </>
        )}
      </ScrollArea>

      <ReplyPreview />
      <MessageInput communityId={communityId} />
      <ThreadDialog communityId={communityId} />
    </div>
  );
};

export default CommunityChatWindow;
```

- [ ] **Step 2: Simplify the public page to use it**

Open `frontend/src/app/(public)/communityChat/[communityId]/page.tsx` and replace its whole body to delegate to `CommunityChatWindow`, keeping the header/pinned-panel/sidebar chrome:

```tsx
"use client";

import React from "react";
import { useCommunityById } from "@/hooks/useCommunities";
import { useUserStore } from "@/zustand/userStore";

import ChatHeaderComponent from "./_components/ChatHeaderComponent";
import PinnedMessagesPanel from "./_components/PinnedMessagesPanel";
import OnlineUsersSidebar from "./_components/OnlineUsersSidebar";
import CommunityChatWindow from "@/components/community/CommunityChatWindow";
import { useCommunityChatStore } from "@/zustand/communityChatStore";
import { useParams } from "next/navigation";

const CommunityPage = () => {
  const { user, token } = useUserStore();
  const userId = user?.id;

  const params = useParams<{ communityId?: string }>();
  const communityId = params?.communityId;

  const { data: community, isLoading, error } = useCommunityById(communityId || "");
  const { onlineUsers } = useCommunityChatStore();

  if (!userId || !communityId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-zinc-500">Please log in to access community chat.</p>
      </div>
    );
  }

  const isAdmin =
    community?.members?.some((m) => m.user.id === userId && m.role === "ADMIN") ?? false;
  const isModerator =
    community?.members?.some(
      (m) => m.user.id === userId && (m.role === "ADMIN" || m.role === "MODERATOR")
    ) ?? false;

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-zinc-900">
      {!isLoading && !error && community && (
        <ChatHeaderComponent
          userId={userId}
          community={community}
          onlineCount={onlineUsers.filter((u) => u.isOnline).length}
          isAdmin={isAdmin}
          isModerator={isModerator}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col">
          {token && (
            <CommunityChatWindow
              communityId={communityId}
              token={token}
              communityTitle={community?.title}
              isAdmin={isAdmin}
            />
          )}
        </div>

        <PinnedMessagesPanel />
        <OnlineUsersSidebar />
      </div>
    </div>
  );
};

export default CommunityPage;
```

This uses the same `"ADMIN"`/`"MODERATOR"` casing established in Task 7 Step 3's fix to `frontend/src/types/community.ts`.

- [ ] **Step 3: Manual verification**

Run: `cd frontend && npm run build`

Expected: no TypeScript errors.

In the dev server, open the public community chat page end to end and confirm every previous feature (send, edit, delete, react, pin, typing, presence, reply thread) still works identically to before this refactor.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/community/CommunityChatWindow.tsx frontend/src/app/'(public)'/communityChat/'[communityId]'/page.tsx
git commit -m "refactor(frontend): extract CommunityChatWindow for reuse across public and instructor routes"
```

---

### Task 11: Consolidate instructor communities chat (frontend)

**Files:**
- Modify: `frontend/src/app/(instructor)/instructor/communities/page.tsx`
- Delete: `frontend/src/app/(instructor)/instructor/communities/_components/CommunityChat.tsx`
- Modify: `frontend/src/hooks/useCommunities.ts` (remove `useCommunityMessages`/`useSendMessage` only if nothing else references them)

**Interfaces:**
- Consumes: `CommunityChatWindow` (Task 10).
- Produces: nothing new; this is a deletion/consolidation task.

- [ ] **Step 1: Check for other references before deleting anything**

Run:

```bash
grep -rn "useCommunityMessages\|useSendMessage" frontend/src --include="*.tsx" --include="*.ts"
```

Expected: only `useCommunities.ts` (the definitions) and `CommunityChat.tsx` (about to be deleted) reference them. If any other file references them, do not remove them from `useCommunities.ts` in Step 4 — keep them and only delete `CommunityChat.tsx`.

- [ ] **Step 2: Update the instructor page to use CommunityChatWindow**

Open `frontend/src/app/(instructor)/instructor/communities/page.tsx`. Replace the import and usage:

```typescript
import CommunityChat from "./_components/CommunityChat";
```

becomes:

```typescript
import CommunityChatWindow from "@/components/community/CommunityChatWindow";
import { useUserStore } from "@/zustand/userStore";
```

Add inside the component body, alongside the other hooks:

```typescript
  const { user, token } = useUserStore();
```

Replace:

```tsx
          {selectedCommunity ? (
            <CommunityChat community={selectedCommunity} />
          ) : (
```

with:

```tsx
          {selectedCommunity && token ? (
            <CommunityChatWindow
              communityId={selectedCommunity.id}
              token={token}
              communityTitle={selectedCommunity.title}
              isAdmin={
                selectedCommunity.members?.some(
                  (m) => m.user.id === user?.id && m.role === "ADMIN"
                ) ?? false
              }
            />
          ) : (
```

- [ ] **Step 3: Delete the old instructor chat component**

Run: `rm frontend/src/app/'(instructor)'/instructor/communities/_components/CommunityChat.tsx`

- [ ] **Step 4: Remove now-unused REST hooks (only if Step 1 confirmed no other references)**

If Step 1 showed no other consumers, open `frontend/src/hooks/useCommunities.ts` and delete the `useCommunityMessages` and `useSendMessage` functions, and remove the now-unused `getMessages`/`sendMessage` methods from `communitiesService.ts` only if `grep -rn "communitiesService.getMessages\|communitiesService.sendMessage" frontend/src` shows no other callers.

- [ ] **Step 5: Manual verification**

Run: `cd frontend && npm run build`

Expected: no TypeScript errors, no unresolved imports for the deleted `CommunityChat.tsx`.

In the dev server, log in as an instructor, open `instructor/communities`, select a community, and confirm the chat is now real-time (send a message from another session and see it appear without a 15s delay; react to a message; pin a message; see a typing indicator).

- [ ] **Step 6: Commit**

```bash
git add frontend/src/app/'(instructor)'/instructor/communities/page.tsx frontend/src/hooks/useCommunities.ts
git rm frontend/src/app/'(instructor)'/instructor/communities/_components/CommunityChat.tsx
git commit -m "refactor(frontend): replace instructor's REST-polling chat with the real-time CommunityChatWindow"
```

---

## Final End-to-End Verification

After all 11 tasks:

- [ ] Run `cd backend && npm run build` — expect success.
- [ ] Run `cd frontend && npm run build` — expect success.
- [ ] Start both dev servers, log in as two different users who are both members of the same test community (one as `ADMIN`).
- [ ] As the admin: rename the community, promote a member to moderator, kick a different member, confirm all three actions reflect immediately for the affected user's session.
- [ ] As either user: send a message with an image attachment, confirm it persists after refresh; reply to a message and open its thread; react with all four reaction types; pin/unpin a message; use header search to find an old message; open Shared Files and confirm the attachment is listed; leave the community and confirm redirect + removal.
- [ ] Open the instructor communities page and confirm the same real-time behavior (send/react/pin/typing) works there too.

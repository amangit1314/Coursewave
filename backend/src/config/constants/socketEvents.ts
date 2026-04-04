export const SOCKET_EVENTS = {
  // Client → Server
  JOIN: "joinCommunity",
  SEND: "sendMessage",
  EDIT: "editMessage",
  DELETE: "deleteMessage",
  REACT: "reactToMessage",
  PIN: "togglePinMessage",
  TYPING: "typing",
  // Server → Client
  INIT_MESSAGES: "messages:init",
  NEW_MESSAGE: "message:new",
  MESSAGE_EDITED: "message:edited",
  MESSAGE_DELETED: "message:deleted",
  REACTION: "message:reaction",
  PINNED: "message:pinned",
  TYPING_UPDATE: "typing:update",
  PRESENCE_UPDATE: "presence:update",
  ERROR: "error:message",
};

export interface OnlineUser {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "away" | "busy";
  lastSeen?: Date;
}
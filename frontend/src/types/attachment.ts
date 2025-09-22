export type Attachment = {
  id: string;
  url: string;
  name: string;
  type?: "IMAGE" | "DOC" | "PDF" | "VIDEO" | string;
};
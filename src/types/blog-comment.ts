export type BlogComment = {
  id: string;
  blogId: string;
  content: string;
  authorId: string;
  writtenOn: Date | null;
  editedOn: Date | null;
};

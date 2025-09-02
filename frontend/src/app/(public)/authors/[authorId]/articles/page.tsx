import React, { FC } from "react";

const AuthorArticles: FC<{ params: { authorId: string } }> = ({ params }) => {
  const { authorId } = params;
  return <div>AuthorArticles</div>;
};

export default AuthorArticles;
interface AuthorPageProps {
  params: { authorId: string };
}

export default function AuthorArticles({ params }: AuthorPageProps) {
  const { authorId } = params;

  return (
    <div>
      <h1>Articles for Author ID: {authorId}</h1>
    </div>
  );
}

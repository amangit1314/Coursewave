// File: /app/(articles)/articles/[articleId]/_components/article-client-wrapper.tsx

"use client";

import React from "react";
import { useParams } from "next/navigation";
import ArticleClient from "./_components/article-client";

export default function ArticleClientWrapper() {
  const params = useParams<{ articleId: string }>();
  const articleId = params.articleId;

  return <ArticleClient articleId={articleId} />;
}

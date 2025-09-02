// "use client";

// import React, { FC } from "react";

// import { BlogArticle } from "@/types/blog-api-response";
// import { ArticleCard } from "../../articles/_components/ArticleCard";

// const AuthorPage = async () => {
//   // TODO: use useArticles zustand store here in place of directly accessing it from db
//   const articles: BlogWithComments[] = await db.blog.findMany({
//     include: {
//       comments: true,
//     },
//   });

//   return (
//     <div className="max-w-7xl overflow-x-hidden px-10 py-8">
//       <p className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-white">
//         Articles
//       </p>
//       <p className="text-base text-zinc-600 dark:text-gray-300">
//         Browse articles on topic you like
//       </p>

//       <div>
//         {articles && articles.length ? (
//           <div className="my-8 grid grid-cols-2 gap-8 md:grid-cols-3">
//             {articles.map((article: BlogWithComments) => {
//               return (
//                 <div key={article.id}>
//                   <ArticleCard article={article} />
//                 </div>
//               );
//             })}
//           </div>
//         ) : (
//           <div className="my-8 grid grid-cols-3 gap-8">No Articles yet</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AuthorPage;
"use client";

import React from "react";
import { BlogArticle } from "@/types/blog-api-response";
import { ArticleCard } from "../articles/_components/ArticleCard";

const mockArticles: BlogArticle[] = [
  {
    id: "blog-1",
    title: "Getting Started with React",
    content:
      "This article explains how to start using React for building modern web applications...",
    slug: "getting-started-with-react",
    excerpt: "Learn the basics of React, components, and state management.",
    coverImage: "/images/react-guide.jpg",
    readTime: 8,
    isPublished: true,
    publishedAt: new Date().toISOString(),
    tags: ["React", "JavaScript", "Frontend"],
    authorId: "author-1",
    categoryId: "category-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: {
      id: "author-1",
      name: "John Doe",
      email: "john@example.com",
      profileImageUrl: "/images/john-doe.jpg",
      about: "Full-stack developer and tech writer.",
      shortSummary: "Writes about JavaScript and web development.",
    },
    category: {
      id: "category-1",
      name: "Web Development",
      description:
        "Articles about web technologies and development best practices.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    _count: {
      likes: 120,
      views: 3500,
      comments: 12,
    },
  },
  {
    id: "blog-2",
    title: "Understanding TypeScript",
    content:
      "TypeScript adds type safety to JavaScript, making it easier to manage large codebases...",
    slug: "understanding-typescript",
    excerpt:
      "Explore TypeScript features and why it’s popular for modern apps.",
    coverImage: "/images/typescript-guide.jpg",
    readTime: 10,
    isPublished: true,
    publishedAt: new Date().toISOString(),
    tags: ["TypeScript", "JavaScript", "Programming"],
    authorId: "author-2",
    categoryId: "category-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: {
      id: "author-2",
      name: "Jane Smith",
      email: "jane@example.com",
      profileImageUrl: "/images/jane-smith.jpg",
      about: "Frontend engineer and UI/UX enthusiast.",
      shortSummary: "Specializes in TypeScript and React.",
    },
    category: {
      id: "category-1",
      name: "Web Development",
      description:
        "Articles about web technologies and development best practices.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    _count: {
      likes: 95,
      views: 2900,
      comments: 8,
    },
  },
];

interface AuthorPageProps {
  // params: { authorId: string };
}

export default function AuthorPage() {
  // const { authorId } = params;
  // const articles = mockArticles.filter(
  //   (article) => article.authorId === authorId
  // );

  const articles = mockArticles;

  return (
    <div className="max-w-7xl overflow-x-hidden px-10 py-8">
      <p className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-white">
        Articles
      </p>
      <p className="text-base text-zinc-600 dark:text-gray-300">
        Browse articles on topics you like
      </p>

      <div>
        {articles.length ? (
          <div className="my-8 grid grid-cols-2 gap-8 md:grid-cols-3">
            {articles.map((article) => (
              <div key={article.id}>
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        ) : (
          <div className="my-8">No Articles yet for this author.</div>
        )}
      </div>
    </div>
  );
}

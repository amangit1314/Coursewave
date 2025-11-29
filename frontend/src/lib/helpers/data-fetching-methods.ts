export const fetchCourseInfo = async (courseId: string) => {
  const fetchCourseInfoUrl =
    process.env.ENVIRONMENT === "DEVELOPMENT"
      ? `/api/courses/${courseId}`
      : `api/courses/${courseId}`;

  const response = await fetch(`/api/courses/${courseId}`);

  if (!response.ok) {
    throw new Error(`Failed to get course info for courseId: ${courseId} ...`);
  }

  return await response.json();
};

export const fetchInstructorInfo = async (instructorId: string) => {
  const instructorUrl =
    process.env.ENVIRONMENT === "DEVELOPMENT"
      ? `/api/instructor/${instructorId}`
      : `api/instructor/${instructorId}`;

  const response = await fetch(`/api/instructor/${instructorId}`);

  if (!response.ok) {
    console.log(
    "Error in fetching instructor info in use-instructor-info.ts ...",
    );
  }

const data = await response.json();
return data;
};

export const fetchArticles = async () => {
  const articlesUrl =
    process.env.ENVIRONMENT! === "DEVELOPMENT"
      ? `/api/articles`
      : `api/articles`;

  const response = await fetch(articlesUrl);

  if (!response.ok) {
    throw new Error(`Failed to get articles info from ${articlesUrl} ...`);
  }

  return await response.json();
};

export const fetchArticleInfo = async (articleId: string) => {
  const articleUrl =
    process.env.ENVIRONMENT! === "DEVELOPMENT"
      ? `/api/articles/${articleId}`
      : `api/articles/${articleId}`;

  const response = await fetch(`/api/articles/${articleId}`);

  if (!response.ok) {
    throw new Error(`Failed to get article info from ${articleUrl} ...`);
  }

  return await response.json();
};

export const fetchIsCourseAlreadyPurchased = async (
  userId: string,
  courseId: string,
) => {
  const isCourseAlreadyPurchasedUrl =
    process.env.ENVIRONMENT! === "DEVELOPMENT"
      ? `/api/courses/${courseId}/alreadyPurchased?userId=${userId}`
      : `api/courses/${courseId}/alreadyPurchased?userId=${userId}`;

  const response = await fetch(isCourseAlreadyPurchasedUrl, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to get course info from /api/courses/${courseId}/alreadyPurchased`,
    );
  }

  return await response.json();
};

export const fetchCourses = async () => {
  const coursesUrl =
    process.env.ENVIRONMENT! === "DEVELOPMENT" ? `/api/courses` : `api/courses`;

  const response = await fetch(`/api/courses`);

  if (!response.ok) {
    throw new Error(`Failed to get course info from ${coursesUrl} ...`);
  }

  return await response.json();
};

const fetchCourseReviews = async (courseId: string) => {
  const response = await fetch(`api/courses/${courseId}/reviews`);

  if (!response.ok) {
    console.log("Failed to fetch course reviews from api ...");
  }

  const data = await response.json();
  console.log("Course reviews: ", JSON.stringify(data));
  return data;
};

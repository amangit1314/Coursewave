"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;

  useEffect(() => {
    router.replace(`/instructor/courses/${courseId}`);
  }, [router, courseId]);

  return null;
}

import { db } from "@/lib/db";
import CourseContent from "./_components/course-content";
import toast from "react-hot-toast";

const CourseIdPage = async ({
  params,
}: {
  params: { id: string; courseId: string };
}) => {
  const instructorId = params?.id!;
  const courseId = params?.courseId!;

  if (!instructorId || !courseId) {
    throw new Error(
      "Required parameters Instructor id , course id or both are missing ... "
    );
  }

  const course = await db.course.findUnique({
    where: {
      courseId: courseId,
      instructorID: instructorId,
    },
  });

  if (!course) {
    toast.error("No course found with these ids ...");
  }

  const courseAttachments = await db.courseAttachment.findMany({
    where: {
      courseId: course?.courseId,
    },
  });

  if (!courseAttachments) {
    toast.error("No course attachments found for this course ...");
  }

  const sections = await db.courseSection.findMany({
    where: {
      courseId: course?.courseId,
    },
  });

  if (!sections) {
    console.log("No course sections found for this course ...");
    toast.error("No course sections found for this course ...");
  }

  const chapters = await db.chapter.findMany({
    where: {
      courseId: course?.courseId,
    },
  });

  if (!chapters) {
    console.log("No course chapters found for this course ...");
    toast.error("No course chapters found for this course ...");
  }

  return (
    <div>
      {course ? (
        <CourseContent
          course={course}
          courseAttachments={courseAttachments}
          sections={sections}
          chapters={chapters}
        />
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default CourseIdPage;

import CreateCourseForm from "./_components/create-course-form";

function CreateCourse({ params }: { params: { id: string } }) {
  const instructorId = params?.id!;

  return (
    <div className="flex flex-col md:items-start justify-start max-w-7xl w-full mx-auto dark:bg-zinc-900 min-h-screen h-full py-20">
      <div className="flex flex-col px-4 md:px-8">
        <p className="text-2xl tracking-tight font-semibold text-gray-800 dark:text-gray-100">
          Create your Course
        </p>
        <p className="text-base mt-2 text-gray-600 dark:text-slate-400">
          Enter below fields to create your course! Don&apos;t worry you can
          change general things later on.
        </p>
      </div>

      <div className="my-2 px-4 md:px-8">
        <CreateCourseForm instructorId={instructorId} />
      </div>
    </div>
  );
}

export default CreateCourse;

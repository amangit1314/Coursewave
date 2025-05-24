import CreateCourseForm from "./_components/create-course-form";

const CreateCourse = async ({ params }: { params: { id: string } }) => {
  const instructorId = await params.id;

  return (
    <div className="mx-auto flex h-full min-h-screen w-full max-w-7xl flex-col justify-start py-20 dark:bg-zinc-900 md:items-start">
      <div className="flex flex-col px-4 md:px-8">
        <p className="text-2xl font-semibold tracking-tight text-gray-800 dark:text-gray-100">
          Create your Course
        </p>
        <p className="mt-2 text-base text-gray-600 dark:text-slate-400">
          Enter below fields to create your course! Don&apos;t worry you can
          change general things later on.
        </p>
      </div>

      <div className="my-2 px-4 md:px-8">
        <CreateCourseForm instructorId={instructorId} />
      </div>
    </div>
  );
};

export default CreateCourse;

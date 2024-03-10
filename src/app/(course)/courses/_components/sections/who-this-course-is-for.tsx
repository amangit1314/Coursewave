export default function WhoThisCourseIsFor({ thisCourseIsFor }: any) {
  return (
    <div className="md:mt-4 text-base max-w-3xl justify-start">
      <h3 className="mb-4 text-xl text-gray-700 dark:text-slate-200 tracking-tight font-semibold">
        Who this course is for:
      </h3>
      {thisCourseIsFor ? (
        <ul className="pl-4 flex flex-col text-gray-700 dark:text-gray-400 text-md justify-between pb-2 list-disc">
          {thisCourseIsFor.map((point: string, index: any) => (
            <li key={index} className="pb-1">
              {point}
            </li>
          ))}
        </ul>
      ) : (
        <ul className="pl-4 flex flex-col text-gray-700 dark:text-gray-400 text-md justify-between pb-2 list-disc">
          <li className="pb-1">
            Office workers, students, small/home business workers, and
            administrators would want to improve their productivity
          </li>
          <li className="pb-1">
            Computer users who have heard the {"learn to code"} message, but
            want practical reasons to learn programming.
          </li>
          <li>
            While this course doesnt cover specific devops tools, this course
            would be useful for QA, devops, and admins who want to learn
            scripting in Python.
          </li>
        </ul>
      )}
    </div>
  );
}

/**
 * <li className="pb-1">
          Office workers, students, small/home business workers, and
          administrators would want to improve their productivity
        </li>
        <li className="pb-1">
          Computer users who have heard the {"learn to code"} message, but want
          practical reasons to learn programming.
        </li>
        <li>
          While this course doesnt cover specific devops tools, this course
          would be useful for QA, devops, and admins who want to learn scripting
          in Python.
        </li>
 */

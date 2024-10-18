export const WhoThisCourseIsFor = ({ thisCourseIsFor }: any) => {
  return (
    <div className="max-w-3xl justify-start space-y-4 text-base md:mt-4">
      <h3 className="text-xl font-semibold tracking-tight text-gray-800 dark:text-slate-200">
        Who this course is for:
      </h3>
      {thisCourseIsFor ? (
        <ul className="text-md flex list-disc flex-col justify-between pl-4 text-gray-700 dark:text-gray-400">
          {thisCourseIsFor.map((point: string, index: any) => (
            <li key={index} className="pb-1">
              {point}
            </li>
          ))}
        </ul>
      ) : (
        <ul className="text-md flex list-disc flex-col justify-between pb-2 pl-4 text-gray-700 dark:text-gray-400">
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
};


export default WhoThisCourseIsFor;
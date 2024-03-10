export default function Prerequisits({ prerequisits }: any) {
  return (
    <div className="md:mt-4 max-w-3xl justify-start">
      <h3 className="mb-4 text-xl text-gray-700 dark:text-slate-200 tracking-tight font-semibold">
        Prerequisits:
      </h3>
      {prerequisits ? (
        <ul className="pl-4 flex flex-col text-gray-700 dark:text-gray-400 text-md text-base justify-between pb-2 list-disc">
          {prerequisits.map((point: string, index: any) => (
            <li className="pb-1" key={index}>
              {point}
            </li>
          ))}
        </ul>
      ) : (
        <ul className="pl-4 flex flex-col text-gray-700 dark:text-gray-400 text-md text-base justify-between pb-2 list-disc">
          <li className="pb-1">No programming experience is required</li>
          <li className="pb-1">Laptop is must</li>
          <li>A stable internet connection</li>
        </ul>
      )}
    </div>
  );
}

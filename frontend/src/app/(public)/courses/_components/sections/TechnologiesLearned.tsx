import Image from "next/image";

export default function TechnologiesLearned() {
  const technologies: any[] = [
    {
      name: "React",
      image: "/assets/png/react-logo.png",
    },
    {
      name: "Redux",
      image: "/assets/png/redux-logo.png",
    },
    // {
    //     name: 'Tailwind CSS',
    //     image: '/assets/png/tailwind-css-logo.png'
    // },
    {
      name: "Prisma",
      image: "/assets/png/prisma-logo.png",
    },
    {
      name: "Supabase",
      image: "/assets/png/supabase-logo.png",
    },
  ]; // You might want to update this array with your technologies

  return (
    <div>
      {/* <h3 className="my-8 text-xl font-semibold">Technologies Learnt in this course</h3> */}
      <div>
        <div className="flex items-center space-x-2 text-base">
          <h4 className="font-semibold tracking-tight text-slate-900 dark:text-white">
            Technologies Learnt in this course
          </h4>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
            204
          </span>
        </div>
        <div className="mt-2 flex -space-x-2 overflow-hidden">
          {technologies.map((tech, index) => (
            <div key={index} className="inline-block h-15 w-15">
              <Image
                src={tech.image}
                alt={`Image of ${tech.name}`}
                height={46}
                width={46}
                objectFit="cover"
                className="rounded-full p-3 flex items-center justify-center h-12 w-12 ring-1 ring-white"
              />
            </div>
          ))}
        </div>
        <div className="mt-3 text-sm font-medium">
          <button type="button" className="text-blue-500">
            + 198 others
          </button>
        </div>
      </div>
    </div>
  );
}

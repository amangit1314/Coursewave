type Enrollment = {
  id: string;
  courseId: string;
  courseName: string;
  enrollmentDate: string;
  progress: number;
  status: "started" | "inProgress" | "completed";
};

export const enrollments: Enrollment[] = [
  {
    id: "728ed52f",
    courseId: "c8asd8fj_23r4",
    courseName: "Next.js 14 Bootcamp",
    enrollmentDate: "25 March 2024",
    progress: 0,
    status: "started",
  },
  {
    id: "489e1d42",
    courseId: "c8asd8fj_23r4",
    courseName: "Next.js 14 Bootcamp",
    enrollmentDate: "25 March 2024",
    progress: 10,
    status: "inProgress",
  },
  {
    id: "728ed52f",
    courseId: "c8asd8fj_23r4",
    courseName: "Next.js 14 Bootcamp",
    enrollmentDate: "25 March 2024",
    progress: 0,
    status: "started",
  },
  {
    id: "489e1d42",
    courseId: "c8asd8fj_23r4",
    courseName: "Next.js 14 Bootcamp",
    enrollmentDate: "25 March 2024",
    progress: 10,
    status: "inProgress",
  },
];

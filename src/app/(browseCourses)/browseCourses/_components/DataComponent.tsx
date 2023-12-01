import CourseWidget from "./course-widget";
import { course } from '@prisma/client';

export const getCourses = async () => {
    try {
        const res = await fetch('https://localhost:3000/api/courses');

        if (!res.ok) {
            throw new Error('Could not retrieve courses');
        }

        console.log(res.json.toString());

        return res.json();
    } catch (error: any) {
        console.error('Error fetching courses:', error.message);
        throw error;
    }
}

export default async function DataComponent() {
    const courses = await getCourses();
    console.log(courses.data);
    /**
 *  try {
 *     setLoading(true);
 *             successNotification('Courses fetched successfully 🤘');
 *  } catch (error: any) {
 *      console.log("Course fetch failed", error.message);
 *      errorNotification(error.message);
 *      toast.error(error.message);
 *   } finally {
 *      setLoading(false);
 *  }
 */

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 my-6 w-9/12 justify-start mx-auto">
            {
                Array.isArray(courses.data) ? (
                courses.data.map((course: course, index: number) => (
                    <CourseWidget
                        key={index}
                        index={index}
                        title={course.courseTitle}
                        courseImage={course.courseImage}
                        courseNumber={course.courseId}
                        duration="60"
                        subject="Development"
                        instructor={course.instructorID?.split('-')[0] || 'Aman Soni'}
                        instructorId={course.instructorID?.split('-')[0] || 'Aman Soni'}
                        price={course.coursePrice}
                        categories={ course.courseCategories}
                    />
                ))
            )
            : (
                <>
                    <pre>{JSON.stringify(courses, null, 2)}</pre>
                </>
            )
            }
        </div>
    );
}

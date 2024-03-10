import { useState, useEffect } from "react";
import { Instructor } from "@prisma/client";

const useInstructorInfo = (instructorId: string) => {
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInstructorInfo() {
      try {
        setIsLoading(true);

        // Fetch user info from auth/me api
        // const userResponse = await fetch("https://localhost:3000/api/auth/me");
        // if (!userResponse.ok) {
        //   throw new Error("Failed to get user info from auth/me api");
        // }
        // const userData = await userResponse.json();
        // const user = userData.data.user;

        // // Check if the user is an instructor
        // if (!user?.isInstructor) {
        //   throw new Error("You are not an instructor");
        // }

        // Fetch instructor info using the provided instructorId
        const instructorUrl = `https://localhost:3000/api/instructor/${instructorId}`;
        const instructorResponse = await fetch(instructorUrl);
        if (!instructorResponse.ok) {
          throw new Error(`Failed to get instructor info from ${instructorUrl}`);
        }
        const instructorData = await instructorResponse.json();

        setInstructor(instructorData.data);
      } catch (error: any) {
        console.error("Error:", error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInstructorInfo();
  }, [instructorId]);

  return { instructor, isLoading, error };
};

export default useInstructorInfo;

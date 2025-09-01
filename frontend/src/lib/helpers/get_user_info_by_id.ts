import { User } from "@/types/user";


const getUserInfoById = async (
  userId: string
): Promise<{ user: User | null; error: Error | null }> => {
  try {
    const url = `api/profile/${userId}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to get user info for id: ${userId} in getUserInfoById.ts`);
    }

    const data = await response.json();
    return { user: data.data, error: null };
  } catch (error: any) {
    return { user: null, error };
  }
};

export default getUserInfoById;

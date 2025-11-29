import { useEffect, useState } from 'react';
import { instructorService } from '@/lib/api/services/instructorService';
import { InstructorAnalytics } from '@/types/instructor.service.types';

/**
 * Hook to fetch instructor dashboard data (analytics, earnings, students count)
 * and keep it up‑to‑date with polling for near real‑time updates.
 */
export const useInstructorDashboard = (instructorId: string) => {
    const [analytics, setAnalytics] = useState<InstructorAnalytics | null>(null);
    const [earnings, setEarnings] = useState<number>(0);
    const [studentsCount, setStudentsCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAll = async () => {
        try {
            // The analytics endpoint already contains earnings and students count
            const analyticsRes = await instructorService.getMyAnalytics();

            if (analyticsRes.data) {
                setAnalytics(analyticsRes.data);
                setEarnings(analyticsRes.data.totalEarnings || 0);
                setStudentsCount(analyticsRes.data.totalStudents || 0);
            }
            setError(null);
        } catch (e: any) {
            console.error('Instructor dashboard fetch error', e);
            setError(e.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!instructorId) return;
        fetchAll();
        const interval = setInterval(fetchAll, 30_000); // poll every 30s
        return () => clearInterval(interval);
    }, [instructorId]);

    return { analytics, earnings, studentsCount, loading, error };
};

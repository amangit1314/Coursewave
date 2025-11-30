"use client";

import React from 'react';
import { useInstructorDashboard } from '@/hooks/useInstructorDashboard';
import { useUserStore } from '@/zustand/userStore';

/**
 * Instructor Earnings Page
 * Shows total earnings with real‑time polling.
 */
const InstructorEarningsPage = () => {
    const { user } = useUserStore();
    const instructorId = user?.id ?? '';

    const { earnings, loading, error } = useInstructorDashboard(instructorId);

    if (loading) return <div className="p-4">Loading earnings...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Earnings</h1>
            <div className="text-xl">
                Total: {earnings ?? '0'} USD
                {/* {earnings?.currency ?? ''} */}
            </div>
        </div>
    );
};

export default InstructorEarningsPage;

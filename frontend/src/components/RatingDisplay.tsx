"use client";

import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { useGetAverageRating } from "@/hooks/useRating";

interface RatingDisplayProps {
    articleId: string;
    showDistribution?: boolean;
    className?: string;
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({
    articleId,
    showDistribution = false,
    className,
}) => {
    const { data: ratingData, isLoading } = useGetAverageRating(articleId);

    if (isLoading || !ratingData) {
        return (
            <div className={cn("flex items-center gap-2", className)}>
                <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-5 h-5 fill-none text-gray-300 animate-pulse" />
                    ))}
                </div>
                <span className="text-sm text-gray-500">Loading...</span>
            </div>
        );
    }

    const { average, count, distribution } = ratingData;

    return (
        <div className={cn("space-y-3", className)}>
            {/* Average Rating */}
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={cn(
                                "w-5 h-5",
                                star <= Math.round(average)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-none text-gray-300 dark:text-gray-600"
                            )}
                        />
                    ))}
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {average.toFixed(1)}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    ({count} {count === 1 ? "rating" : "ratings"})
                </span>
            </div>

            {/* Rating Distribution */}
            {showDistribution && count > 0 && (
                <div className="space-y-1">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const starCount = distribution[star as keyof typeof distribution];
                        const percentage = count > 0 ? (starCount / count) * 100 : 0;

                        return (
                            <div key={star} className="flex items-center gap-2 text-sm">
                                <span className="w-8 text-gray-600 dark:text-gray-400 flex items-center gap-0.5">
                                    {star}
                                    <Star className="w-3 h-3 fill-current" />
                                </span>
                                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-400 transition-all duration-300"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="w-12 text-right text-gray-600 dark:text-gray-400">
                                    {starCount}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}

            {count === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    No ratings yet. Be the first to rate!
                </p>
            )}
        </div>
    );
};

export default RatingDisplay;

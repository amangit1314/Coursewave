"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { useRateArticle, useGetUserRating } from "@/hooks/useRating";
import { useUserStore } from "@/zustand/userStore";

interface RatingStarsProps {
    articleId: string;
    size?: "sm" | "md" | "lg";
    readonly?: boolean;
    showLabel?: boolean;
    onRatingChange?: (rating: number) => void;
}

const RatingStars: React.FC<RatingStarsProps> = ({
    articleId,
    size = "md",
    readonly = false,
    showLabel = false,
    onRatingChange,
}) => {
    const { user } = useUserStore();
    const { data: userRating, isLoading } = useGetUserRating(articleId);
    const { mutate: rateArticle, isPending } = useRateArticle();

    const [hoverRating, setHoverRating] = useState(0);
    const currentRating = userRating || 0;

    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-7 h-7",
    };

    const handleClick = (rating: number) => {
        if (readonly || !user) return;

        rateArticle(
            { blogId: articleId, rating },
            {
                onSuccess: () => {
                    onRatingChange?.(rating);
                },
            }
        );
    };

    const handleMouseEnter = (rating: number) => {
        if (!readonly && user) {
            setHoverRating(rating);
        }
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    const displayRating = hoverRating || currentRating;

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5" onMouseLeave={handleMouseLeave}>
                {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                        key={rating}
                        type="button"
                        onClick={() => handleClick(rating)}
                        onMouseEnter={() => handleMouseEnter(rating)}
                        disabled={readonly || isPending || isLoading || !user}
                        className={cn(
                            "transition-all duration-150 ease-in-out",
                            !readonly && user && "cursor-pointer hover:scale-110",
                            readonly && "cursor-default",
                            !user && "cursor-not-allowed opacity-50"
                        )}
                        aria-label={`Rate ${rating} stars`}
                    >
                        <Star
                            className={cn(
                                sizeClasses[size],
                                "transition-colors duration-150",
                                rating <= displayRating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-none text-gray-300 dark:text-gray-600"
                            )}
                        />
                    </button>
                ))}
            </div>

            {showLabel && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    {currentRating > 0 ? `${currentRating}/5` : "Not rated"}
                </span>
            )}
        </div>
    );
};

export default RatingStars;

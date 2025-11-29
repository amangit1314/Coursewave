'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
// import { useToast } from '@/hooks/use-toast';

interface WriteReviewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    courseId: string;
    existingReview?: {
        id: string;
        rating: number;
        comment: string;
    } | null;
    onSuccess?: () => void;
}

export function WriteReviewDialog({
    open,
    onOpenChange,
    courseId,
    existingReview,
    onSuccess,
}: WriteReviewDialogProps) {
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState(existingReview?.comment || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            toast({
                title: 'Rating required',
                description: 'Please select a rating before submitting',
                variant: 'destructive',
            });
            return;
        }

        if (comment.trim().length < 10) {
            toast({
                title: 'Comment too short',
                description: 'Please write at least 10 characters',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const url = existingReview
                ? `/api/courses/${courseId}/reviews/${existingReview.id}`
                : `/api/courses/${courseId}/reviews`;

            const method = existingReview ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ rating, comment }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to submit review');
            }

            toast({
                title: existingReview ? 'Review updated' : 'Review submitted',
                description: data.message || 'Thank you for your feedback!',
            });

            onSuccess?.();
            onOpenChange(false);

            // Reset form
            if (!existingReview) {
                setRating(0);
                setComment('');
            }
        } catch (error: any) {
            console.error('Error submitting review:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to submit review. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>
                        {existingReview ? 'Edit Your Review' : 'Write a Review'}
                    </DialogTitle>
                    <DialogDescription>
                        Share your experience with this course to help other learners.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        {/* Rating Stars */}
                        <div className="space-y-2">
                            <Label>Rating *</Label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        className="transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${star <= (hoveredRating || rating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            {rating > 0 && (
                                <p className="text-sm text-muted-foreground">
                                    {rating} out of 5 stars
                                </p>
                            )}
                        </div>

                        {/* Comment */}
                        <div className="space-y-2">
                            <Label htmlFor="comment">Your Review *</Label>
                            <Textarea
                                id="comment"
                                placeholder="What did you think about this course? Share your experience..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={6}
                                className="resize-none"
                                minLength={10}
                                maxLength={1000}
                            />
                            <p className="text-xs text-muted-foreground text-right">
                                {comment.length}/1000 characters (minimum 10)
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting
                                ? 'Submitting...'
                                : existingReview
                                    ? 'Update Review'
                                    : 'Submit Review'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

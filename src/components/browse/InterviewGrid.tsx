"use client";
import React from "react";
import { Interview } from "@/types/types";
import InterViewBrowseCard from "@/components/browse/InterViewBrowseCard";

interface InterviewGridProps {
    interviews: Interview[];
    onBookmarkToggle: (id: string) => void;
}

const InterviewGrid = ({
    interviews,
    onBookmarkToggle
}: InterviewGridProps) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {interviews.map((interview) => (
                <InterViewBrowseCard
                    key={interview._id}
                    interview={interview}
                    isBookmarked={interview.isBookmarked || false}
                    onBookmarkToggle={onBookmarkToggle}
                />
            ))}
        </div>
    );
};

export default InterviewGrid;
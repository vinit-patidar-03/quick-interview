"use client";
import React, { useState } from "react";
import { Interview } from "@/types/types";
import InterviewHeader from "./InterviewHeader";
import InterviewGrid from "./InterviewGrid";
import EmptyState from "./EmptyState";
import SearchAndTabs from "./SearchAndTabs";
import { apiRequest } from "@/api/client-request";

interface InterviewBrowseClientProps {
    initialInterviews: Interview[];
}

const InterviewBrowseClient = ({ initialInterviews }: InterviewBrowseClientProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    const handleBookmarkToggle = async (id: string) => {
        try {
            if (!id) return;
            const interviewIndex = initialInterviews.findIndex((interview) => interview._id === id);
            if (interviewIndex === -1) return;
            const isBookmarked = initialInterviews[interviewIndex].isBookmarked || false;
            if (isBookmarked) {
                initialInterviews[interviewIndex].isBookmarked = false;
                await apiRequest(`/api/interviews/${id}/bookmark`, "DELETE");

            } else {
                initialInterviews[interviewIndex].isBookmarked = true;
                await apiRequest(`/api/interviews/${id}/bookmark`, "POST");
            }
        } catch (error) {
            console.error("Error toggling bookmark:", error);
        }
    };

    const filteredInterviews = initialInterviews?.filter((interview) => {
        const matchesSearch =
            interview.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            interview.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            interview.technologies.some((tech) =>
                tech.toLowerCase().includes(searchTerm.toLowerCase())
            );

        const matchesTab =
            activeTab === "all" ||
            (activeTab === "expert" && interview.difficulty === "Expert") ||
            (activeTab === "bookmarked" && interview.isBookmarked) ||
            (activeTab === "advanced" && interview.difficulty === "Advanced") ||
            (activeTab === "intermidate" && interview.difficulty === "Intermediate") ||
            (activeTab === "beginner" && interview.difficulty === "Beginner");

        return matchesSearch && matchesTab;
    }) || [];

    const sortedInterviews = [...filteredInterviews].sort((a, b) => {
        switch (sortBy) {
            case "duration":
                return (a.duration || 0) - (b.duration || 0);
            case "difficulty":
                const difficultyOrder = { "Beginner": 1, "Intermediate": 2, "Advanced": 3, "Expert": 4 };
                return (difficultyOrder[a.difficulty] || 0) - (difficultyOrder[b.difficulty] || 0);
            default:
                return 0;
        }
    });

    return (
        <div className="flex md:h-[calc(100vh-65px)] bg-background h-auto flex-col md:flex-row">
            <div className="border-r border-border">
                <SearchAndTabs
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />
            </div>

            <div className="overflow-y-auto scrollbar-thin w-full">
                <div className="p-5">
                    <InterviewHeader interviewCount={sortedInterviews.length} />

                    <InterviewGrid
                        interviews={sortedInterviews}
                        onBookmarkToggle={handleBookmarkToggle}
                    />

                    {sortedInterviews.length === 0 && (
                        <div className="mt-8">
                            <EmptyState
                                title="No interviews found"
                                description="Try adjusting your filters or search terms to discover more opportunities"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InterviewBrowseClient;
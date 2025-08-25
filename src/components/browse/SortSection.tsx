"use client";
import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const sortOptions = [
    { value: "popular", label: "Most Popular" },
    { value: "rating", label: "Highest Rated" },
    { value: "recent", label: "Recently Added" },
    { value: "duration", label: "Duration" },
];

interface SortSectionProps {
    sortBy: string;
    onSortChange: (value: string) => void;
}

const SortSection = ({ sortBy, onSortChange }: SortSectionProps) => {
    return (
        <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Sort By</h4>
            <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default SortSection;
"use client";
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchSectionProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

const SearchSection = ({ searchTerm, onSearchChange }: SearchSectionProps) => {
    return (
        <div className="space-y-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                    type="text"
                    placeholder="Search interviews..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10"
                />
            </div>
        </div>
    );
};

export default SearchSection;
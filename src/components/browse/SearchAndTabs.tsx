"use client";
import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SearchSection from "./SearchSection";
import SortSection from "./SortSection";
import CategoryTabs from "./CategoryTabs";

interface SearchAndTabsProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    sortBy: string;
    onSortChange: (value: string) => void;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const SearchAndTabs = ({
    searchTerm,
    onSearchChange,
    sortBy,
    onSortChange,
    activeTab,
    onTabChange,
}: SearchAndTabsProps) => {
    return (
        <Card className="h-full w-68 rounded-none border-l-0 border-t-0 border-b-0">
            <CardHeader>
                <CardTitle className="text-lg">Search & Filter</CardTitle>
            </CardHeader>
            <CardContent className="md:space-y-6 space-y-3">
                <SearchSection
                    searchTerm={searchTerm}
                    onSearchChange={onSearchChange}
                />

                <Separator className="md:block hidden" />

                <SortSection
                    sortBy={sortBy}
                    onSortChange={onSortChange}
                />

                <Separator className="md:block hidden" />

                <CategoryTabs
                    activeTab={activeTab}
                    onTabChange={onTabChange}
                />
            </CardContent>
        </Card>
    );
};

export default SearchAndTabs;
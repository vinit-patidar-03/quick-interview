"use client";
import React from "react";
import { Blend, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const tabsConfig = [
    { id: "all", name: "All Interviews", emoji: <Blend className="w-4 h-4" /> },
    { id: "bookmarked", name: "Bookmarked", emoji: <BookmarkCheck className="w-4 h-4" /> },
    { id: "expert", name: "Expert", emoji: <div className="w-3 h-3 rounded-full bg-red-500"></div> },
    { id: "advanced", name: "Advanced", emoji: <div className="w-3 h-3 rounded-full bg-red-300"></div> },
    { id: "intermidate", name: "Intermidate", emoji: <div className="w-3 h-3 rounded-full bg-orange-500" ></div> },
    { id: "beginner", name: "Beginner", emoji: <div className="w-3 h-3 rounded-full bg-green-500" ></div> },
];

interface CategoryTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const CategoryTabs = ({ activeTab, onTabChange }: CategoryTabsProps) => {
    return (
        <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Categories</h4>
            <div className="flex md:flex-col flex-row flex-wrap gap-3">
                {tabsConfig.map((tab) => (
                    <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? "prepsmash_button" : "ghost"}
                        onClick={() => onTabChange(tab.id)}
                        className="w-full justify-start text-sm flex-1/3"
                    >
                        <span className="mr-2">{tab.emoji}</span>
                        <span>{tab.name}</span>
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default CategoryTabs;
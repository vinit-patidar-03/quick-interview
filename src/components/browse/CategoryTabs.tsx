"use client";
import React from "react";
import { Blend, Hourglass, Star, TrendingUp, Trophy, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const tabsConfig = [
    { id: "all", name: "All Interviews", emoji: <Blend className="w-4 h-4" /> },
    { id: "trending", name: "Trending", emoji: <TrendingUp className="w-4 h-4" /> },
    { id: "recent", name: "Recent", emoji: <Hourglass className="w-4 h-4" /> },
    { id: "top-rated", name: "Top Rated", emoji: <Star className="w-4 h-4" /> },
    { id: "most-attempted", name: "Popular", emoji: <UserCheck className="w-4 h-4" /> },
    { id: "challenging", name: "Expert", emoji: <Trophy className="w-4 h-4" /> },
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
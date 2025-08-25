import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: string;
}

const EmptyState = ({ title, description, icon = "🔍" }: EmptyStateProps) => {
    return (
        <Card className="mx-auto max-w-md">
            <CardContent className="text-center py-16 px-6">
                <div className="text-6xl mb-4">{icon}</div>
                <CardTitle className="text-xl mb-2">{title}</CardTitle>
                <CardDescription className="text-base">{description}</CardDescription>
            </CardContent>
        </Card>
    );
};

export default EmptyState;
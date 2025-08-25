import React from "react";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface InterviewHeaderProps {
    interviewCount: number;
}

const InterviewHeader = ({ interviewCount }: InterviewHeaderProps) => {
    return (
        <Card className="mb-5">
            <CardHeader>
                <CardTitle className="text-2xl">Interview Practice</CardTitle>
                <CardDescription className="flex items-center gap-2">
                    Browse and practice with{" "}
                    <Badge variant="secondary" className="text-sm">
                        {interviewCount}
                    </Badge>
                    interview{interviewCount !== 1 ? "s" : ""}
                </CardDescription>
            </CardHeader>
        </Card>
    );
};

export default InterviewHeader;
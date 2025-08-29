import React from "react";
import { Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Interview, InterviewCardPracticeProps } from "@/types/types";
import Link from "next/link";

const InterviewCard = ({ interview, isCompleted, isStarted }: InterviewCardPracticeProps) => {
  const getDifficultyVariant = (difficulty: Interview["difficulty"]) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return "secondary";
      case "intermediate":
        return "outline";
      case "advanced":
        return "default";
      case "expert":
        return "destructive";
      default:
        return "secondary";
    }
  };
  return (
    <>
      <Card
        key={interview._id}
        className="group hover:shadow-lg transition-all duration-300 overflow-hidden pt-0"
      >
        <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4">
          <CardTitle className="text-lg leading-tight">
            {interview.role}
          </CardTitle>
          <p className="text-purple-100 font-medium text-sm">
            {interview.company}
          </p>
          <CardDescription className="text-purple-200 text-sm line-clamp-4">
            {interview.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4">
          <div className="flex flex-wrap gap-2">
            {interview?.technologies?.map((topic) => (
              <Badge key={topic} variant="outline" className="text-xs">
                {topic}
              </Badge>
            ))}
          </div>

          <div className="mt-3">
            <Badge variant={getDifficultyVariant(interview.difficulty)}>
              {interview.difficulty}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col mt-auto">
          <div className="flex justify-between items-center mb-3 w-full">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{interview.duration} minutes</span>
            </div>
            <Badge
              variant="outline"
              className={isCompleted && isStarted ? "text-green-500" : isStarted ? "text-yellow-500" : "text-gray-500"}
            >
              {isCompleted && isStarted ? "Completed" : isStarted ? "Attempted" : "Not started"}
            </Badge>

          </div>

          {!isCompleted && <Link href={`/playground/${interview?._id}`} className="w-full px-3 py-2 text-center bg-purple-600 text-white rounded-md hover:bg-purple-700 transition ">
            Start Interview
          </Link>
          }
          {isCompleted && (
            <span className="block px-4 py-2 mt-4 text-green-800 bg-green-100 border border-green-300 rounded-md text-sm">
              Feedback is available under profile section.
            </span>
          )}

        </CardFooter>
      </Card>
    </>
  );
};

export default InterviewCard;

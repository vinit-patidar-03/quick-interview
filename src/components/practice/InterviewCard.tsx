import React from "react";
import { Button } from "../ui/button";
import { Clock, Star, Users } from "lucide-react";
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

const InterviewCard = ({ interview }: InterviewCardPracticeProps) => {
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
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-lg leading-tight">
              {interview.role}
            </CardTitle>
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              <Star className="w-3 h-3 mr-1 fill-current" />
              {interview.rating}
            </Badge>
          </div>
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
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span className="text-sm">Taken {interview.attempts} times</span>
            </div>
          </div>

          <Button className="w-full" size="lg" variant="prepsmash_button">
            Start Interview
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default InterviewCard;

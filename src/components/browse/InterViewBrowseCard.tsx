import { Interview, InterviewCardBrowseProps } from "@/types/types";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookmarkCheck, BookmarkPlus, Building2, Clock } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const InterViewBrowseCard = ({
  interview,
  isBookmarked,
  onBookmarkToggle
}: InterviewCardBrowseProps) => {
  const [isBookmarkedState, setIsBookmarkedState] = useState(isBookmarked);

  const getDifficultyColor = (difficulty: Interview["difficulty"]) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "Expert":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const handleBookmarkClick = (id: string) => {
    setIsBookmarkedState(!isBookmarkedState);
    onBookmarkToggle(id);
  }

  return (
    <Card className="hover:shadow-lg transition-shadow relative flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              {interview.companyLogo ? (
                <Image
                  src={interview.companyLogo}
                  alt={`${interview.company} Logo`}
                  width={48}
                  height={48}
                  className="object-cover rounded-lg"
                />
              ) : (
                <Building2 className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg">{interview?.company}</CardTitle>
              <CardDescription>{interview.role}</CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleBookmarkClick(interview._id)}
            className="text-muted-foreground"
          >
            {
              isBookmarkedState ? (
                <BookmarkCheck className="w-10 h-10 text-green-500" />
              ) : (
                <BookmarkPlus className="w-10 h-10" />
              )
            }
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">{interview?.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {interview.technologies.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 mt-auto">
        <div className="flex items-center justify-between text-sm text-muted-foreground w-full">
          <div className="flex items-center gap-1" title="Duration">
            <Clock className="w-4 h-4" />
            {interview?.duration} mins
          </div>
          <Badge className={getDifficultyColor(interview?.difficulty)}>
            {interview?.difficulty}
          </Badge>
        </div>

        <Button
          variant={isBookmarkedState ? "secondary" : "outline"}
          onClick={() => handleBookmarkClick(interview?._id)}
          className={`w-full px-4 py-2 border-purple-500 transition-colors shadow-sm
        ${isBookmarkedState
              ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
              : "bg-purple-50 text-purple-700 hover:bg-purple-100"
            }`}
          aria-pressed={isBookmarkedState}
        >
          <span className="flex items-center justify-center gap-2">
            {isBookmarkedState ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-green-600" aria-hidden="true" />
                <span>Remove Bookmark</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-4 h-4 text-purple-600" aria-hidden="true" />
                <span>Bookmark Interview</span>
              </>
            )}
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InterViewBrowseCard;

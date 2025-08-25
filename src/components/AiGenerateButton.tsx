import React from "react";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";

interface AiGenerateButtonProps {
  onClick: () => void;
  isGenerating: boolean;
}

const AiGenerateButton = ({ onClick, isGenerating }: AiGenerateButtonProps) => {
  return (
    <>
      <Button
        type="button"
        onClick={onClick}
        disabled={isGenerating}
        variant="outline"
        className="h-9 text-sm border-blue-200 text-blue-600 hover:bg-blue-50"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        {isGenerating ? "Generating..." : "AI Generate"}
      </Button>
    </>
  );
};

export default AiGenerateButton;

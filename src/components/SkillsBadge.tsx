import React from "react";
import { X } from "lucide-react";

interface SkillsBadgeProps {
  tech: string;
  onClick: (tech: string) => void;
}

const SkillsBadge = ({ tech, onClick }: SkillsBadgeProps) => {
  return (
    <>
      <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md text-xs">
        {tech}
        <X
          className="w-3 h-3 cursor-pointer hover:text-red-500 z-50"
          onClick={() => onClick(tech)}
        />
      </div>
    </>
  );
};

export default SkillsBadge;

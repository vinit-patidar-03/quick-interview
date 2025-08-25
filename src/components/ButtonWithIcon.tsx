import React from "react";
import { Button } from "./ui/button";

interface ButtonWithIconProps {
  onClick: () => void;
  icon: React.ReactNode;
}

const ButtonWithIcon = ({ onClick, icon }: ButtonWithIconProps) => {
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onClick}
        className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100"
      >
        {icon}
      </Button>
    </>
  );
};

export default ButtonWithIcon;

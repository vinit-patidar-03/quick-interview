import React from "react";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";

interface ButtonWithLoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  size?: "default" | "sm" | "lg" | "icon";
}

const ButtonWithLoading = ({ isLoading, children, onClick, size = "default" }: ButtonWithLoadingProps) => {
  return (
    <div>
      <Button variant="prepsmash_button" type="submit" disabled={isLoading} onClick={onClick} size={size}>
        {isLoading && <Loader className="w-4 h-4 animate-spin" />}
        {children}
      </Button>
    </div>
  );
};

export default ButtonWithLoading;

import React from "react";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";

interface ButtonWithLoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const ButtonWithLoading = ({ isLoading, children, onClick }: ButtonWithLoadingProps) => {
  return (
    <div>
      <Button variant="prepsmash_button" type="submit" disabled={isLoading} onClick={onClick}>
        {isLoading && <Loader className="w-4 h-4 animate-spin" />}
        {children}
      </Button>
    </div>
  );
};

export default ButtonWithLoading;

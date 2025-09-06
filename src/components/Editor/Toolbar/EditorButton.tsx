import { cn } from "@/common/utils";
import { Button } from "@/components/ui/button";
import React from "react";

type EditorButtonProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isActive?: boolean;
  children: React.ReactNode;
  className?: string;
  title?: string;
};

export default function EditorButton({
  onClick,
  isActive = false,
  children,
  className = "",
  title,
}: EditorButtonProps) {
  return (
    <Button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className={cn(
        "p-1.5 rounded text-sm hover:bg-muted transition-colors",
        isActive && "bg-accent",
        className
      )}
    >
      {children}
    </Button>
  );
}

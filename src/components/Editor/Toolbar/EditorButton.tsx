import React from "react";
import { Button } from "@/components/ui/button";

interface EditorButtonProps {
  onMouseDown: (e: React.MouseEvent) => void;
  active?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function EditorButton({ 
  onMouseDown, 
  active, 
  children, 
  className = "" 
}: EditorButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={`${active ? "bg-accent" : ""} ${className}`}
      onMouseDown={onMouseDown}
    >
      {children}
    </Button>
  );
}
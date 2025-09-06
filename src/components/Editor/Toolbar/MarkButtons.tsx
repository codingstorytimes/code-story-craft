import React from "react";
import { useSlate } from "slate-react";
import { Button } from "@/components/ui/button";
import { isMarkActive, toggleMark } from "../editorUtils";

interface MarkButtonProps {
  format: keyof import("@/common/types/slate").CustomText;
  icon: React.ReactNode;
}

export default function MarkButton({ format, icon }: MarkButtonProps) {
  const editor = useSlate();
  
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={isMarkActive(editor, format) ? "bg-accent" : ""}
      onMouseDown={(e) => {
        e.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon}
    </Button>
  );
}
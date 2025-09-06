import { Editor } from "slate";
import { Button } from "@/components/ui/button";
import { CustomText } from "@/common/types/slate";

import React from "react";
import { isMarkActive, toggleMark } from "../editorUtils";
import { cn } from "@/common/utils";

interface MarkButtonProps {
  editor: Editor;
  format: keyof CustomText;
  icon: React.ReactNode;
}

export default function MarkButton({ editor, format, icon }: MarkButtonProps) {
  const active = isMarkActive(editor, format);

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn(active && "bg-accent")}
      onMouseDown={(e) => {
        e.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon}
    </Button>
  );
}

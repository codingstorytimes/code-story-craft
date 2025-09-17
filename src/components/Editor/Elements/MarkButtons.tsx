import React from "react";
import { Bold, Italic, Underline, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomEditor } from "../slate";
import { toggleMark, isMarkActive } from "../editorUtils";

interface MarkButtonsProps {
  editor: CustomEditor;
}

const MarkButtons: React.FC<MarkButtonsProps> = ({ editor }) => {
  return (
    <>
      <Button
        type="button"
        variant={isMarkActive(editor, "bold") ? "default" : "ghost"}
        size="sm"
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark(editor, "bold");
        }}
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant={isMarkActive(editor, "italic") ? "default" : "ghost"}
        size="sm"
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark(editor, "italic");
        }}
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant={isMarkActive(editor, "underline") ? "default" : "ghost"}
        size="sm"
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark(editor, "underline");
        }}
      >
        <Underline className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant={isMarkActive(editor, "code") ? "default" : "ghost"}
        size="sm"
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark(editor, "code");
        }}
      >
        <Code className="w-4 h-4" />
      </Button>
    </>
  );
};

export default MarkButtons;

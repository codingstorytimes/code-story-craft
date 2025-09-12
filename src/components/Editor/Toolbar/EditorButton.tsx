import React from "react";
import { Button } from "@/components/ui/button";
import { CustomEditor } from "../slate";
import { LucideIcon } from "lucide-react";

interface EditorButtonProps {
  editor: CustomEditor;
  icon: LucideIcon;
  tooltip?: string;
  onAction: () => void;
  isActive?: boolean;
}

const EditorButton: React.FC<EditorButtonProps> = ({
  editor,
  icon: Icon,
  tooltip,
  onAction,
  isActive = false,
}) => {
  return (
    <Button
      type="button"
      variant={isActive ? "default" : "ghost"}
      size="sm"
      title={tooltip}
      onMouseDown={(e) => {
        e.preventDefault();
        onAction();
      }}
    >
      <Icon className="w-4 h-4" />
    </Button>
  );
};

export default EditorButton;
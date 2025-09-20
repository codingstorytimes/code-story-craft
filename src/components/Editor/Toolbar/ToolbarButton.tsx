import { Button } from "@/components/ui/button";
import { CustomEditor } from "../slate";
import { LucideIcon } from "lucide-react";

export interface ToolBarButtonProps {
  editor: CustomEditor;
  icon: LucideIcon;
  tooltip?: string;
  onAction: (editor: CustomEditor) => void;
  isActive?: boolean;
}

export const ToolbarButton = ({
  editor,
  icon: Icon,
  tooltip,
  onAction,
  isActive = false,
}: ToolBarButtonProps) => {
  return (
    <Button
      type="button"
      variant={isActive ? "default" : "ghost"}
      size="sm"
      title={tooltip}
      onMouseDown={(e) => {
        e.preventDefault();
        onAction(editor);
      }}
    >
      <Icon className="w-4 h-4" />
    </Button>
  );
};

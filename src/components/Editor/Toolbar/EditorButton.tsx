import { Button } from "@/components/ui/button";
import { CustomEditor } from "../slate";
import { LucideIcon } from "lucide-react";

export interface EditorButtonProps {
  editor: CustomEditor;
  icon: LucideIcon;
  tooltip?: string;
  onAction: (editor: CustomEditor) => void;
  isActive?: boolean;
}

export const EditorButton = ({
  editor,
  icon: Icon,
  tooltip,
  onAction,
  isActive = false,
}: EditorButtonProps) => {
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

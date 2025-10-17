import { ComponentType, CustomEditor } from "../../slate";
import React, { useState, useCallback } from "react";
import { AtSign } from "lucide-react";
import { DialogInsertMention } from "./DialogInsertMention";
import { ToolbarButton } from "../../Toolbar/ToolbarButton";
import { isBlockActive } from "../../editorUtils";
import { MentionEvents } from "../../Plugins/Mention/MentionPlugin";

interface MentionToolbarButtonProps {
  editor: CustomEditor;
  userId: string;
}

export const MentionToolbarButton: React.FC<MentionToolbarButtonProps> = ({
  editor,
  userId,
}) => {
  const [showMentionDialog, setShowMentionDialog] = useState(false);

  const handleMentionOpen = useCallback(() => {
    setShowMentionDialog(true);
  }, []);

  React.useEffect(() => {
    window.addEventListener(
      MentionEvents.OPEN,
      handleMentionOpen as EventListener
    );
    return () =>
      window.removeEventListener(
        MentionEvents.OPEN,
        handleMentionOpen as EventListener
      );
  }, [handleMentionOpen]);

  return (
    <>
      <ToolbarButton
        editor={editor}
        icon={AtSign}
        onAction={() => setShowMentionDialog(true)}
        isActive={isBlockActive(editor, ComponentType.Mention)}
        tooltip={`Mention`}
      />
      <DialogInsertMention
        isOpen={showMentionDialog}
        onClose={() => setShowMentionDialog(false)}
        editor={editor}
        userId={userId}
      />
    </>
  );
};

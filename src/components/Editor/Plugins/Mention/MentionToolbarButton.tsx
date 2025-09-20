import React, { useState } from "react";
import { useSlateStatic } from "slate-react";
import { AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import DialogInsertMention from "./DialogInsertMention";
import { CustomEditor } from "../../slate";

interface MentionToolbarButtonProps {
  editor: CustomEditor;
  userId: string;
}

export const MentionToolbarButton: React.FC<MentionToolbarButtonProps> = ({
  editor,
  userId,
}) => {
  const [showMentionDialog, setShowMentionDialog] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onMouseDown={(e) => {
          e.preventDefault();
          setShowMentionDialog(true);
        }}
      >
        <AtSign className="w-4 h-4" />
      </Button>
      <DialogInsertMention
        isOpen={showMentionDialog}
        onClose={() => setShowMentionDialog(false)}
        editor={editor}
        userId={userId}
      />
    </>
  );
};

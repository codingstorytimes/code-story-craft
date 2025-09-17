import React, { useState } from "react";
import { useSlateStatic } from "slate-react";
import { AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import DialogInsertMention from "./DialogInsertMention";

export const MentionToolbarButton: React.FC = () => {
  const editor = useSlateStatic();
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
      />
    </>
  );
};

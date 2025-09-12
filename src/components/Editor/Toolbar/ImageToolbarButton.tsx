import React, { useState } from "react";
import { useSlateStatic } from "slate-react";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { insertImage } from "../editorUtils";
import DialogPostUploadImage from "../Plugins/Image/DialogPostUploadImage";

interface ImageToolbarButtonProps {
  userId: string;
}

export const ImageToolbarButton: React.FC<ImageToolbarButtonProps> = ({ userId }) => {
  const editor = useSlateStatic();
  const [showImageDialog, setShowImageDialog] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onMouseDown={(e) => {
          e.preventDefault();
          setShowImageDialog(true);
        }}
      >
        <ImageIcon className="w-4 h-4" />
      </Button>
      <DialogPostUploadImage
        isOpen={showImageDialog}
        onClose={() => setShowImageDialog(false)}
        insertImage={(url) => insertImage(editor, url)}
        userId={userId}
      />
    </>
  );
};
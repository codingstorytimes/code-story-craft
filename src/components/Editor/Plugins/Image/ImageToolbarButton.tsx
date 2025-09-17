import React, { useState } from "react";
import { useSlateStatic } from "slate-react";
import { Editor, Transforms, Element as SlateElement } from "slate";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import DialogPostUploadImage from "./DialogPostUploadImage";
import { ComponentType } from "../../slate";

interface ImageToolbarButtonProps {
  userId: string;
}

const insertImage = (editor: Editor, url: string) => {
  const text = { text: "" };
  const image: SlateElement = {
    type: ComponentType.Image,
    url,
    children: [text],
  };
  Transforms.insertNodes(editor, image);
  Transforms.insertNodes(editor, {
    type: ComponentType.Paragraph,
    children: [{ text: "" }],
  });
};

export const ImageToolbarButton: React.FC<ImageToolbarButtonProps> = ({
  userId,
}) => {
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

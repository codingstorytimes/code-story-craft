import React, { useState } from "react";
import { useSlateStatic } from "slate-react";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ComponentType,
  CustomEditor,
  IEmbedType,
  ImageElement,
} from "../../slate";
import { insertImage } from "../../editorUtils";
import DialogPostUploadImage from "./DialogPostUploadImage";
// Remove deprecated IEditorPlugin import

export const withImage = <T extends CustomEditor>(editor: T): T => {
  const { isVoid } = editor;
  editor.isVoid = (element) => {
    return element.type === "image" ? true : isVoid(element);
  };

  editor.registerElement({
    type: ComponentType.Image,
    render: ({ attributes, element }) => {
      return (
        <div {...attributes} contentEditable={false} className="my-3">
          <img
            src={(element as ImageElement).url}
            alt=""
            className="max-w-full rounded-md border border-border"
          />
        </div>
      );
    },
  });

  return editor;
};

const ImageToolbarButton = ({ userId }: { userId: string }) => {
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

export const ImagePlugin = {
  id: "image",
  withPlugin: withImage,
  toolbarButtons: [
    {
      id: "image",
      group: "media",
      tooltip: "Insert Image",
      render: (editor: CustomEditor, options?: { userId: string }) => <ImageToolbarButton userId={options?.userId || ""} />,
    },
  ],
};

import React, { useState } from "react";
import { useSlateStatic } from "slate-react";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import { ensureLastParagraph } from "../../editorUtils";
import DialogPostUploadImage from "./DialogPostUploadImage";
import { Editor, Transforms, Descendant } from "slate";

import { ComponentType, CustomEditor, CustomElement } from "../../slate";

import { ImageElement } from "./ImageElement";

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
        insertImage={(url) => {
          const image: ImageElement = {
            type: ComponentType.Image,
            url,
            children: [{ text: "" }],
          };
          Transforms.insertNodes(editor, image as Descendant);
          ensureLastParagraph(editor);
        }}
        userId={userId}
      />
    </>
  );
};

export async function deleteImageBackend(imageUrl: string) {
  try {
    const imagePath = imageUrl.replace(
      `${window.location.origin}/storage/`,
      ""
    );

    await fetch("/api/destroyimage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageupload_path: imagePath }),
    });
  } catch (err) {
    console.error("Error deleting image:", err);
  }
}

// Note: toolbar integration is handled via GroupedToolbar; exporting only the enhancer
export { withImage };

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Editor, Transforms } from "slate";
import { ComponentType, CustomEditor, IEmbedType } from "../../slate";

import DialogEmbeddedStory from "./DialogEmbeddedStory";
import { EmbeddedStoryElement } from "../../Plugins/EmbeddedStory/EmbeddedStoryPlugin";
import { ScrollText } from "lucide-react";
import { ToolbarButton } from "../../Toolbar/ToolbarButton";
import { isBlockActive } from "../../editorUtils";

interface EmbeddedStoryToolbarButtonProps {
  editor: CustomEditor;
  userId: string;
}

const insertEmbeddedStory = ({
  editor,
  embedStoryId,
  embedType,
}: {
  editor: Editor;
  embedStoryId: string;

  embedType: IEmbedType;
}) => {
  const text = { text: "" };
  const image: EmbeddedStoryElement = {
    type: ComponentType.EmbeddedStory,
    embedStoryId,
    embedType,
    children: [text],
  };
  Transforms.insertNodes(editor, image);
  Transforms.insertNodes(editor, {
    type: ComponentType.Paragraph,
    children: [{ text: "" }],
  });
};

export const EmbeddedStoryToolbarButton: React.FC<
  EmbeddedStoryToolbarButtonProps
> = ({ editor, userId }) => {
  const [showEmbeddedStoryDialog, setShowEmbeddedStoryDialog] = useState(false);
  const active = isBlockActive(editor, ComponentType.EmbeddedStory);
  return (
    <>
      <ToolbarButton
        onAction={() => {
          setShowEmbeddedStoryDialog(true);
        }}
        isActive={active}
        tooltip="Link"
        icon={ScrollText}
        editor={editor}
      />

      <DialogEmbeddedStory
        isOpen={showEmbeddedStoryDialog}
        onClose={() => setShowEmbeddedStoryDialog(false)}
        userId={userId}
        handler={(data) => {
          if (data) {
            insertEmbeddedStory({
              editor,
              embedStoryId: data.storyId,
              embedType: data.embedType,
            });
          }
        }}
      />
    </>
  );
};

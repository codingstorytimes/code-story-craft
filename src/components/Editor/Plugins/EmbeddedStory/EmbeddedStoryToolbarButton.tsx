import { useState } from "react";
import { Button } from "react-day-picker";
import { Editor, Transforms } from "slate";
import { ComponentType, CustomEditor, IEmbedType } from "../../slate";

import DialogEmbeddedStory from "./DialogEmbeddedStory";
import { EmbeddedStoryElement } from "./EmbeddedStoryPlugin";
import { ScrollText } from "lucide-react";

interface EmbeddedStoryToolbarButtonProps {
  editor: CustomEditor;
  userId: string;
}

const insertEmbeddedStory = (
  editor: Editor,
  embedStoryId: string,
  embedType: IEmbedType
) => {
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

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onMouseDown={(e) => {
          e.preventDefault();
          setShowEmbeddedStoryDialog(true);
        }}
      >
        <ScrollText className="w-4 h-4" />
      </Button>
      <DialogEmbeddedStory
        editor={editor}
        isOpen={showEmbeddedStoryDialog}
        onClose={() => setShowEmbeddedStoryDialog(false)}
        insertEmbeddedStory={insertEmbeddedStory}
        userId={userId}
      />
    </>
  );
};

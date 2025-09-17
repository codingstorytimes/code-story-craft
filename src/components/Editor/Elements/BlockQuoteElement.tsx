import { Descendant, Editor, Transforms } from "slate";
import { Quote, Bold } from "lucide-react";
import { ensureLastParagraph } from "../editorUtils";
import { ComponentType } from "../slate";
import { EditorButton } from "../Toolbar/EditorButton";

export type BlockQuoteElement = {
  type: ComponentType.BlockQuote;
  children: Descendant[];
};

export function insertQuote(editor: Editor) {
  Transforms.insertNodes(editor, {
    type: ComponentType.BlockQuote,
    children: [{ text: "" }],
  } as Descendant);

  ensureLastParagraph(editor);
}

export const BlockQuoteToolbarButton = ({ editor }: { editor: Editor }) => {
  return (
    <EditorButton
      editor={editor}
      icon={Quote}
      tooltip="Quote"
      onAction={() => insertQuote(editor)}
    />
  );
};

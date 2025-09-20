import { Descendant, Editor, Transforms } from "slate";
import { Quote, Bold } from "lucide-react";
import { ensureLastParagraph } from "../editorUtils";
import { ComponentType } from "../slate";
import { ToolbarButton } from "../Toolbar/ToolbarButton";
import { RenderElementProps } from "slate-react";

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
    <ToolbarButton
      editor={editor}
      icon={Quote}
      tooltip="Quote"
      onAction={() => insertQuote(editor)}
    />
  );
};

export const RenderBlockQuoteElement = ({ attributes, children }) => (
  <blockquote
    {...attributes}
    className="border-l-4 pl-3 italic text-muted-foreground"
  >
    {children}
  </blockquote>
);

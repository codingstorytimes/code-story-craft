import { Editor, Transforms, Descendant, Element as SlateElement } from "slate";
import { ComponentType } from "../slate";
import { Text } from "lucide-react";
import { ToolbarButton } from "../Toolbar/ToolbarButton";

// The type definition for a paragraph element in the editor.
export type ParagraphElement = {
  type: ComponentType.Paragraph;
  children: Descendant[];
};

/**
 * Inserts or converts the current block to a paragraph element.
 * This is designed for a toolbar action, where the user intends to
 * change the type of the current block to a paragraph.
 *
 * @param editor The Slate.js editor instance.
 */
export const insertParagraph = (editor: Editor) => {
  if (!editor.selection) return;

  // Find the closest block element to the current selection.
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      !Editor.isInline(editor, n),
  });

  if (match) {
    const [node, path] = match;
    // Check if the current node is already a paragraph.
    // If not, convert it to a paragraph.
    if ((node as ParagraphElement).type !== ComponentType.Paragraph) {
      Transforms.setNodes(
        editor,
        { type: ComponentType.Paragraph },
        { at: path }
      );
    }
  }
};

/**
 * A React component for the paragraph toolbar button.
 * It renders a button that, when clicked, converts the current block to a paragraph.
 *
 * @param editor The Slate.js editor instance.
 */
export const ParagraphToolbarButton = ({ editor }: { editor: Editor }) => {
  return (
    <ToolbarButton
      editor={editor}
      icon={Text}
      tooltip="Paragraph"
      onAction={() => insertParagraph(editor)}
    />
  );
};

export const RenderParagraphElement = ({ attributes, children }) => (
  <p {...attributes}>{children}</p>
);

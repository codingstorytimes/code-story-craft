import { Descendant, Editor, Path, Transforms } from "slate";
import { ComponentType, CustomEditor } from "../slate";
import { v4 as uuidv4 } from "uuid";

export type ThematicBreakElement = {
  id: string;
  type: ComponentType.ThematicBreak;
  children: Descendant[];
};

export const insertThematicBreak3 = (editor: Editor) => {
  const node: ThematicBreakElement = {
    type: ComponentType.ThematicBreak,
    children: [{ text: "" }],
  } as any;
  Transforms.insertNodes(editor, node);
};

export const insertThematicBreak = (editor: Editor) => {
  const path = editor.selection;

  const node: ThematicBreakElement = {
    id: uuidv4(),
    type: ComponentType.ThematicBreak,
    children: [{ text: "" }],
  };

  Transforms.insertNodes(editor, node, { at: path });
};

export const ThematicBreakToolbarButton = ({
  editor,
}: {
  editor: CustomEditor;
}) => {
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        insertThematicBreak(editor);
      }}
      title="Insert Horizontal Rule"
    >
      ―
    </button>
  );
};

export const RenderThematicBreakElement = ({ attributes, children }) => (
  <div {...attributes} className="my-4">
    <hr className="border-t-2 border-border" />
    {children}
  </div>
);

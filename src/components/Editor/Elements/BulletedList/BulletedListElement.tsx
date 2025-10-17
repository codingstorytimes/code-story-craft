import { Descendant, Editor, Transforms, Element as SlateElement } from "slate";
import { ComponentType, CustomEditor } from "../../slate";
import { ensureLastParagraph } from "../../editorUtils";

import { List } from "lucide-react";
import { ToolbarButton } from "../../Toolbar/ToolbarButton";

export type BulletedListElement = {
  type: ComponentType.BulletedList;
  children: Descendant[];
};

export function toggleBulletedList(editor: Editor) {
  const [inList] = Editor.nodes(editor, {
    match: (n) =>
      SlateElement.isElement(n) &&
      (n as any).type === ComponentType.BulletedList,
  });

  if (inList) {
    // unwrap list and turn items back into paragraphs
    Transforms.unwrapNodes(editor, {
      match: (n) =>
        SlateElement.isElement(n) &&
        (n as any).type === ComponentType.BulletedList,
      split: true,
    });
    Transforms.setNodes(editor, { type: ComponentType.Paragraph } as any, {
      match: (n) =>
        SlateElement.isElement(n) && (n as any).type === ComponentType.ListItem,
    });
    return;
  }

  // Convert current block into list-item then wrap with bulleted-list
  Transforms.setNodes(editor, { type: ComponentType.ListItem } as any, {
    match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n),
  });

  Transforms.wrapNodes(
    editor,
    { type: ComponentType.BulletedList, children: [] } as any,
    {
      match: (n) =>
        SlateElement.isElement(n) && (n as any).type === ComponentType.ListItem,
    }
  );

  ensureLastParagraph(editor);
}

export const BulletedListToolbarButton = ({
  editor,
}: {
  editor: CustomEditor;
}) => {
  return (
    <ToolbarButton
      editor={editor}
      icon={List}
      tooltip="Bullet List"
      onAction={() => {
        toggleBulletedList(editor);
      }}
    />
  );
};

export const RenderBulletedListElement = ({ attributes, children }) => (
  <ul {...attributes} className="list-disc pl-6">
    {children}
  </ul>
);

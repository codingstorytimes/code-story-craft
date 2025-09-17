import { Descendant, Editor, Transforms } from "slate";
import { ComponentType, CustomEditor } from "../slate";
import { ensureLastParagraph } from "../editorUtils";

import { ListItemElement } from "./ListItemElement";
import { List } from "lucide-react";
import { EditorButton } from "../Toolbar/EditorButton";

export type BulletedListElement = {
  type: ComponentType.BulletedList;
  children: ListItemElement[];
};

/**
 * Toggles a bulleted list on or off.
 * If the current selection is within a list, it unwraps the list.
 * If the current selection is not in a list, it transforms the current
 * paragraph into a new bulleted list.
 */
export function toggleBulletedList(editor: Editor) {
  const [match] = Editor.nodes(editor, {
    match: (n) => !Editor.isEditor(n) && n.type === ComponentType.BulletedList,
  });

  // If already in a list, unwrap it.
  if (match) {
    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && n.type === ComponentType.BulletedList,
      split: true,
    });
    return;
  }

  // If not in a list, wrap the current paragraph in a new list.
  const newListItem: ListItemElement = {
    type: ComponentType.ListItem,
    children: [{ text: "" }],
  };

  Transforms.wrapNodes(editor, {
    type: ComponentType.BulletedList,
    children: [newListItem],
  } as Descendant);

  ensureLastParagraph(editor);
}

export const BulletedListToolbarButton = ({
  editor,
}: {
  editor: CustomEditor;
}) => {
  return (
    <EditorButton
      editor={editor}
      icon={List}
      tooltip="Bullet List"
      onAction={() => {
        toggleBulletedList(editor);
      }}
    />
  );
};

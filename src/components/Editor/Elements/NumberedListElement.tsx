import {
  Editor,
  Range,
  Transforms,
  Descendant,
  Element as SlateElement,
  NodeEntry,
  Node,
} from "slate";

import { ComponentType, CustomEditor } from "../slate";
import { EditorButton } from "../Toolbar/EditorButton";
import { ListOrdered } from "lucide-react";

export type NumberedListItemElement = {
  type: ComponentType.NumberedList;
  Numbereded: boolean;
  children: Descendant[];
};

export type NumberedListElement = {
  type: ComponentType.NumberedList;
  children: Descendant[];
};

/**
 * Toggles the current block to a Numberedlist item.
 * If the block is already a Numberedlist item, it will be unwrapped to a paragraph.
 * @param editor The Slate editor instance.
 */
export function toggleNumberedlistItem(editor: Editor) {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      n.type === ComponentType.NumberedList,
  });

  Transforms.setNodes(editor, {
    type: match ? ComponentType.Paragraph : ComponentType.NumberedList,
    Numbereded: match ? undefined : false,
  } as Partial<NumberedListItemElement | any>);
}

export function toggleNumberedList(editor: Editor) {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      n.type === ComponentType.NumberedList,
  });

  Transforms.setNodes(editor, {
    type: match ? ComponentType.Paragraph : ComponentType.NumberedList,
  });
}

export const NumberedListToolbarButton = ({
  editor,
}: {
  editor: CustomEditor;
}) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      n.type === ComponentType.NumberedList,
  });

  return (
    <>
      <EditorButton
        editor={editor}
        icon={ListOrdered}
        tooltip="Numbered List"
        onAction={() => {
          toggleNumberedList(editor);
        }}
      />
    </>
  );
};

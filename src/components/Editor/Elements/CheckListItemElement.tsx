import { Descendant, Editor, Transforms, Element as SlateElement } from "slate";
import { ComponentType, CustomEditor } from "../slate";
import { ToolbarButton } from "../Toolbar/ToolbarButton";
import { ListChecks } from "lucide-react";

export type CheckListItemElement = {
  type: ComponentType.CheckListItem;
  checked: boolean;
  children: Descendant[];
};

/**
 * Toggles the current block to a checklist item.
 * If the block is already a checklist item, it will be unwrapped to a paragraph.
 * @param editor The Slate editor instance.
 */
export function toggleChecklistItem(editor: Editor) {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      n.type === ComponentType.CheckListItem,
  });

  Transforms.setNodes(editor, {
    type: match ? ComponentType.Paragraph : ComponentType.CheckListItem,
    checked: match ? undefined : false,
  } as Partial<CheckListItemElement | any>);
}

export const CheckListToolbarButton = ({
  editor,
}: {
  editor: CustomEditor;
}) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      n.type === ComponentType.CheckListItem,
  });

  return (
    <>
      <ToolbarButton
        editor={editor}
        icon={ListChecks}
        tooltip="Checklist"
        isActive={!!match}
        onAction={toggleChecklistItem}
      />
    </>
  );
};

export const RenderCheckListItemElement = ({
  attributes,
  element,
  children,
}) => {
  const el = element as CheckListItemElement;
  return (
    <div {...attributes} className="flex items-center gap-2">
      <input type="checkbox" checked={el.checked} readOnly />
      <span>{children}</span>
    </div>
  );
};

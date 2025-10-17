// -----------------------------
// Toolbar button

import { CustomEditor, ComponentType } from "@/components/Editor/slate";

import { Editor, Transforms, Path, Element as SlateElement } from "slate";
import { DialogInsertLink, isLinkActive, unwrapLink } from "./DialogLink";
import React, { useMemo, MouseEvent } from "react";
import { LinkEvents } from "./LinkElement";

// -----------------------------
export const LinkToolbarButton: React.FC<{ editor: CustomEditor }> = ({
  editor,
}) => {
  const isActive = useMemo(() => isLinkActive(editor), [editor.selection]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isActive) {
      const found = Array.from(
        Editor.nodes(editor, {
          match: (n) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            (n as any).type === ComponentType.Link,
        })
      )[0];
      const [matchNode, matchPath] = found || ([] as any);
      if (matchNode && matchPath) {
        Transforms.select(editor, matchPath as Path);
        unwrapLink(editor);
        return;
      }
    }

    window.dispatchEvent(new CustomEvent(LinkEvents.OPEN));
  };

  return (
    <>
      <button
        onMouseDown={handleClick}
        title={isActive ? "Remove Link" : "Insert Link (Ctrl+K)"}
        className={`p-2 rounded ${
          isActive ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        🔗
      </button>
      <DialogInsertLink editor={editor} />
    </>
  );
};

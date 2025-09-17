import React, { useMemo, useCallback, KeyboardEvent } from "react";
import {
  Descendant,
  Editor,
  Element as SlateElement,
  Transforms,
  Range,
  Path,
} from "slate";
import { Slate, Editable, ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";

import RenderSlateElement, { RenderLeaf } from "./RenderSlateElement";

import { ComponentType } from "./slate";
import { createCustomEditor, toggleMark } from "./editorUtils";
//import { allTools } from "./plugins/plugins";

interface SlateEditorCoreProps {
  value: Descendant[];
  onChange: (value: Descendant[]) => void;
  placeholder?: string;
  userId: string;
}

type CustomEditor = Editor & ReactEditor & HistoryEditor;

const handleKeyDown = (editor: CustomEditor) => {
  return (event: KeyboardEvent) => {
    const { selection } = editor;
    if (!selection) return;

    // Handle Backspace/Delete near image
    if (
      (event.key === "Backspace" || event.key === "Delete") &&
      Range.isCollapsed(selection)
    ) {
      const point =
        event.key === "Backspace"
          ? Editor.before(editor, selection)
          : Editor.after(editor, selection);
      if (point) {
        const nodeEntry = Editor.nodes(editor, {
          at: point,
          match: (n) =>
            SlateElement.isElement(n) && n.type === ComponentType.Image,
        }).next().value;

        if (nodeEntry) {
          event.preventDefault();
          Transforms.removeNodes(editor, { at: nodeEntry[1] });
          return;
        }
      }
    }

    // Tab in code block
    const blockEntry = Editor.above(editor, {
      at: selection,
      match: (n) => SlateElement.isElement(n),
    });

if (
      event.key === "Tab" &&
      blockEntry &&
      SlateElement.isElement(blockEntry[0]) &&
      (blockEntry[0] as any).type === ComponentType.CodeBlock
    ) {
      event.preventDefault();
      Transforms.insertText(editor, "    ");
      return;
    }

    // Heading Enter handling
    if (event.key === "Enter") {
    }

    // Ctrl/Cmd shortcuts
    if (event.ctrlKey || event.metaKey) {
      switch (event.key.toLowerCase()) {
        case "b":
          event.preventDefault();
          toggleMark(editor, "bold");
          break;
        case "i":
          event.preventDefault();
          toggleMark(editor, "italic");
          break;
        case "u":
          event.preventDefault();
          toggleMark(editor, "underline");
          break;
        case "z":
          event.preventDefault();
          if (event.shiftKey) {
            HistoryEditor.redo(editor);
          } else {
            HistoryEditor.undo(editor);
          }
          break;
        case "y":
          event.preventDefault();
          HistoryEditor.redo(editor);
          break;
      }
    }
  };
};

/* Toolbar */
function Toolbar({ editor, userId }: { editor: CustomEditor; userId: string }) {
  const GroupedToolbar = React.lazy(() => import("./Toolbar/GroupedToolbar"));
  return (
    <React.Suspense fallback={<div>Loading toolbar...</div>}>
      <GroupedToolbar editor={editor} userId={userId} />
    </React.Suspense>
  );
}

export default function SlateEditorCore({
  value,
  onChange,
  placeholder = "Start writing your story...",
  userId,
}: SlateEditorCoreProps) {
  const editor = useMemo(() => createCustomEditor(), []);

  const handleChange = useCallback(
    (newValue: Descendant[]) => {
      onChange(newValue);
    },
    [onChange, editor]
  );

  return (
    <div className="h-full flex flex-col">
      {/* Editor */}
      <div className="flex-1 p-4">
        <Slate
          key={JSON.stringify(value)}
          editor={editor}
          initialValue={value}
          onValueChange={handleChange}
        >
          <Toolbar editor={editor} userId={userId} />
          <Editable
            renderElement={(props) => (
              <RenderSlateElement
                {...props}
                editor={editor}
                viewMode="editor"
              />
            )}
            renderLeaf={(props) => <RenderLeaf {...props} />}
            placeholder={placeholder}
            className="min-h-[300px] text-base leading-relaxed outline-none"
            spellCheck
            onKeyDown={handleKeyDown(editor)}
          />
        </Slate>
      </div>
    </div>
  );
}

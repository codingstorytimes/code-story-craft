import React, { useMemo, useCallback, KeyboardEvent } from "react";
import { Descendant } from "slate";
import { Slate, Editable } from "slate-react";

import RenderSlateElement, { RenderLeaf } from "./RenderSlateElement";

import { toggleMark } from "./editorUtils";

import { HistoryEditor } from "slate-history";

import { createCustomEditor, CustomEditor } from "./slate";

interface SlateEditorCoreProps {
  value: Descendant[];
  onChange: (value: Descendant[]) => void;
  placeholder?: string;
  userId: string;
}

const handleKeyDown = (editor: CustomEditor) => {
  return (event: KeyboardEvent) => {
    const { selection } = editor;
    if (!selection) return;

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

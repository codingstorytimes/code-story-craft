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

import { IEmbedType, ComponentType } from "./slate";
import {
  updateHeadingSlugs,
  createCustomEditor,
  toggleMark,
} from "./editorUtils";
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
      blockEntry[0].type === ComponentType.CodeBlock
    ) {
      event.preventDefault();
      Transforms.insertText(editor, "    ");
      return;
    }

    // Heading Enter handling
    if (event.key === "Enter") {
      const [currentTextNode, textPath] = Editor.node(
        editor,
        selection.anchor.path
      );
      const [currentElementNode, elementPath] = Editor.parent(editor, textPath);
      if (
        SlateElement.isElement(currentElementNode) &&
        currentElementNode.type === ComponentType.Heading
      ) {
        event.preventDefault();
        Transforms.insertNodes(
          editor,
          {
            type: ComponentType.Paragraph,
            children: [{ text: "" }],
          },
          { at: Path.next(elementPath) }
        );
        Transforms.select(editor, Editor.start(editor, Path.next(elementPath)));
        return;
      }
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
  const [showEmbeddedStoryDialog, setShowEmbeddedStoryDialog] =
    React.useState(false);
  const [embedStoryId, setEmbedStoryId] = React.useState("");
  const [embedType, setEmbedType] = React.useState<IEmbedType>("inline");

  return (
    <div className="border-b border-border p-2 flex gap-1 flex-wrap">
      //Toolbars
    </div>
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
      updateHeadingSlugs(editor);
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

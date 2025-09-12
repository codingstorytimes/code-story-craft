import React, { useRef, useEffect, useState, useMemo } from "react";
import ReactDOM from "react-dom";
import { Descendant, Editor, Range, Transforms, createEditor } from "slate";
import { Slate, Editable, ReactEditor, useSlate, withReact } from "slate-react";
import {
  Bold,
  Italic,
  Underline,
  Code,
  Strikethrough,
  Quote,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Type,
  Palette,
  Sun,
  Eraser,
  Plus,
  CaseUpper,
  Table,
  Image,
  Video,
  Link,
  AtSign,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { ComponentType, CustomEditor } from "@/components/Editor/slate";
import {
  createCustomEditor,
  isMarkActive,
  toggleMark,
} from "@/components/Editor/editorUtils";
import { withTable } from "@/components/Editor/plugins/TablePlugin";

// Simple Icon wrapper for lucide-react
export function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const icons: Record<string, React.ElementType> = {
    Bold,
    Italic,
    Underline,
    Code,
    Strikethrough,
    Quote,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Heading6,
    Type,
    Palette,
    Sun,
    Eraser,
    Plus,
    CaseUpper,
    Table,
    Image,
    Video,
    Link,
    AtSign,
    FileText,
  };
  const LucideIcon = icons[name];
  return LucideIcon ? <LucideIcon className={className} /> : null;
}

const Portal = ({ children }: { children: React.ReactNode }) => {
  return ReactDOM.createPortal(children, document.body);
};

export default function HoveringToolbar() {
  const ref = useRef<HTMLDivElement>(null);
  const editor = useSlate();

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) return;

    if (
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ""
    ) {
      el.removeAttribute("style");
      return;
    }

    const domSelection = window.getSelection();
    if (!domSelection || domSelection.rangeCount === 0) return;

    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();

    el.style.opacity = "1";
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight - 4}px`;
    el.style.left = `${
      rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2
    }px`;
  });

  return (
    <Portal>
      <div
        ref={ref}
        className="absolute z-10 top-[-10000px] left-[-10000px] opacity-0 bg-gray-200 rounded px-2 py-1 transition-opacity duration-700 flex gap-1"
      >
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={isMarkActive(editor, "bold") ? "bg-accent" : ""}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark(editor, "bold");
          }}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={isMarkActive(editor, "italic") ? "bg-accent" : ""}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark(editor, "italic");
          }}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={isMarkActive(editor, "underline") ? "bg-accent" : ""}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark(editor, "underline");
          }}
        >
          <Underline className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={isMarkActive(editor, "code") ? "bg-accent" : ""}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark(editor, "code");
          }}
        >
          <Code className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={isMarkActive(editor, "strikethrough") ? "bg-accent" : ""}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark(editor, "strikethrough");
          }}
        >
          <Strikethrough className="w-4 h-4" />
        </Button>
      </div>
    </Portal>
  );
}

// -----------------------------
// Example Editor
// -----------------------------
const DEFAULT_VALUE: Descendant[] = [
  {
    type: ComponentType.Paragraph,
    children: [
      {
        text: "Type in the editor. Cmd/Ctrl+A inside a table selects the entire table.",
      },
    ],
  },
];

export function Example() {
  const editor = useMemo(() => createCustomEditor(), []);

  const [value, setValue] = useState<Descendant[]>(DEFAULT_VALUE);

  return (
    <div style={{ maxWidth: 640, margin: "20px auto" }}>
      <h3>Slate Editor with Lucide Toolbar</h3>
      <Slate editor={editor} initialValue={value} onChange={setValue}>
        <HoveringToolbar />
        <Editable
          renderElement={(props) =>
            (editor as any).renderElement?.({ ...props, editor }) || (
              <p {...props.attributes}>{props.children}</p>
            )
          }
          style={{ border: "1px solid #ddd", padding: "12px" }}
          onKeyDown={(event) => editor.onKeyDown?.(event)}
        />
      </Slate>
    </div>
  );
}

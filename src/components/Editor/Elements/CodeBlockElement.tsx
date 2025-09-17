import React, { FC, useState, useEffect } from "react";
import { Editor, Transforms, Element as SlateElement, Text } from "slate";
import { useSlate, ReactEditor, RenderElementProps } from "slate-react";
import { Code } from "lucide-react";
import MonacoEditor from "@monaco-editor/react";
import { CustomEditor } from "../slate";

// ----------------------------
// Types
// ----------------------------

type CustomText = { text: string };

export enum ComponentType {
  Paragraph = "paragraph",
  CodeBlock = "code_block",
}

export type ParagraphElement = {
  type: ComponentType.Paragraph;
  children: CustomText[];
};

export type CodeBlockElement = {
  type: ComponentType.CodeBlock;
  language?: string;
  children: CustomText[];
};

export type CustomElement = ParagraphElement | CodeBlockElement;

// ----------------------------
// Utilities
// ----------------------------

export function ensureLastParagraph(editor: Editor) {
  const lastIndex = Math.max(0, editor.children.length - 1);
  const lastNode = editor.children[lastIndex];

  if (
    !SlateElement.isElement(lastNode) ||
    (lastNode as CustomElement).type !== ComponentType.Paragraph
  ) {
    // Insert an empty paragraph at the end without normalizing mid-operation
    Editor.withoutNormalizing(editor, () => {
      Transforms.insertNodes(editor, {
        type: ComponentType.Paragraph,
        children: [{ text: "" }],
      } as ParagraphElement);
    });
  }
}

export function insertCodeBlock(editor: Editor, language = "javascript") {
  const codeBlock: CodeBlockElement = {
    type: ComponentType.CodeBlock,
    language,
    children: [{ text: "" }],
  };

  Transforms.insertNodes(editor, codeBlock);
  // Ensure document always ends with a paragraph so the caret can move out of the code block
  ensureLastParagraph(editor);
}

// ----------------------------
// UI Components
// ----------------------------

export const Button: FC<{
  type?: "button" | "submit" | "reset";
  variant?: "ghost" | "solid";
  size?: "sm" | "md" | "lg";
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}> = ({
  type = "button",
  variant = "solid",
  size = "md",
  onMouseDown,
  children,
}) => {
  const base =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants: Record<"solid" | "ghost", string> = {
    solid: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800",
  };
  const sizes: Record<"sm" | "md" | "lg", string> = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-2",
    lg: "px-4 py-2 text-lg",
  };

  return (
    <button
      type={type}
      onMouseDown={onMouseDown}
      className={`${base} ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </button>
  );
};

// We explicitly type the props for the element component so RenderElementProps is preserved
type RenderCodeBlockElementProps = RenderElementProps & {
  editor: CustomEditor;
  element: RenderCodeBlockElementProps;
};

export const RenderCodeBlockElement: FC<RenderCodeBlockElementProps> = ({
  editor,
  attributes,
  children,
  element,
}) => {
  const [localValue, setLocalValue] = useState<string>(
    (element.children[0]?.text as string) || ""
  );

  // Sync Slate -> Monaco. We only look at the first text child for this simple implementation.
  useEffect(() => {
    const slateValue = (element.children[0]?.text as string) || "";
    if (slateValue !== localValue) setLocalValue(slateValue);
    // Intentionally ignore localValue in deps to avoid update loops when Monaco is the source of truth.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element.children]);

  // Monaco -> Slate
  const handleChange = (newValue?: string) => {
    const text = newValue ?? "";
    setLocalValue(text);

    try {
      // Find the path to the element and update its first text node
      const path = ReactEditor.findPath(editor, element as any);
      const textNodePath = path.concat(0);
      Transforms.setNodes(editor, { text } as Partial<Text>, {
        at: textNodePath,
      });
    } catch (err) {
      // If the element is no longer in the document (race condition), ignore the error
    }
  };

  return (
    <div {...attributes} contentEditable={false} className="my-2">
      <div className="rounded-lg overflow-hidden border border-gray-700">
        <MonacoEditor
          height="200px"
          language={element.language || "javascript"}
          theme="vs-dark"
          value={localValue}
          onChange={handleChange}
          options={{ automaticLayout: true }}
        />
      </div>
      {/* Slate expects children to be rendered after the non-editable UI for proper selection handling */}
      {children}
    </div>
  );
};

export const CodeBlockToolbarButton: FC = (editor: CustomEditor) => {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onMouseDown={(e) => {
        e.preventDefault();
        insertCodeBlock(editor);
      }}
    >
      <Code className="w-4 h-4" />
    </Button>
  );
};

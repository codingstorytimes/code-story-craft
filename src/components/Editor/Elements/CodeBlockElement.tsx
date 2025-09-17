import React from "react";
import { Editor, Transforms } from "slate";
import { RenderElementProps, useSlateStatic } from "slate-react";
import { Code } from "lucide-react";
import { ComponentType, CustomEditor, CustomText } from "../slate";
import { EditorButton } from "../Toolbar/EditorButton";

export type CodeBlockElement = {
  type: ComponentType.CodeBlock;
  language?: string;
  children: CustomText[];
};

export const CodeBlockElementComponent = ({
  attributes,
  children,
  element,
}: RenderElementProps & { element: CodeBlockElement }) => {
  const lang = element.language || "text";
  return (
    <pre {...attributes} className="bg-muted p-3 rounded-md font-mono text-sm overflow-x-auto">
      <code data-language={lang}>{children}</code>
    </pre>
  );
};

export function isCodeBlockActive(editor: CustomEditor) {
  const [match] = Editor.nodes(editor, {
    match: (n) => !Editor.isEditor(n) && (n as any).type === ComponentType.CodeBlock,
  });
  return !!match;
}

export function insertCodeBlock(editor: CustomEditor, language?: string) {
  const block: CodeBlockElement = {
    type: ComponentType.CodeBlock,
    language,
    children: [{ text: "" }],
  };
  Transforms.insertNodes(editor, block as any);
}

export function toggleCodeBlock(editor: CustomEditor, language?: string) {
  if (isCodeBlockActive(editor)) {
    Transforms.setNodes(editor, { type: ComponentType.Paragraph } as any, {
      match: (n) => !Editor.isEditor(n) && (n as any).type === ComponentType.CodeBlock,
    });
  } else {
    insertCodeBlock(editor, language);
  }
}

export const CodeBlockToolbarButton = ({ editor }: { editor: CustomEditor }) => {
  const ed = useSlateStatic();
  const inst = (editor as CustomEditor) || ed;
  return (
    <EditorButton
      editor={inst}
      icon={Code}
      tooltip="Code Block"
      onAction={() => toggleCodeBlock(inst)}
    />
  );
};
// -----------------------------
// Helpers
// -----------------------------

import { FileCode2 } from "lucide-react";

import { Editor, Transforms, Element as SlateElement } from "slate";

import { isBlockActive } from "../../editorUtils";
import { ComponentType, CustomEditor } from "../../slate";
import { ToolbarButton } from "../../Toolbar/ToolbarButton";
import { CodeBlockElement } from "./CodeBlockElement";

const toggleCodeBlock = (editor: Editor, language: string = "javascript") => {
  const isActive = isBlockActive(editor, ComponentType.CodeBlock);
  if (isActive) {
    Transforms.unwrapNodes(editor, {
      match: (n) =>
        SlateElement.isElement(n) &&
        (n as any).type === ComponentType.CodeBlock,
    });
  } else {
    const codeBlock: CodeBlockElement = {
      type: ComponentType.CodeBlock,
      language,
      children: [
        { type: ComponentType.CodeBlockLine, children: [{ text: "" }] },
      ],
    };
    Transforms.wrapNodes(editor, codeBlock, { split: true });
  }
};

export const CodeBlockToolbarButton = ({
  editor,
}: {
  editor: CustomEditor;
}) => {
  return (
    <ToolbarButton
      editor={editor}
      icon={FileCode2}
      onAction={() => toggleCodeBlock(editor)}
      isActive={isBlockActive(editor, ComponentType.CodeBlock)}
      tooltip={`Code Block`}
    />
  );
};

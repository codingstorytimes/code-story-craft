// utils/editorUtils.ts

import React from "react";
import { RenderElementProps } from "slate-react";
import {
  createEditor,
  Editor,
  Element as SlateElement,
  Text,
  Transforms,
  Descendant,
  Range,
  Path,
} from "slate";
import { withHistory, HistoryEditor } from "slate-history";
import slugify from "slugify";

import {
  ComponentType,
  CustomEditor,
  CustomElement,
  CustomText,
  IEmbedType,
} from "./slate";
import { withTable } from "./Plugins/Table/TablePlugin";
import { withReact } from "slate-react";
import { withMention } from "./Plugins/Mention/MentionPlugin";
import { withImage } from "./Plugins/Image/ImagePlugin";
import { withEmbeddedStory } from "./Plugins/EmbeddedStory/withEmbeddedStory";
import { withPlugin } from "./Plugins/PluginEditor";

export function createCustomEditor(): Editor & HistoryEditor {
  let editor = withHistory(withReact(withPlugin(createEditor())));
  editor = withEmbeddedStory(
    withImage(withMention(withTable(editor)))
  ) as CustomEditor;

  const { insertBreak } = editor;
  editor.insertBreak = () => {
    const [match] = Editor.nodes(editor, {
      match: (n) =>
        SlateElement.isElement(n) && n.type === ComponentType.CodeBlock,
    });

    if (match) {
      Editor.insertText(editor, "\n");
    } else {
      insertBreak();
    }
  };

  return editor;
}

export function isMarkActive(
  editor: Editor,
  format: keyof CustomText
): boolean {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
}

export function toggleMark(editor: Editor, format: keyof CustomText) {
  const marks = Editor.marks(editor);
  if (marks?.[format]) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
}
export function ensureLastParagraph(editor: Editor) {
  const lastNode = editor.children[editor.children.length - 1];

  if (
    !SlateElement.isElement(lastNode) ||
    lastNode.type !== ComponentType.Paragraph
  ) {
    Editor.withoutNormalizing(editor, () =>
      Transforms.insertNodes(editor, {
        type: ComponentType.Paragraph,
        children: [{ text: "" }],
      })
    );
  }
}

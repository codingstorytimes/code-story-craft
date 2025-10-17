// utils/editorUtils.ts

import {
  createEditor,
  Editor,
  Element as SlateElement,
  Transforms,
} from "slate";
import { withHistory, HistoryEditor } from "slate-history";

import { ComponentType, CustomEditor, CustomText } from "./slate";
import { withTable } from "./Plugins/Table/TablePlugin";
import { withReact } from "slate-react";
import { withMentions } from "./Plugins/Mention/MentionPlugin";
import { withImage } from "./Plugins/Image/ImagePlugin";

import { withPlugin } from "./Plugins/PluginEditor";
import { withEmbeddedStory } from "./Plugins/EmbeddedStory/EmbeddedStoryPlugin";
import { withLinks } from "./Plugins/Link/LinkPlugin";

export const isBlockActive = (editor: Editor, type: ComponentType) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      (n as any).type === type,
  });
  return !!match;
};

export const isMarkActive = (editor: Editor, format: keyof CustomText) => {
  const marks = Editor.marks(editor) as Record<string, any> | null;
  return marks ? marks[format] === true : false;
};

export const toggleMark = (editor: Editor, format: keyof CustomText) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) Editor.removeMark(editor, format);
  else Editor.addMark(editor, format, true);
};

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

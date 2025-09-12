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
  EditorElementPlugin,
  IEmbedType,
  PluginEditor,
} from "./slate";
import { withTable } from "./Plugins/Table/TablePlugin";
import { withReact } from "slate-react";
import { withMention } from "./Plugins/Mention/MentionPlugin";
import { withImage } from "./Plugins/Image/ImagePlugin";
import { withEmbeddedStory } from "./Plugins/EmbeddedStory/withEmbeddedStory";

export function createCustomEditor(): Editor & HistoryEditor {
  let editor = withHistory(withReact(createEditor())) as CustomEditor;

  const elementPlugins = new Map<string, EditorElementPlugin>();
  editor.registerElement = (plugin) => {
    elementPlugins.set(plugin.type, plugin);
  };

  editor.renderElement = (props) => {
    const plugin = elementPlugins.get(props.element.type);
    if (plugin) {
      return plugin.render({ ...props, editor });
    }
  };

  editor = withEmbeddedStory(withImage(withMention(withTable(editor))));

  editor.isVoid = (element) =>
    SlateElement.isElement(element) && element.type === "image";
  editor.isInline = (element) =>
    SlateElement.isElement(element) && element.type === ComponentType.Mention;

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

export function insertCodeBlock(editor: Editor, language = "javascript") {
  const codeBlock: CustomElement = {
    type: ComponentType.CodeBlock,
    language,
    children: [{ text: "" }],
  };

  Transforms.insertNodes(editor, codeBlock as Descendant);
  ensureLastParagraph(editor);
}

export function insertQuote(editor: Editor) {
  Transforms.insertNodes(editor, {
    type: ComponentType.BlockQuote,
    children: [{ text: "" }],
  } as Descendant);

  ensureLastParagraph(editor);
}

export function insertHeadingBlock(editor: Editor) {
  const heading: CustomElement = {
    type: ComponentType.Heading,
    slug: "",
    children: [{ text: "" }],
  };

  Transforms.insertNodes(editor, heading as Descendant);
  ensureLastParagraph(editor);
}

export function insertImage(editor: Editor, url: string) {
  const image: CustomElement = {
    type: ComponentType.Image,
    url,
    children: [{ text: "" }],
  };

  Transforms.insertNodes(editor, image as Descendant);
  ensureLastParagraph(editor);
}

export async function deleteImageBackend(imageUrl: string) {
  try {
    const imagePath = imageUrl.replace(
      `${window.location.origin}/storage/`,
      ""
    );

    await fetch("/api/destroyimage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageupload_path: imagePath }),
    });
  } catch (err) {
    console.error("Error deleting image:", err);
  }
}

export function updateHeadingSlugs(editor: Editor) {
  editor.children.forEach((node, idx) => {
    if (!SlateElement.isElement(node) || node.type !== "heading") return;

    const text = node.children
      .map((c) => (Text.isText(c) ? c.text : ""))
      .join("");

    const slug = slugify(text || `heading-${idx}`, {
      lower: true,
      strict: true,
    });

    if (node.slug !== slug) {
      Transforms.setNodes(editor, { slug }, { at: [idx] });
    }
  });
}

export const insertEmbeddedStory = (
  editor: Editor,
  embedStoryId: string,
  embedType: IEmbedType
) => {
  if (!embedStoryId) return;
  const embedBlock: CustomElement = {
    type: ComponentType.EmbeddedStory,
    storyId: embedStoryId,
    embedType,
    children: [{ text: "" }],
  };
  Transforms.insertNodes(editor, embedBlock as Descendant);
  ensureLastParagraph(editor);
};

export function insertMention(editor: Editor, character: string) {
  const mention: CustomElement = {
    type: ComponentType.Mention,
    character,
    children: [{ text: "" }],
  };
  
  Transforms.insertNodes(editor, mention as Descendant);
  Transforms.move(editor);
}
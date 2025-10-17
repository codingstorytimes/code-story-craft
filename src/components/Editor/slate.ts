import { BaseEditor, createEditor, Descendant, Editor } from "slate";
import { HistoryEditor, withHistory } from "slate-history";
import { ReactEditor, RenderElementProps, withReact } from "slate-react";

import type { BlockQuoteElement } from "./Elements/BlockQuote/BlockQuoteElement";
import type { BulletedListElement } from "./Elements/BulletedList/BulletedListElement";
import type { CheckListItemElement } from "./Elements/CheckList/CheckListItemElement";

import type { EditableVoidElement } from "./Elements/EditableVoidElement";

import type { HeadingElement } from "./Elements/Headings/HeadingElements";

import type { ListItemElement } from "./Elements/ListItem/ListItemElement";

import type { NumberedListElement } from "./Elements/NumberedList/NumberedListElement";
import type { ParagraphElement } from "./Elements/Paragraph/ParagraphElement";

import type { ThematicBreakElement } from "./Elements/ThematicBreak/ThematicBreakElement";
import type { VideoElement } from "./Elements/Video/VideoElement";

import { PluginEditor, withPlugin } from "./Plugins/PluginEditor";

import {
  withCodeBlock,
  type CodeBlockElement,
  type CodeBlockLineElement,
} from "./Plugins/CodeBlock/CodeBlockPlugin";
import {
  withEmbeddedStory,
  type EmbeddedStoryElement,
} from "./Plugins/EmbeddedStory/EmbeddedStoryPlugin";
import {
  withMentions,
  type MentionElement,
} from "./Plugins/Mention/MentionPlugin";

import type {
  TableElement,
  TableRowElement,
  TableCellElement,
} from "./Plugins/Table/TableElement";

import { ImageElement, withImage } from "./Plugins/Image/ImagePlugin";
import { LinkElement, withLinks } from "./Plugins/Link/LinkPlugin";
import { TableEditor, withTable } from "./Plugins/Table/TablePlugin";
import { TagElement } from "./Elements/Tag/TagElement";

// Export all element types for slate-markdown
export type {
  BlockQuoteElement,
  BulletedListElement,
  CheckListItemElement,
  CodeBlockElement,
  CodeBlockLineElement,
  EditableVoidElement,
  EmbeddedStoryElement,
  HeadingElement,
  ListItemElement,
  NumberedListElement,
  ParagraphElement,
  TagElement,
  ThematicBreakElement,
  VideoElement,
  ImageElement,
  LinkElement,
};

// ------------------------
// Types, Enums, Interfaces
// ------------------------
export enum ComponentType {
  BlockQuote = "block-quote",
  BulletedList = "bulleted-list",
  NumberedList = "numbered-list",
  CheckListItem = "check-list-item",
  CodeBlock = "code-block",
  CodeBlockLine = "code_block_line",
  EditableVoid = "editable-void",
  EmbeddedStory = "embedded-story",
  Heading = "heading",
  HeadingOne = "h1",
  HeadingTwo = "h2",
  HeadingThree = "h3",
  HeadingFour = "h4",
  HeadingFive = "h5",
  HeadingSix = "h6",
  Image = "image",
  Link = "link",
  ListItem = "list-item",
  Mention = "mention",
  Paragraph = "paragraph",
  Table = "table",
  TableRow = "table-row",
  TableCell = "table-cell",
  Tag = "tag",
  Video = "video",
  ThematicBreak = "thematic-break",
}

export enum Mark {
  Bold = "bold",
  Italic = "italic",
  Strikethrough = "strikethrough",
  Underline = "underline",
  Code = "code",
}

export enum Alignment {
  Left = "left",
  Center = "center",
  Right = "right",
  Justify = "justify",
}

export enum InlineStyle {
  Color = "color",
  FontSize = "fontSize",
  BackgroundColor = "backgroundColor",
}

export enum ToolbarGroupId {
  Marks = "marks",
  Block = "block",
  Headings = "headings",
  Lists = "lists",
  Media = "media",
  Align = "align",
  Inserts = "inserts",
}

export interface IToolbarGroup {
  group: ToolbarGroupId | string;
  label: string;
  divider?: boolean;
}

export interface ITool {
  id: string;
  ToolBarButton: React.ReactNode;
  category: "mark" | "block" | "align" | "inline" | "modal";
  group: ToolbarGroupId | string;
  ModalComponent?: React.ComponentType<{
    onClose: () => void;
    handler?: (data?: any) => void;
  }>;
}

export type IEmbedType = "mini" | "inline" | "full";

export type CustomText = {
  text: string;
  id?: string;
  align?: string;
  backgroundColor?: string;
  bold?: boolean;
  checked?: boolean;
  className?: string;
  code?: boolean;
  color?: string;
  embedStoryId?: string;
  embedType?: string;
  fontSize?: string;
  headingLevel?: number;
  italic?: boolean;
  language?: string;
  mention?: string;
  strikethrough?: boolean;
  underline?: boolean;
  url?: string;
  userId?: string;
};

// Unified Element Type
export type CustomElement =
  | BlockQuoteElement
  | BulletedListElement
  | CheckListItemElement
  | CodeBlockElement
  | CodeBlockLineElement
  | EditableVoidElement
  | EmbeddedStoryElement
  | HeadingElement
  | ImageElement
  | LinkElement
  | ListItemElement
  | MentionElement
  | NumberedListElement
  | ParagraphElement
  | TableCellElement
  | TableElement
  | TableRowElement
  | TagElement
  | ThematicBreakElement
  | VideoElement;

// Slate Editor Type
export type CustomEditor = BaseEditor &
  ReactEditor &
  HistoryEditor &
  PluginEditor &
  TableEditor;

// Augment Slate's Custom Types
declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

// --- Props for element renderer ---
export interface RenderSlateElementProps
  extends Omit<RenderElementProps, "element"> {
  element: CustomElement;
  editor: CustomEditor;
  viewMode?: "editor" | "read";
}

/**
 * Uses reduce to apply plugins from a list instead of nesting function calls.
 * nesting: `let editor = withHistory(withReact(withPlugin(createEditor())));`
 */
export function createCustomEditor(): Editor & HistoryEditor {
  const plugins = [
    withPlugin,
    withReact,
    withHistory,
    withLinks,
    withEmbeddedStory,
    withImage,
    withMentions,
    withTable,
    withCodeBlock,
  ];

  const editor = plugins.reduce(
    (acc, withEnhancer) => withEnhancer(acc),
    createEditor()
  );
  return editor as CustomEditor;
}

import { BaseEditor, Descendant } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor, RenderElementProps } from "slate-react";

import type { BlockQuoteElement } from "./Elements/BlockQuoteElement";
import type { BulletedListElement } from "./Elements/BulletedListElement";
import type { CheckListItemElement } from "./Elements/CheckListItemElement";
import type {
  CodeBlockElement,
  CodeBlockLineElement,
} from "./Plugins/CodeBlock/CodeBlockElement";
import type { EditableVoidElement } from "./Elements/EditableVoidElement";
import type { EmbeddedStoryElement } from "./Plugins/EmbeddedStory/EmbeddedStoryPlugin";

import type { HeadingElement } from "./Elements/HeadingElements";

import type { ListItemElement } from "./Elements/ListItemElement";
import type { MentionElement } from "./Plugins/Mention/MentionPlugin";
import type { NumberedListElement } from "./Elements/NumberedListElement";
import type { ParagraphElement } from "./Elements/ParagraphElement";
import type { TagElement } from "./TagElement";
import type { ThematicBreakElement } from "./Elements/ThematicBreakElement";
import type { VideoElement } from "./VideoElement";

import type {
  TableElement,
  TableRowElement,
  TableCellElement,
} from "./Plugins/Table/TableElement";
import { PluginEditor } from "./Plugins/PluginEditor";
import { Underline } from "lucide-react";
import { ImageElement } from "./Plugins/Image/ImagePlugin";
import { LinkElement } from "./Elements/LinkElement";
import { TableEditor } from "./Plugins/Table/TablePlugin";

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

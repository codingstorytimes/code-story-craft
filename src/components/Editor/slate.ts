import { BaseEditor, Descendant } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor, RenderElementProps } from "slate-react";

import type { BlockQuoteElement } from "./Elements/BlockQuoteElement";
import type { BulletedListElement } from "./Elements/BulletedListElement";
import type { CheckListItemElement } from "./Elements/CheckListItemElement";
import type { CodeBlockElement } from "./Elements/CodeBlockElement";
import type { EditableVoidElement } from "./Elements/EditableVoidElement";
import type { EmbeddedStoryElement } from "./Plugins/EmbeddedStory/EmbeddedStoryPlugin";

import type {
  HeadingOneElement,
  HeadingTwoElement,
  HeadingThreeElement,
  HeadingFourElement,
  HeadingFiveElement,
  HeadingSixElement,
} from "./Elements/HeadingElements";

import type { ImageElement } from "./Plugins/Image/ImageElement";
import type { LinkElement } from "./Elements/LinkElement";
import type { ListItemElement } from "./Elements/ListItemElement";
import type { MentionElement } from "./Plugins/Mention/MentionPlugin";
import type { NumberedListElement } from "./Elements/NumberedListElement";
import type { ParagraphElement } from "./Elements/ParagraphElement";
import type { TagElement } from "./TagElement";
import type { ThematicBreakElement } from "./Elements/ThematicBreakElement";
import type { TitleElement } from "./TitleElement";
import type { VideoElement } from "./VideoElement";

import type {
  TableElement,
  TableRowElement,
  TableCellElement,
} from "./Plugins/Table/TableElement";
import { PluginEditor } from "./Plugins/PluginEditor";
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
  Title = "title",
  Video = "video",
  ThematicBreak = "thematic-break",
}

export enum Mark {
  Bold = "bold",
  Italic = "italic",
  Strikethrough = "strikethrough",
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
  bold?: boolean;
  code?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  text: string;
  underline?: boolean;
  align?: string;
  color?: string;
  backgroundColor?: string;
  fontSize?: string;
  url?: string;
  mention?: string;
  userId?: string;
  embedStoryId?: string;
  embedType?: string;
  headingLevel?: number;
};

export interface TableEditor extends CustomEditor {
  table: any; // Simplified for this context
  selectionEvents?: any;
}

// Unified Element Type
export type CustomElement =
  | BlockQuoteElement
  | BulletedListElement
  | CheckListItemElement
  | CodeBlockElement
  | EditableVoidElement
  | EmbeddedStoryElement
  | HeadingOneElement
  | HeadingTwoElement
  | HeadingThreeElement
  | HeadingFourElement
  | HeadingFiveElement
  | HeadingSixElement
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
  | TitleElement
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

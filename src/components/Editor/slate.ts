import { BaseEditor, Descendant } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor, RenderElementProps } from "slate-react";

import {
  TableCellElement,
  ComponentType as TableComponentType,
  TableEditor,
  TableElement,
  TableRowElement,
} from "./plugins/TablePlugin";

// ------------------- Block Components -------------------
// enum, designed for block-level elements like headings and paragraphs
export enum ComponentType {
  BlockQuote = "block-quote",
  BulletedList = "bulleted-list",
  NumberedList = "numbered-list",
  CheckListItem = "check-list-item",
  CodeBlock = "code-block",
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
  TableCell = "table-cell",
  TableRow = "table-row",
  Table = "table",
  Tag = "tag",
  Title = "title",
  Video = "video",
  ThematicBreak = "thematic-break",
}

export type IEmbedType = "mini" | "inline" | "full";

export type CustomText = {
  bold?: boolean;
  code?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  text: string;
  underline?: boolean;
};

// Element Types
export type BlockQuoteElement = {
  type: ComponentType.BlockQuote;
  children: Descendant[];
};

export type BulletedListElement = {
  type: ComponentType.BulletedList;
  children: ListItemElement[];
};

export type NumberedListElement = {
  type: ComponentType.NumberedList;
  children: ListItemElement[];
};

export type CheckListItemElement = {
  type: ComponentType.CheckListItem;
  checked: boolean;
  children: Descendant[];
};

export type CodeBlockElement = {
  type: ComponentType.CodeBlock;
  language?: string;
  children: CustomText[];
};

export type EditableVoidElement = {
  type: ComponentType.EditableVoid;
  children: CustomText[];
};

export type EmbeddedStoryElement = {
  type: ComponentType.EmbeddedStory;
  storyId: string;
  embedType?: IEmbedType;
  children: CustomText[];
};

export type HeadingElement = {
  type: ComponentType.Heading;
  slug: string;
  children: Descendant[];
};

export type HeadingOneElement = {
  type: ComponentType.HeadingOne;
  children: Descendant[];
};

export type HeadingTwoElement = {
  type: ComponentType.HeadingTwo;
  children: Descendant[];
};

export type HeadingThreeElement = {
  type: ComponentType.HeadingThree;
  children: Descendant[];
};

export type HeadingFourElement = {
  type: ComponentType.HeadingFour;
  children: Descendant[];
};

export type HeadingFiveElement = {
  type: ComponentType.HeadingFive;
  children: Descendant[];
};
export type HeadingSixElement = {
  type: ComponentType.HeadingSix;
  children: Descendant[];
};

export type ImageElement = {
  type: ComponentType.Image;
  url: string;
  children: CustomText[];
};

export type LinkElement = {
  type: ComponentType.Link;
  url: string;
  children: Descendant[];
};

export type ListItemElement = {
  type: ComponentType.ListItem;
  children: Descendant[];
  level?: number;
};

export type MentionElement = {
  type: ComponentType.Mention;
  character: string;
  children: Descendant[];
};

export type ParagraphElement = {
  type: ComponentType.Paragraph;
  children: Descendant[];
};

export type TagElement = {
  type: ComponentType.Tag;
  value?: string;
  num?: number;
  children: CustomText[];
};

export type TitleElement = {
  type: ComponentType.Title;
  children: Descendant[];
};

export type VideoElement = {
  type: ComponentType.Video;
  url?: string;
  children: CustomText[];
};

// Unified Element Type
export type CustomElement =
  | BlockQuoteElement
  | BulletedListElement
  | CheckListItemElement
  | CodeBlockElement
  | EditableVoidElement
  | EmbeddedStoryElement
  | HeadingElement
  | HeadingOneElement
  | HeadingTwoElement
  | HeadingThreeElement
  | HeadingFourElement
  | HeadingFiveElement
  | HeadingSixElement
  | ImageElement
  | LinkElement
  | MentionElement
  | NumberedListElement
  | ParagraphElement
  | TableCellElement
  | TableElement
  | TableRowElement
  | TagElement
  | TitleElement
  | VideoElement;

// Slate Editor Type
export type CustomEditor = BaseEditor &
  TableEditor &
  ReactEditor &
  HistoryEditor;

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

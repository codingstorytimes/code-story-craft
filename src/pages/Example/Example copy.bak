import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  FunctionComponent,
} from "react";
import ReactDOM from "react-dom/client";
import {
  createEditor,
  Editor,
  Transforms,
  Element,
  BaseEditor,
  Range,
  Descendant,
  Node,
} from "slate";
import {
  withReact,
  ReactEditor,
  Slate,
  Editable,
  useFocused,
  useSelected,
} from "slate-react";
import { withHistory, HistoryEditor } from "slate-history";
import isHotkey from "is-hotkey";
import { v4 as uuidv4 } from "uuid";

// This custom Icon component replaces the need for importing from 'lucide-react'
// directly, as that would fail in this single-file environment.
const Icon = ({ name, className = "" }) => {
  const icons = {
    Bold: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bold"><path d="M6 12h8a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4H6z"/></svg>`,
    Italic: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-italic"><line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/></svg>`,
    Strikethrough: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-strikethrough"><path d="M5 12h14"/><path d="M16 6V3.5a2.5 2.5 0 0 0-5 0v3a2.5 2.5 0 0 1-5 0v-3"/><path d="M18 18v3.5a2.5 2.5 0 0 1-5 0v-3a2.5 2.5 0 0 1-5 0v3"/></svg>`,
    Code: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-code"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    Quote: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-quote"><path d="M3 21c3 0 7-10 7-15V4c0-1.1-0.9-2-2-2H3c-1.1 0-2 0.9-2 2v1c0 2.2 1.8 4 4 4c-1.1 2.5-1.1 4-2 7.5c-0.8 3.5 0 1.5 1 2c1 0.5 2.2 0.5 3 0c1.8-0.8 2.5-1.5 3-3"/><path d="M15 21c3 0 7-10 7-15V4c0-1.1-0.9-2-2-2h-5c-1.1 0-2 0.9-2 2v1c0 2.2 1.8 4 4 4c-1.1 2.5-1.1 4-2 7.5c-0.8 3.5 0 1.5 1 2c1 0.5 2.2 0.5 3 0c1.8-0.8 2.5-1.5 3-3"/></svg>`,
    List: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>`,
    ListOrdered: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-ordered"><line x1="10" x2="21" y1="6" y2="6"/><line x1="10" x2="21" y1="12" y2="12"/><line x1="10" x2="21" y1="18" y2="18"/><path d="M4 6h1c2 0 2-1 2-2s-1-2-2-2H4s-2 1-2 2c0 1.5 1 2 2 2z"/><path d="M4 14h1c2 0 2-1 2-2s-1-2-2-2H4s-2 1-2 2c0 1.5 1 2 2 2z"/><path d="M4 20h1c2 0 2-1 2-2s-1-2-2-2H4s-2 1-2 2c0 1.5 1 2 2 2z"/></svg>`,
    Table: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-table"><path d="M12 2v20"/><path d="M18 2v20"/><path d="M6 2v20"/><path d="M2 12h20"/><path d="M2 18h20"/><path d="M2 6h20"/></svg>`,
    Image: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
    Video: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-video"><path d="M12 2a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="m22 7-6 5 6 5z"/></svg>`,
    FileText: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="10" x2="15" y1="13" y2="13"/><line x1="10" x2="15" y1="17" y2="17"/><line x1="10" x2="15" y1="12" y2="12"/><line x1="10" x2="15" y1="16" y2="16"/></svg>`,
    Heading1: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-1"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17.5 12h3"/><path d="M21 15V9"/><path d="M17.5 18V6"/></svg>`,
    Heading2: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-2"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17 18h4c0-2-2-3-3-3s-3.2 1-4 2c-1 1.4-1.5 4-4 4"/></svg>`,
    Heading3: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-3"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17 12a3 3 0 1 1 0 6h-3a3 3 0 1 1 0-6"/><path d="M14 6h6"/></svg>`,
    Heading4: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-4"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17 12a3 3 0 1 1 0 6h-3a3 3 0 1 1 0-6"/><path d="M14 6h6"/><path d="M20 9l-4 3"/></svg>`,
    Heading5: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-5"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17 18h4c0-2-2-3-3-3s-3.2 1-4 2c-1 1.4-1.5 4-4 4"/></svg>`,
    Heading6: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-6"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17 12a3 3 0 1 1 0 6h-3a3 3 0 1 1 0-6"/><path d="M14 6h6"/></svg>`,
    Eraser: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eraser"><path d="M12 20l9-9a2 2 0 0 0 0-2.828L14.828 3a2 2 0 0 0-2.828 0L3 11a2 2 0 0 0 0 2.828L12 22"/><path d="M22 13h-4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h4"/></svg>`,
    AlignLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-align-left"><line x1="2" x2="16" y1="6" y2="6"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="2" x2="18" y1="18" y2="18"/></svg>`,
    AlignCenter: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-align-center"><line x1="2" x2="22" y1="12" y2="12"/><line x1="7" x2="17" y1="6" y2="6"/><line x1="7" x2="17" y1="18" y2="18"/></svg>`,
    AlignRight: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-align-right"><line x1="8" x2="22" y1="6" y2="6"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="6" x2="22" y1="18" y2="18"/></svg>`,
    AlignJustify: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-align-justify"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>`,
    Palette: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-palette"><path d="M12 21.3c-2.4 0-4.8-0.9-6.6-2.6A9.4 9.4 0 0 1 3 13.8c0-2.4 0.9-4.8 2.6-6.6A9.4 9.4 0 0 1 12 3c2.4 0 4.8 0.9 6.6 2.6A9.4 9.4 0 0 1 21 13.8c0 2.4-0.9 4.8-2.6 6.6A9.4 9.4 0 0 1 12 21.3z"/><path d="M12 20.3a8.3 8.3 0 1 0 0-16.6A8.3 8.3 0 0 0 12 20.3z"/><circle cx="12" cy="12" r="3.5"/><path d="M12 12c-1.1 0-2-0.9-2-2v-4a2 2 0 0 1 4 0v4c0 1.1-0.9 2-2 2z"/></svg>`,
    Sun: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="5"/><line x1="12" x2="12" y1="1" y2="3"/><line x1="12" x2="12" y1="21" y2="23"/><line x1="4.22" x2="5.64" y1="4.22" y2="5.64"/><line x1="18.36" x2="19.78" y1="18.36" y2="19.78"/><line x1="1" x2="3" y1="12" y2="12"/><line x1="21" x2="23" y1="12" y2="12"/><line x1="4.22" x2="5.64" y1="19.78" y2="18.36"/><line x1="18.36" x2="19.78" y1="5.64" y2="4.22"/></svg>`,
    Plus: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>`,
    Type: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-type"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/></svg>`,
    CaseUpper: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-case-upper"><path d="m3 14 6-6 6 6"/><path d="M4.5 12h9"/><path d="M16 8h-2c-2.8 0-4 1.8-4 4s1.2 4 4 4h2s2 1.5 2 4c0 1.5-1.5 2.5-2.5 2.5a4 4 0 0 1-3.5-2"/></svg>`,
    Link: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07L11 6"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07L13 18"/></svg>`,
    AtSign: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-at-sign"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/></svg>`,
  };
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: icons[name] || "" }}
    />
  );
};

//===========================
// Enums & Interfaces
//===========================

export enum EnumStoryType {
  Tutorial = "Tutorial",
  Analogy = "Analogy",
  Mnemonic = "Mnemonic",
  Story = "Story",
}

export interface IAttribution {
  originalAuthor?: string;
  originalUrl?: string;
  licenseType?: string;
  details?: string;
}

export interface IEmbeddedStory {
  storyId: string;
  embedType: "mini" | "inline" | "full";
}

export interface IAuthor {
  id: string;
  name: string;
}

export interface ICodingStory {
  id: string;
  attribution?: IAttribution;
  author: IAuthor;
  category: string;
  comments: number;
  content: string;
  createdAt: string;
  embeddedStories?: IEmbeddedStory[];
  embedUrl?: string;
  excerpt: string;
  isEmbeddable: boolean;
  lastSaved?: string;
  likes: number;
  readTime: string;
  storyType: EnumStoryType;
  tags: string[];
  title: string;
  updatedAt?: string;
}

export enum Mark {
  Bold = "bold",
  Italic = "italic",
  Strikethrough = "strikethrough",
  Code = "code",
  Superscript = "superscript",
  Subscript = "subscript",
}

export enum Alignment {
  Left = "left",
  Center = "center",
  Right = "right",
  Justify = "justify",
}

export enum InlineStyle {
  FontSize = "fontSize",
  Color = "color",
  BackgroundColor = "backgroundColor",
  LetterSpacing = "letterSpacing",
  LineHeight = "lineHeight",
  TextTransform = "textTransform",
}

export enum ToolbarGroupId {
  Marks = "text_marks",
  Block = "block_types",
  InlineStyles = "inline_styles",
  Headings = "headings",
  Alignments = "alignments",
  Inserts = "inserts",
}

export type CustomText = {
  text: string;
  [Mark.Bold]?: boolean;
  [Mark.Italic]?: boolean;
  [Mark.Strikethrough]?: boolean;
  [Mark.Code]?: boolean;
  [Mark.Superscript]?: boolean;
  [Mark.Subscript]?: boolean;
  [InlineStyle.FontSize]?: string;
  [InlineStyle.Color]?: string;
  [InlineStyle.BackgroundColor]?: string;
  [InlineStyle.LetterSpacing]?: string;
  [InlineStyle.LineHeight]?: string;
  [InlineStyle.TextTransform]?: "uppercase" | "lowercase" | "capitalize";
};

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

export type ParagraphElement = {
  type: ComponentType.Paragraph;
  align?: Alignment;
  children: (CustomElement | CustomText)[];
};
export type TableElement = {
  type: ComponentType.Table;
  children: TableRowElement[];
};
export type TableRowElement = {
  type: ComponentType.TableRow;
  children: TableCellElement[];
};
export type TableCellElement = {
  type: ComponentType.TableCell;
  children: (CustomElement | CustomText)[];
};
export type ImageElement = {
  type: ComponentType.Image;
  url: string;
  children: CustomText[];
};
export type VideoElement = {
  type: ComponentType.Video;
  url: string;
  children: CustomText[];
};
export type EmbeddedStoryElement = {
  type: ComponentType.EmbeddedStory;
  storyId: IEmbeddedStory["storyId"];
  embedType: IEmbeddedStory["embedType"];
  children: CustomText[];
};
export type BulletedListElement = {
  type: ComponentType.BulletedList;
  children: ListItemElement[];
};
export type NumberedListElement = {
  type: ComponentType.NumberedList;
  children: ListItemElement[];
};
export type ListItemElement = {
  type: ComponentType.ListItem;
  children: CustomText[];
};
export type HeadingElement = {
  type: ComponentType.Heading;
  align?: Alignment;
  children: (CustomElement | CustomText)[];
};
export type HeadingOneElement = {
  type: ComponentType.HeadingOne;
  align?: Alignment;
  children: (CustomElement | CustomText)[];
};
export type HeadingTwoElement = {
  type: ComponentType.HeadingTwo;
  align?: Alignment;
  children: (CustomElement | CustomText)[];
};
export type HeadingThreeElement = {
  type: ComponentType.HeadingThree;
  align?: Alignment;
  children: (CustomElement | CustomText)[];
};
export type HeadingFourElement = {
  type: ComponentType.HeadingFour;
  align?: Alignment;
  children: (CustomElement | CustomText)[];
};
export type HeadingFiveElement = {
  type: ComponentType.HeadingFive;
  align?: Alignment;
  children: (CustomElement | CustomText)[];
};
export type HeadingSixElement = {
  type: ComponentType.HeadingSix;
  align?: Alignment;
  children: (CustomElement | CustomText)[];
};
export type BlockQuoteElement = {
  type: ComponentType.BlockQuote;
  children: CustomText[];
};
export type LinkElement = {
  type: ComponentType.Link;
  url: string;
  children: CustomText[];
};
export type MentionElement = {
  type: ComponentType.Mention;
  character: string;
  children: CustomText[];
};

export type CustomElementWithAlign =
  | ParagraphElement
  | HeadingElement
  | HeadingTwoElement
  | HeadingThreeElement
  | HeadingFourElement
  | HeadingFiveElement
  | HeadingSixElement
  | BlockQuoteElement
  | BulletedListElement;

export type CustomElement =
  | ParagraphElement
  | TableElement
  | TableRowElement
  | TableCellElement
  | ImageElement
  | VideoElement
  | EmbeddedStoryElement
  | BulletedListElement
  | NumberedListElement
  | ListItemElement
  | HeadingElement
  | HeadingOneElement
  | HeadingTwoElement
  | HeadingThreeElement
  | HeadingFourElement
  | HeadingFiveElement
  | HeadingSixElement
  | BlockQuoteElement
  | LinkElement
  | MentionElement;

export type CustomElementType = CustomElement["type"];

// Slate Editor Type
export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

//===========================
// Utility & Handler Functions
//===========================

const LIST_TYPES = [
  ComponentType.NumberedList,
  ComponentType.BulletedList,
] as const;
const TEXT_ALIGN_TYPES = Object.values(Alignment);

type AlignType = (typeof TEXT_ALIGN_TYPES)[number];
type ListType = (typeof LIST_TYPES)[number];
type CustomElementFormat = CustomElementType | AlignType | ListType;

export function ensureLastParagraph(editor: CustomEditor) {
  const lastNode = editor.children[editor.children.length - 1];
  if (
    !Element.isElement(lastNode) ||
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

const toggleMark = (editor: CustomEditor, id: string) => {
  const isActive = isMarkActive(editor, id);
  if (isActive) {
    Editor.removeMark(editor, id);
  } else {
    Editor.addMark(editor, id, true);
  }
};

export function isMarkActive(editor: CustomEditor, id: string): boolean {
  const marks = Editor.marks(editor);
  return marks ? marks[id as keyof typeof marks] === true : false;
}

const isAlignType = (format: CustomElementFormat): format is AlignType => {
  return TEXT_ALIGN_TYPES.includes(format as AlignType);
};

const isListType = (format: CustomElementFormat): format is ListType => {
  return LIST_TYPES.includes(format as ListType);
};

const toggleBlock = (editor: CustomEditor, format: CustomElementFormat) => {
  const isActive = isBlockActive(
    editor,
    format,
    isAlignType(format) ? "align" : "type"
  );
  const isList = isListType(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      isListType(n.type as any) &&
      !isAlignType(format),
    split: true,
  });
  let newProperties: Partial<Element>;
  if (isAlignType(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive
        ? ComponentType.Paragraph
        : isList
        ? ComponentType.ListItem
        : format,
    };
  }
  Transforms.setNodes<Element>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block as Element);
  }
};

const isBlockActive = (
  editor: CustomEditor,
  id: string,
  blockType: "type" | "align" = "type"
) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        Element.isElement(n) &&
        (n as any)[blockType] === id,
    })
  );

  return !!match;
};

//===========================
// Popups & Commands
//===========================

const Modal = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) => (
  <div
    onMouseDown={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
  >
    <div
      onMouseDown={(e) => e.stopPropagation()}
      className="relative w-full max-w-sm p-6 bg-white rounded-xl shadow-lg"
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        &times;
      </button>
      {children}
    </div>
  </div>
);

const InsertImageModal: React.FC<{
  editor: CustomEditor;
  onClose: () => void;
}> = ({ editor, onClose }) => {
  const [url, setUrl] = useState("");
  const insert = useCallback(() => {
    if (url) {
      Transforms.insertNodes(editor, {
        type: ComponentType.Image,
        url,
        children: [{ text: "" }],
      } as ImageElement);
      onClose();
    }
  }, [editor, onClose, url]);

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Insert Image</h3>
      <input
        type="text"
        placeholder="Enter image URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full p-2 border rounded-lg mb-4"
      />
      <div className="flex gap-2 justify-end">
        <button
          onMouseDown={(e) => e.preventDefault()}
          className="px-4 py-2 text-gray-500 rounded-lg hover:bg-gray-100"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={insert}
        >
          Insert
        </button>
      </div>
    </div>
  );
};

const InsertVideoModal: React.FC<{
  editor: CustomEditor;
  onClose: () => void;
}> = ({ editor, onClose }) => {
  const [url, setUrl] = useState("");
  const insert = useCallback(() => {
    if (url) {
      Transforms.insertNodes(editor, {
        type: ComponentType.Video,
        url,
        children: [{ text: "" }],
      } as VideoElement);
      onClose();
    }
  }, [editor, onClose, url]);

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Insert Video</h3>
      <input
        type="text"
        placeholder="Enter video URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full p-2 border rounded-lg mb-4"
      />
      <div className="flex gap-2 justify-end">
        <button
          onMouseDown={(e) => e.preventDefault()}
          className="px-4 py-2 text-gray-500 rounded-lg hover:bg-gray-100"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={insert}
        >
          Insert
        </button>
      </div>
    </div>
  );
};

const InsertStoryModal: React.FC<{
  editor: CustomEditor;
  onClose: () => void;
}> = ({ editor, onClose }) => {
  const [storyId, setStoryId] = useState(uuidv4());
  const [embedType, setEmbedType] =
    useState<IEmbeddedStory["embedType"]>("mini");
  const insert = useCallback(() => {
    Transforms.insertNodes(editor, {
      type: ComponentType.EmbeddedStory,
      storyId,
      embedType,
      children: [{ text: "" }],
    } as EmbeddedStoryElement);
    onClose();
  }, [editor, onClose, storyId, embedType]);

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Insert Story</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Story ID
        </label>
        <input
          type="text"
          value={storyId}
          onChange={(e) => setStoryId(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Embed Type
        </label>
        <select
          value={embedType}
          onChange={(e) =>
            setEmbedType(e.target.value as IEmbeddedStory["embedType"])
          }
          className="w-full p-2 border rounded-lg"
        >
          <option value="mini">Mini</option>
          <option value="inline">Inline</option>
          <option value="full">Full</option>
        </select>
      </div>
      <div className="flex gap-2 justify-end">
        <button
          onMouseDown={(e) => e.preventDefault()}
          className="px-4 py-2 text-gray-500 rounded-lg hover:bg-gray-100"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={insert}
        >
          Insert
        </button>
      </div>
    </div>
  );
};

const InsertLinkModal: React.FC<{
  editor: CustomEditor;
  onClose: () => void;
}> = ({ editor, onClose }) => {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const insert = useCallback(() => {
    if (url && text) {
      Transforms.insertNodes(editor, {
        type: ComponentType.Link,
        url,
        children: [{ text }],
      } as LinkElement);
      onClose();
    }
  }, [editor, onClose, url, text]);

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Insert Link</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Link Text
        </label>
        <input
          type="text"
          placeholder="Enter link text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">URL</label>
        <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <button
          onMouseDown={(e) => e.preventDefault()}
          className="px-4 py-2 text-gray-500 rounded-lg hover:bg-gray-100"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={insert}
        >
          Insert
        </button>
      </div>
    </div>
  );
};

const InsertMentionModal: React.FC<{
  editor: CustomEditor;
  onClose: () => void;
}> = ({ editor, onClose }) => {
  const [character, setCharacter] = useState("");
  const insert = useCallback(() => {
    if (character) {
      Transforms.insertNodes(editor, {
        type: ComponentType.Mention,
        character,
        children: [{ text: "" }],
      } as MentionElement);
      onClose();
    }
  }, [editor, onClose, character]);

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Insert Mention</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          placeholder="Enter username"
          value={character}
          onChange={(e) => setCharacter(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <button
          onMouseDown={(e) => e.preventDefault()}
          className="px-4 py-2 text-gray-500 rounded-lg hover:bg-gray-100"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={insert}
        >
          Insert
        </button>
      </div>
    </div>
  );
};

const InlineStyleModal: FunctionComponent<{
  editor: CustomEditor;
  onClose: () => void;
  styleType?: InlineStyle;
}> = ({ editor, onClose, styleType }) => {
  const [value, setValue] = useState("");
  const insert = useCallback(() => {
    if (value && styleType) {
      Editor.addMark(editor, styleType, value);
      onClose();
    }
  }, [editor, onClose, styleType, value]);

  const getPlaceholder = () => {
    switch (styleType) {
      case InlineStyle.FontSize:
        return "e.g., 16px, 1.2em";
      case InlineStyle.Color:
        return "e.g., #ff0000, red";
      case InlineStyle.BackgroundColor:
        return "e.g., #ffff00, yellow";
      case InlineStyle.LetterSpacing:
        return "e.g., 0.1em, 2px";
      case InlineStyle.LineHeight:
        return "e.g., 1.5, 20px";
      case InlineStyle.TextTransform:
        return "uppercase, lowercase, capitalize";
      default:
        return "";
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Set {styleType}</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Value</label>
        {styleType === InlineStyle.Color ||
        styleType === InlineStyle.BackgroundColor ? (
          <input
            type="color"
            value={value || "#000000"}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-2 border rounded-lg h-12"
          />
        ) : (
          <input
            type="text"
            placeholder={getPlaceholder()}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        )}
      </div>
      <div className="flex gap-2 justify-end">
        <button
          onMouseDown={(e) => e.preventDefault()}
          className="px-4 py-2 text-gray-500 rounded-lg hover:bg-gray-100"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={insert}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

//===========================
// Extensible Plugin System
//===========================

export interface IToolbarGroup {
  group: ToolbarGroupId | string;
  label: string;
}

export interface ITool {
  id: string;
  ToolBarButton: React.ReactNode;
  category: "mark" | "block" | "align" | "insert" | "modal";
  group: ToolbarGroupId | string;
  renderComponent?: React.FC<any>;
  onClick?: (editor: CustomEditor, data?: any) => void;
  Plugin?: FunctionComponent<{
    editor: CustomEditor;
    onClose: () => void;
    styleType?: InlineStyle;
  }>;
}

const withCustomPlugins = (editor: CustomEditor): CustomEditor => {
  const { normalizeNode } = editor;
  editor.normalizeNode = (entry) => {
    if (entry[1].length === 0) {
      const lastNode = editor.children[editor.children.length - 1];
      if (
        !lastNode ||
        !Element.isElement(lastNode) ||
        lastNode.type !== ComponentType.Paragraph
      ) {
        const paragraph: ParagraphElement = {
          type: ComponentType.Paragraph,
          children: [{ text: "" }],
        };
        Transforms.insertNodes(editor, paragraph, {
          at: [editor.children.length],
        });
        return;
      }
    }
    normalizeNode(entry);
  };
  return editor;
};

//===========================
// Renderers
//===========================
const ParagraphElementRenderer = ({ attributes, children, element }: any) => {
  const style = { textAlign: element.align };
  return (
    <p style={style} className="my-1" {...attributes}>
      {children}
    </p>
  );
};

const TableElementRenderer = ({ attributes, children }: any) => (
  <table className="w-full border-collapse my-4" {...attributes}>
    <tbody>{children}</tbody>
  </table>
);
const TableRowElementRenderer = ({ attributes, children }: any) => (
  <tr className="border-b border-gray-200 last:border-0" {...attributes}>
    {children}
  </tr>
);
const TableCellElementRenderer = ({ attributes, children }: any) => (
  <td className="border p-2" {...attributes}>
    {children}
  </td>
);
const BulletedListElementRenderer = ({
  attributes,
  children,
  element,
}: any) => {
  const style = { textAlign: element.align };
  return (
    <ul
      style={style}
      className="list-disc list-inside ml-4 my-2"
      {...attributes}
    >
      {children}
    </ul>
  );
};
const NumberedListElementRenderer = ({
  attributes,
  children,
  element,
}: any) => {
  const style = { textAlign: element.align };
  return (
    <ol
      style={style}
      className="list-decimal list-inside ml-4 my-2"
      {...attributes}
    >
      {children}
    </ol>
  );
};
const ListItemElementRenderer = ({ attributes, children, element }: any) => {
  const style = { textAlign: element.align };
  return (
    <li style={style} className="my-1" {...attributes}>
      {children}
    </li>
  );
};
const HeadingOneElementRenderer = ({ attributes, children, element }: any) => {
  const style = { textAlign: element.align };
  return (
    <h1 style={style} className="text-4xl font-extrabold my-4" {...attributes}>
      {children}
    </h1>
  );
};
const HeadingTwoElementRenderer = ({ attributes, children, element }: any) => {
  const style = { textAlign: element.align };
  return (
    <h2 style={style} className="text-3xl font-bold my-3" {...attributes}>
      {children}
    </h2>
  );
};
const HeadingThreeElementRenderer = ({
  attributes,
  children,
  element,
}: any) => {
  const style = { textAlign: element.align };
  return (
    <h3 style={style} className="text-2xl font-semibold my-2" {...attributes}>
      {children}
    </h3>
  );
};
const HeadingFourElementRenderer = ({ attributes, children, element }: any) => {
  const style = { textAlign: element.align };
  return (
    <h4 style={style} className="text-xl font-medium my-2" {...attributes}>
      {children}
    </h4>
  );
};
const HeadingFiveElementRenderer = ({ attributes, children, element }: any) => {
  const style = { textAlign: element.align };
  return (
    <h5 style={style} className="text-lg font-medium my-2" {...attributes}>
      {children}
    </h5>
  );
};
const HeadingSixElementRenderer = ({ attributes, children, element }: any) => {
  const style = { textAlign: element.align };
  return (
    <h6 style={style} className="text-base font-medium my-2" {...attributes}>
      {children}
    </h6>
  );
};
const BlockQuoteElementRenderer = ({ attributes, children }: any) => (
  <blockquote
    className="border-l-4 border-gray-400 pl-4 py-2 italic text-gray-600 my-2"
    {...attributes}
  >
    {children}
  </blockquote>
);
const CodeBlockElementRenderer = ({ attributes, children }: any) => (
  <pre className="bg-gray-800 text-white p-4 my-2 rounded-lg overflow-x-auto">
    <code {...attributes}>{children}</code>
  </pre>
);
const ImageElementRenderer = ({
  attributes,
  children,
  element,
}: {
  attributes: any;
  children: React.ReactNode;
  element: ImageElement;
}) => (
  <div {...attributes} className="my-4">
    <div contentEditable={false} className="relative block group">
      <img
        src={element.url}
        alt=""
        className="block max-w-full rounded-lg shadow-lg"
      />
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
        <span className="text-white text-sm">Image Source: {element.url}</span>
      </div>
    </div>
    {children}
  </div>
);
const VideoElementRenderer = ({
  attributes,
  children,
  element,
}: {
  attributes: any;
  children: React.ReactNode;
  element: VideoElement;
}) => (
  <div {...attributes} className="my-4">
    <div contentEditable={false} className="relative block group aspect-video">
      <video
        src={element.url}
        controls
        className="block w-full h-full rounded-lg shadow-lg"
      />
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
        <span className="text-white text-sm">Video Source: {element.url}</span>
      </div>
    </div>
    {children}
  </div>
);
const EmbeddedStoryElementRenderer = ({
  attributes,
  children,
  element,
}: {
  attributes: any;
  children: React.ReactNode;
  element: EmbeddedStoryElement;
}) => (
  <div
    {...attributes}
    contentEditable={false}
    className="my-4 p-4 border border-blue-400 border-dashed rounded-lg bg-blue-50/50"
  >
    <div className="flex items-center gap-2 text-blue-800">
      <Icon name="FileText" className="h-4 w-4" />
      <span className="font-semibold">Embedded Story</span>
    </div>
    <div className="mt-2 text-sm text-gray-600">
      <p>
        Story ID:{" "}
        <span className="font-mono bg-gray-100 p-1 rounded text-xs">
          {element.storyId}
        </span>
      </p>
      <p>
        Embed Type:{" "}
        <span className="font-mono bg-gray-100 p-1 rounded text-xs">
          {element.embedType}
        </span>
      </p>
    </div>
    {children}
  </div>
);
const LinkElementRenderer = ({
  attributes,
  children,
  element,
}: {
  attributes: any;
  children: React.ReactNode;
  element: LinkElement;
}) => (
  <a
    {...attributes}
    href={element.url}
    className="text-blue-500 hover:underline"
  >
    {children}
  </a>
);
const MentionElementRenderer = ({
  attributes,
  children,
  element,
}: {
  attributes: any;
  children: React.ReactNode;
  element: MentionElement;
}) => (
  <span
    {...attributes}
    contentEditable={false}
    className="bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 text-sm font-semibold"
  >
    @{element.character}
    {children}
  </span>
);
const LeafRenderer = ({
  attributes,
  children,
  leaf,
}: {
  attributes: any;
  children: React.ReactNode;
  leaf: CustomText;
}) => {
  if (leaf[Mark.Bold]) {
    children = <strong className="font-bold">{children}</strong>;
  }
  if (leaf[Mark.Italic]) {
    children = <em className="italic">{children}</em>;
  }
  if (leaf[Mark.Strikethrough]) {
    children = <span className="line-through">{children}</span>;
  }
  if (leaf[Mark.Code]) {
    children = (
      <code className="font-mono bg-gray-200 px-1 py-0.5 rounded text-sm">
        {children}
      </code>
    );
  }
  if (leaf[Mark.Superscript]) {
    children = <sup>{children}</sup>;
  }
  if (leaf[Mark.Subscript]) {
    children = <sub>{children}</sub>;
  }
  const style: React.CSSProperties = {
    fontSize: leaf[InlineStyle.FontSize],
    color: leaf[InlineStyle.Color],
    backgroundColor: leaf[InlineStyle.BackgroundColor],
    letterSpacing: leaf[InlineStyle.LetterSpacing],
    lineHeight: leaf[InlineStyle.LineHeight],
    textTransform: leaf[InlineStyle.TextTransform],
  };
  return (
    <span {...attributes} style={style}>
      {children}
    </span>
  );
};

//===========================
// Button Components
//===========================

const MarkButton = ({
  editor,
  id,
  ToolBarButton,
  className = "",
}: {
  editor: CustomEditor;
  id: string;
  ToolBarButton: React.ReactNode;
  className?: string;
}) => {
  return (
    <button
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, id);
      }}
      className={`p-2 rounded-lg transition-colors ${
        isMarkActive(editor, id) ? "bg-gray-200" : "hover:bg-gray-100"
      } ${className}`}
    >
      {ToolBarButton}
    </button>
  );
};

const BlockButton = ({
  editor,
  id,
  ToolBarButton,
  className = "",
}: {
  editor: CustomEditor;
  id: string;
  ToolBarButton: React.ReactNode;
  className?: string;
}) => {
  const isActive = isBlockActive(editor, id, "type");
  return (
    <button
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, id);
      }}
      className={`p-2 rounded-lg transition-colors ${
        isActive ? "bg-gray-200" : "hover:bg-gray-100"
      } ${className}`}
    >
      {ToolBarButton}
    </button>
  );
};

const AlignButton = ({
  editor,
  id,
  ToolBarButton,
  className = "",
}: {
  editor: CustomEditor;
  id: string;
  ToolBarButton: React.ReactNode;
  className?: string;
}) => {
  const isActive = isBlockActive(editor, id, "align");
  return (
    <button
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, id);
      }}
      className={`p-2 rounded-lg transition-colors ${
        isActive ? "bg-gray-200" : "hover:bg-gray-100"
      } ${className}`}
    >
      {ToolBarButton}
    </button>
  );
};

const Toolbar = ({
  editor,
  onToolClick,
  tools,
  groups,
  isInline = false,
}: {
  editor: CustomEditor;
  onToolClick: (command: string) => void;
  tools: ITool[];
  groups: IToolbarGroup[];
  isInline?: boolean;
}) => {
  const toolsByGroup = useMemo(() => {
    const map = new Map<string, ITool[]>();
    tools.forEach((tool) => {
      if (!map.has(tool.group)) {
        map.set(tool.group, []);
      }
      map.get(tool.group)?.push(tool);
    });
    return map;
  }, [tools]);

  const renderTool = useCallback(
    (tool: ITool) => {
      switch (tool.category) {
        case "mark":
          return (
            <MarkButton
              key={tool.id}
              editor={editor}
              id={tool.id}
              ToolBarButton={tool.ToolBarButton}
            />
          );
        case "block":
          return (
            <BlockButton
              key={tool.id}
              editor={editor}
              id={tool.id}
              ToolBarButton={tool.ToolBarButton}
            />
          );
        case "align":
          return (
            <AlignButton
              key={tool.id}
              editor={editor}
              id={tool.id}
              ToolBarButton={tool.ToolBarButton}
            />
          );
        case "insert":
        case "modal":
          return (
            <button
              key={tool.id}
              onMouseDown={(event) => {
                event.preventDefault();
                onToolClick(tool.id);
              }}
              className="p-2 rounded-lg transition-colors hover:bg-gray-100"
            >
              {tool.ToolBarButton}
            </button>
          );
        default:
          return null;
      }
    },
    [onToolClick, editor]
  );

  return (
    <div
      className={`flex flex-wrap items-center gap-1 p-2 rounded-lg shadow-sm border border-gray-200 transition-all ${
        isInline ? "" : "mb-4"
      }`}
    >
      {groups.map((group) => {
        const groupTools = toolsByGroup.get(group.group);
        if (!groupTools || groupTools.length === 0) return null;
        return (
          <React.Fragment key={group.group}>
            <div className="flex items-center gap-1 p-1">
              {groupTools.map((tool) => renderTool(tool))}
            </div>
            <span className="w-px h-6 bg-gray-300 mx-1 last:hidden"></span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

const HoveringToolbar = ({
  editor,
  onToolClick,
  tools,
  groups,
}: {
  editor: CustomEditor;
  onToolClick: (command: string) => void;
  tools: ITool[];
  groups: IToolbarGroup[];
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inFocus = useFocused();
  const isSelected = useSelected();

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    const { selection } = editor;
    if (
      !selection ||
      !inFocus ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ""
    ) {
      el.removeAttribute("style");
      return;
    }

    const domRange = ReactEditor.toDOMRange(editor, selection);
    const rect = domRange.getBoundingClientRect();
    el.style.opacity = "1";
    el.style.top = `${rect.top + window.scrollY - el.offsetHeight - 8}px`;
    el.style.left = `${
      rect.left + window.scrollX - el.offsetWidth / 2 + rect.width / 2
    }px`;
  }, [editor, inFocus, isSelected]);

  return (
    <div
      ref={ref}
      className="absolute z-10 opacity-0 bg-white p-1 rounded-lg shadow-xl -mt-2 transition-opacity duration-150 transform -translate-x-1/2 left-1/2"
      onMouseDown={(e) => e.preventDefault()}
    >
      <Toolbar
        editor={editor}
        onToolClick={onToolClick}
        tools={tools}
        groups={groups}
        isInline={true}
      />
    </div>
  );
};

const CommandPalette = ({
  editor,
  command,
  onClose,
  tools,
}: {
  editor: CustomEditor;
  command: string | null;
  onClose: () => void;
  tools: ITool[];
}) => {
  const tool = useMemo(
    () => tools.find((t) => t.id === command),
    [command, tools]
  );

  if (!tool || !tool.Plugin) return null;

  const Plugin = tool.Plugin;
  const styleType = Object.values(InlineStyle).includes(tool.id as InlineStyle)
    ? (tool.id as InlineStyle)
    : undefined;

  return (
    <Modal onClose={onClose}>
      <Plugin editor={editor} onClose={onClose} styleType={styleType} />
    </Modal>
  );
};

const withCustomPlugins = (editor: CustomEditor): CustomEditor => {
  const { normalizeNode } = editor;
  editor.normalizeNode = (entry) => {
    if (entry[1].length === 0) {
      const lastNode = editor.children[editor.children.length - 1];
      if (
        !lastNode ||
        !Element.isElement(lastNode) ||
        lastNode.type !== ComponentType.Paragraph
      ) {
        const paragraph: ParagraphElement = {
          type: ComponentType.Paragraph,
          children: [{ text: "" }],
        };
        Transforms.insertNodes(editor, paragraph, {
          at: [editor.children.length],
        });
        return;
      }
    }
    normalizeNode(entry);
  };
  return editor;
};

//===========================
// Renderers
//===========================
const ParagraphElementRenderer = ({ attributes, children, element }: any) => {
  const style = { textAlign: element.align };
  return (
    <p style={style} className="my-1" {...attributes}>
      {children}
    </p>
  );
};

const TableElementRenderer = ({ attributes, children }: any) => (
  <table className="w-full border-collapse my-4" {...attributes}>
    <tbody>{children}</tbody>
  </table>
);
const TableRowElementRenderer = ({ attributes, children }: any) => (
  <tr className="border-b border-gray-200 last:border-0" {...attributes}>
    {children}
  </tr>
);
const TableCellElementRenderer = ({ attributes, children }: any) => (
  <td className="border p-2" {...attributes}>
    {children}
  </td>
);
const BulletedListElementRenderer = ({
  attributes,
  children,
  element,
}: any) => {
  const style = { textAlign: element.align };
  return (
    <ul
      style={style}
      className="list-disc list-inside ml-4 my-2"
      {...attributes}
    >
      {children}
    </ul>
  );
};
const NumberedListElementRenderer = ({
  attributes,
  children,
  element,
}: any) => {
  const style = { textAlign: element.align };
  return (
    <ol
      style={style}
      className="list-decimal list-inside ml-4 my-2"
      {...attributes}
    >
      {children}
    </ol>
  );
};
const ListItemElementRenderer = ({ attributes, children, element }: any) => {
  const style = { textAlign: element.align };
  return (
    <li style={style} className="my-1" {...attributes}>
      {children}
    </li>
  );
};
const HeadingOneElementRenderer = ({ attributes, children, element }: any) => {
  const style = { textAlign: element.align };
  return (
    <h1 style={style} className="text-4xl font-extrabold my-4" {...attributes}>
      {children}
    </h1>
  );
};
const HeadingTwoElementRenderer = ({ attributes, children, element }: any) => {
  const style = { textAlign: element.align };
  return (
    <h2 style={style} className="text-3xl font-bold my-3" {...attributes}>
      {children}
    </h2>
  );
};
const HeadingThreeElementRenderer = ({
  attributes,
  children,
  element,
}: any) => {
  const style = { textAlign: element.align };
  return (
    <h3 style={style} className="text-2xl font-semibold my-2" {...attributes}>
      {children}
    </h3>
  );
};
const HeadingFourElementRenderer = ({ attributes, children, element }: any) => {
  const style = { textAlign: element.align };
  return (
    <h4 style={style} className="text-xl font-medium my-2" {...attributes}>
      {children}
    </h4>
  );
};
const HeadingFiveElementRenderer = ({ attributes, children, element }: any) => {
  const style = { textAlign: element.align };
  return (
    <h5 style={style} className="text-lg font-medium my-2" {...attributes}>
      {children}
    </h5>
  );
};
const HeadingSixElementRenderer = ({ attributes, children, element }: any) => {
  const style = { textAlign: element.align };
  return (
    <h6 style={style} className="text-base font-medium my-2" {...attributes}>
      {children}
    </h6>
  );
};
const BlockQuoteElementRenderer = ({ attributes, children }: any) => (
  <blockquote
    className="border-l-4 border-gray-400 pl-4 py-2 italic text-gray-600 my-2"
    {...attributes}
  >
    {children}
  </blockquote>
);
const CodeBlockElementRenderer = ({ attributes, children }: any) => (
  <pre className="bg-gray-800 text-white p-4 my-2 rounded-lg overflow-x-auto">
    <code {...attributes}>{children}</code>
  </pre>
);
const ImageElementRenderer = ({
  attributes,
  children,
  element,
}: {
  attributes: any;
  children: React.ReactNode;
  element: ImageElement;
}) => (
  <div {...attributes} className="my-4">
    <div contentEditable={false} className="relative block group">
      <img
        src={element.url}
        alt=""
        className="block max-w-full rounded-lg shadow-lg"
      />
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
        <span className="text-white text-sm">Image Source: {element.url}</span>
      </div>
    </div>
    {children}
  </div>
);
const VideoElementRenderer = ({
  attributes,
  children,
  element,
}: {
  attributes: any;
  children: React.ReactNode;
  element: VideoElement;
}) => (
  <div {...attributes} className="my-4">
    <div contentEditable={false} className="relative block group aspect-video">
      <video
        src={element.url}
        controls
        className="block w-full h-full rounded-lg shadow-lg"
      />
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
        <span className="text-white text-sm">Video Source: {element.url}</span>
      </div>
    </div>
    {children}
  </div>
);
const EmbeddedStoryElementRenderer = ({
  attributes,
  children,
  element,
}: {
  attributes: any;
  children: React.ReactNode;
  element: EmbeddedStoryElement;
}) => (
  <div
    {...attributes}
    contentEditable={false}
    className="my-4 p-4 border border-blue-400 border-dashed rounded-lg bg-blue-50/50"
  >
    <div className="flex items-center gap-2 text-blue-800">
      <Icon name="FileText" className="h-4 w-4" />
      <span className="font-semibold">Embedded Story</span>
    </div>
    <div className="mt-2 text-sm text-gray-600">
      <p>
        Story ID:{" "}
        <span className="font-mono bg-gray-100 p-1 rounded text-xs">
          {element.storyId}
        </span>
      </p>
      <p>
        Embed Type:{" "}
        <span className="font-mono bg-gray-100 p-1 rounded text-xs">
          {element.embedType}
        </span>
      </p>
    </div>
    {children}
  </div>
);
const LinkElementRenderer = ({
  attributes,
  children,
  element,
}: {
  attributes: any;
  children: React.ReactNode;
  element: LinkElement;
}) => (
  <a
    {...attributes}
    href={element.url}
    className="text-blue-500 hover:underline"
  >
    {children}
  </a>
);
const MentionElementRenderer = ({
  attributes,
  children,
  element,
}: {
  attributes: any;
  children: React.ReactNode;
  element: MentionElement;
}) => (
  <span
    {...attributes}
    contentEditable={false}
    className="bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 text-sm font-semibold"
  >
    @{element.character}
    {children}
  </span>
);
const LeafRenderer = ({
  attributes,
  children,
  leaf,
}: {
  attributes: any;
  children: React.ReactNode;
  leaf: CustomText;
}) => {
  if (leaf[Mark.Bold]) {
    children = <strong className="font-bold">{children}</strong>;
  }
  if (leaf[Mark.Italic]) {
    children = <em className="italic">{children}</em>;
  }
  if (leaf[Mark.Strikethrough]) {
    children = <span className="line-through">{children}</span>;
  }
  if (leaf[Mark.Code]) {
    children = (
      <code className="font-mono bg-gray-200 px-1 py-0.5 rounded text-sm">
        {children}
      </code>
    );
  }
  if (leaf[Mark.Superscript]) {
    children = <sup>{children}</sup>;
  }
  if (leaf[Mark.Subscript]) {
    children = <sub>{children}</sub>;
  }
  const style: React.CSSProperties = {
    fontSize: leaf[InlineStyle.FontSize],
    color: leaf[InlineStyle.Color],
    backgroundColor: leaf[InlineStyle.BackgroundColor],
    letterSpacing: leaf[InlineStyle.LetterSpacing],
    lineHeight: leaf[InlineStyle.LineHeight],
    textTransform: leaf[InlineStyle.TextTransform],
  };
  return (
    <span {...attributes} style={style}>
      {children}
    </span>
  );
};

//===========================
// Button Components
//===========================

const MarkButton = ({
  editor,
  id,
  ToolBarButton,
  className = "",
}: {
  editor: CustomEditor;
  id: string;
  ToolBarButton: React.ReactNode;
  className?: string;
}) => {
  return (
    <button
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, id);
      }}
      className={`p-2 rounded-lg transition-colors ${
        isMarkActive(editor, id) ? "bg-gray-200" : "hover:bg-gray-100"
      } ${className}`}
    >
      {ToolBarButton}
    </button>
  );
};

const BlockButton = ({
  editor,
  id,
  ToolBarButton,
  className = "",
}: {
  editor: CustomEditor;
  id: string;
  ToolBarButton: React.ReactNode;
  className?: string;
}) => {
  const isActive = isBlockActive(editor, id, "type");
  return (
    <button
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, id);
      }}
      className={`p-2 rounded-lg transition-colors ${
        isActive ? "bg-gray-200" : "hover:bg-gray-100"
      } ${className}`}
    >
      {ToolBarButton}
    </button>
  );
};

const AlignButton = ({
  editor,
  id,
  ToolBarButton,
  className = "",
}: {
  editor: CustomEditor;
  id: string;
  ToolBarButton: React.ReactNode;
  className?: string;
}) => {
  const isActive = isBlockActive(editor, id, "align");
  return (
    <button
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, id);
      }}
      className={`p-2 rounded-lg transition-colors ${
        isActive ? "bg-gray-200" : "hover:bg-gray-100"
      } ${className}`}
    >
      {ToolBarButton}
    </button>
  );
};

const Toolbar = ({
  editor,
  onToolClick,
  tools,
  groups,
  isInline = false,
}: {
  editor: CustomEditor;
  onToolClick: (command: string) => void;
  tools: ITool[];
  groups: IToolbarGroup[];
  isInline?: boolean;
}) => {
  const toolsByGroup = useMemo(() => {
    const map = new Map<string, ITool[]>();
    tools.forEach((tool) => {
      if (!map.has(tool.group)) {
        map.set(tool.group, []);
      }
      map.get(tool.group)?.push(tool);
    });
    return map;
  }, [tools]);

  const renderTool = useCallback(
    (tool: ITool) => {
      switch (tool.category) {
        case "mark":
          return (
            <MarkButton
              key={tool.id}
              editor={editor}
              id={tool.id}
              ToolBarButton={tool.ToolBarButton}
            />
          );
        case "block":
          return (
            <BlockButton
              key={tool.id}
              editor={editor}
              id={tool.id}
              ToolBarButton={tool.ToolBarButton}
            />
          );
        case "align":
          return (
            <AlignButton
              key={tool.id}
              editor={editor}
              id={tool.id}
              ToolBarButton={tool.ToolBarButton}
            />
          );
        case "insert":
        case "modal":
          return (
            <button
              key={tool.id}
              onMouseDown={(event) => {
                event.preventDefault();
                onToolClick(tool.id);
              }}
              className="p-2 rounded-lg transition-colors hover:bg-gray-100"
            >
              {tool.ToolBarButton}
            </button>
          );
        default:
          return null;
      }
    },
    [onToolClick, editor]
  );

  return (
    <div
      className={`flex flex-wrap items-center gap-1 p-2 rounded-lg shadow-sm border border-gray-200 transition-all ${
        isInline ? "" : "mb-4"
      }`}
    >
      {groups.map((group) => {
        const groupTools = toolsByGroup.get(group.group);
        if (!groupTools || groupTools.length === 0) return null;
        return (
          <React.Fragment key={group.group}>
            <div className="flex items-center gap-1 p-1">
              {groupTools.map((tool) => renderTool(tool))}
            </div>
            <span className="w-px h-6 bg-gray-300 mx-1 last:hidden"></span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

const HoveringToolbar = ({
  editor,
  onToolClick,
  tools,
  groups,
}: {
  editor: CustomEditor;
  onToolClick: (command: string) => void;
  tools: ITool[];
  groups: IToolbarGroup[];
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inFocus = useFocused();
  const isSelected = useSelected();

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    const { selection } = editor;
    if (
      !selection ||
      !inFocus ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ""
    ) {
      el.removeAttribute("style");
      return;
    }

    const domRange = ReactEditor.toDOMRange(editor, selection);
    const rect = domRange.getBoundingClientRect();
    el.style.opacity = "1";
    el.style.top = `${rect.top + window.scrollY - el.offsetHeight - 8}px`;
    el.style.left = `${
      rect.left + window.scrollX - el.offsetWidth / 2 + rect.width / 2
    }px`;
  }, [editor, inFocus, isSelected]);

  return (
    <div
      ref={ref}
      className="absolute z-10 opacity-0 bg-white p-1 rounded-lg shadow-xl -mt-2 transition-opacity duration-150 transform -translate-x-1/2 left-1/2"
      onMouseDown={(e) => e.preventDefault()}
    >
      <Toolbar
        editor={editor}
        onToolClick={onToolClick}
        tools={tools}
        groups={groups}
        isInline={true}
      />
    </div>
  );
};

const CommandPalette = ({
  editor,
  command,
  onClose,
  tools,
}: {
  editor: CustomEditor;
  command: string | null;
  onClose: () => void;
  tools: ITool[];
}) => {
  const tool = useMemo(
    () => tools.find((t) => t.id === command),
    [command, tools]
  );

  if (!tool || !tool.Plugin) return null;

  const Plugin = tool.Plugin;
  const styleType = Object.values(InlineStyle).includes(tool.id as InlineStyle)
    ? (tool.id as InlineStyle)
    : undefined;

  return (
    <Modal onClose={onClose}>
      <Plugin editor={editor} onClose={onClose} styleType={styleType} />
    </Modal>
  );
};

const withCustomPlugins = (editor: CustomEditor): CustomEditor => {
  const { normalizeNode } = editor;
  editor.normalizeNode = (entry) => {
    if (entry[1].length === 0) {
      const lastNode = editor.children[editor.children.length - 1];
      if (
        !lastNode ||
        !Element.isElement(lastNode) ||
        lastNode.type !== ComponentType.Paragraph
      ) {
        const paragraph: ParagraphElement = {
          type: ComponentType.Paragraph,
          children: [{ text: "" }],
        };
        Transforms.insertNodes(editor, paragraph, {
          at: [editor.children.length],
        });
        return;
      }
    }
    normalizeNode(entry);
  };
  return editor;
};

//===========================
// Core Editor Component
//===========================
const initialValue: CustomElement[] = [
  {
    type: ComponentType.Paragraph,
    children: [{ text: "Start typing or use the toolbar..." }],
  },
];
interface AdvancedRichTextEditorProps {
  value: Descendant[];
  onChange: (value: Descendant[]) => void;
  placeholder?: string;
  className?: string;
  height?: number | string;
  onSave?: () => void;
  tools: ITool[];
  groups: IToolbarGroup[];
}

export const AdvancedRichTextEditor: React.FC<AdvancedRichTextEditorProps> = ({
  value: externalValue,
  onChange,
  placeholder = "Start typing or use the toolbar...",
  className = "",
  height = 400,
  onSave,
  tools,
  groups,
}) => {
  const [value, setValue] = useState<Descendant[]>(
    externalValue || initialValue
  );
  const editor = useMemo(
    () => withCustomPlugins(withHistory(withReact(createEditor()))),
    []
  );
  const [activeCommand, setActiveCommand] = useState<string | null>(null);

  const allRenderers = useMemo(() => {
    const renderers: { [key: string]: React.FC<any> } = {};
    tools.forEach((tool) => {
      if (tool.renderComponent) {
        renderers[tool.id] = tool.renderComponent;
      }
    });
    return renderers;
  }, [tools]);

  const allCommands = useMemo(() => {
    const commands: {
      [key: string]: (editor: CustomEditor, data?: any) => void;
    } = {};
    tools.forEach((tool) => {
      if (tool.onClick) {
        commands[tool.id] = tool.onClick;
      }
    });
    return commands;
  }, [tools]);

  const renderElement = useCallback(
    (props: any) => {
      const { element, children, attributes } = props;
      const Renderer = allRenderers[element.type] || ParagraphElementRenderer;
      return (
        <Renderer attributes={attributes} element={element}>
          {children}
        </Renderer>
      );
    },
    [allRenderers]
  );

  const renderLeaf = useCallback(
    (props: any) => <LeafRenderer {...props} />,
    []
  );

  const handleCommand = useCallback(
    (command: string, data?: {}) => {
      const commandHandler = allCommands[command];
      if (commandHandler) {
        commandHandler(editor, data);
      } else {
        setActiveCommand(command);
      }
    },
    [editor, allCommands]
  );

  const handleChange = useCallback(
    (newValue: Descendant[]) => {
      setValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    },
    [onChange]
  );

  const containerHeight = typeof height === "number" ? `${height}px` : height;

  const hotkeys = {
    "mod+b": Mark.Bold,
    "mod+i": Mark.Italic,
    "mod+s": "save",
  };

  return (
    <div
      className={`border border-gray-200 rounded-lg bg-white shadow-sm ${className}`}
    >
      <Slate editor={editor} value={value} onChange={handleChange}>
        <HoveringToolbar
          editor={editor}
          onToolClick={handleCommand}
          tools={tools}
          groups={groups}
        />
        <Toolbar
          editor={editor}
          onToolClick={handleCommand}
          tools={tools}
          groups={groups}
        />
        <div className="p-4" style={{ minHeight: containerHeight }}>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            className="min-h-full leading-relaxed focus:outline-none"
            placeholder={placeholder}
            onKeyDown={(event) => {
              for (const hotkey in hotkeys) {
                if (isHotkey(hotkey, event)) {
                  event.preventDefault();
                  const command = hotkeys[hotkey];
                  if (command === "save") {
                    onSave?.();
                  } else {
                    toggleMark(editor, command);
                  }
                }
              }
            }}
          />
        </div>
      </Slate>
      <CommandPalette
        editor={editor}
        command={activeCommand}
        onClose={() => setActiveCommand(null)}
        tools={tools}
      />
    </div>
  );
};

//===========================
// Data
//===========================
export const defaultTools: ITool[] = [
  // Core Marks
  {
    id: Mark.Bold,
    ToolBarButton: <Icon name="Bold" className="w-4 h-4" />,
    category: "mark",
    group: ToolbarGroupId.Marks,
  },
  {
    id: Mark.Italic,
    ToolBarButton: <Icon name="Italic" className="w-4 h-4" />,
    category: "mark",
    group: ToolbarGroupId.Marks,
  },
  {
    id: Mark.Strikethrough,
    ToolBarButton: <Icon name="Strikethrough" className="w-4 h-4" />,
    category: "mark",
    group: ToolbarGroupId.Marks,
  },
  {
    id: Mark.Code,
    ToolBarButton: <Icon name="Code" className="w-4 h-4" />,
    category: "mark",
    group: ToolbarGroupId.Marks,
  },
  {
    id: Mark.Superscript,
    ToolBarButton: <sup>2</sup>,
    category: "mark",
    group: ToolbarGroupId.Marks,
  },
  {
    id: Mark.Subscript,
    ToolBarButton: <sub>2</sub>,
    category: "mark",
    group: ToolbarGroupId.Marks,
  },

  // Core Blocks
  {
    id: ComponentType.BlockQuote,
    ToolBarButton: <Icon name="Quote" className="w-4 h-4" />,
    category: "block",
    group: ToolbarGroupId.Block,
    renderComponent: ParagraphElementRenderer,
  },
  {
    id: ComponentType.BulletedList,
    ToolBarButton: <Icon name="List" className="w-4 h-4" />,
    category: "block",
    group: ToolbarGroupId.Block,
    renderComponent: BulletedListElementRenderer,
  },
  {
    id: ComponentType.NumberedList,
    ToolBarButton: <Icon name="ListOrdered" className="w-4 h-4" />,
    category: "block",
    group: ToolbarGroupId.Block,
    renderComponent: NumberedListElementRenderer,
  },
  {
    id: ComponentType.ListItem,
    ToolBarButton: <></>,
    category: "block",
    group: ToolbarGroupId.Block,
    renderComponent: ListItemElementRenderer,
  },
  {
    id: ComponentType.CodeBlock,
    ToolBarButton: <></>,
    category: "block",
    group: ToolbarGroupId.Block,
    renderComponent: CodeBlockElementRenderer,
  },
  {
    id: ComponentType.Paragraph,
    ToolBarButton: <></>,
    category: "block",
    group: ToolbarGroupId.Block,
    renderComponent: ParagraphElementRenderer,
  },

  // Core Alignments
  {
    id: Alignment.Left,
    ToolBarButton: <Icon name="AlignLeft" className="w-4 h-4" />,
    category: "align",
    group: ToolbarGroupId.Alignments,
  },
  {
    id: Alignment.Center,
    ToolBarButton: <Icon name="AlignCenter" className="w-4 h-4" />,
    category: "align",
    group: ToolbarGroupId.Alignments,
  },
  {
    id: Alignment.Right,
    ToolBarButton: <Icon name="AlignRight" className="w-4 h-4" />,
    category: "align",
    group: ToolbarGroupId.Alignments,
  },
  {
    id: Alignment.Justify,
    ToolBarButton: <Icon name="AlignJustify" className="w-4 h-4" />,
    category: "align",
    group: ToolbarGroupId.Alignments,
  },

  // Core Headings
  {
    id: ComponentType.HeadingOne,
    ToolBarButton: <Icon name="Heading1" className="w-4 h-4" />,
    category: "block",
    group: ToolbarGroupId.Headings,
    renderComponent: HeadingOneElementRenderer,
  },
  {
    id: ComponentType.HeadingTwo,
    ToolBarButton: <Icon name="Heading2" className="w-4 h-4" />,
    category: "block",
    group: ToolbarGroupId.Headings,
    renderComponent: HeadingTwoElementRenderer,
  },
  {
    id: ComponentType.HeadingThree,
    ToolBarButton: <Icon name="Heading3" className="w-4 h-4" />,
    category: "block",
    group: ToolbarGroupId.Headings,
    renderComponent: HeadingThreeElementRenderer,
  },
  {
    id: ComponentType.HeadingFour,
    ToolBarButton: <Icon name="Heading4" className="w-4 h-4" />,
    category: "block",
    group: ToolbarGroupId.Headings,
    renderComponent: HeadingFourElementRenderer,
  },
  {
    id: ComponentType.HeadingFive,
    ToolBarButton: <Icon name="Heading5" className="w-4 h-4" />,
    category: "block",
    group: ToolbarGroupId.Headings,
    renderComponent: HeadingFiveElementRenderer,
  },
  {
    id: ComponentType.HeadingSix,
    ToolBarButton: <Icon name="Heading6" className="w-4 h-4" />,
    category: "block",
    group: ToolbarGroupId.Headings,
    renderComponent: HeadingSixElementRenderer,
  },

  // Core Inline Styles (modal tools)
  {
    id: InlineStyle.FontSize,
    ToolBarButton: <Icon name="Type" className="w-4 h-4" />,
    category: "modal",
    group: ToolbarGroupId.InlineStyles,
    Plugin: InlineStyleModal,
  },
  {
    id: InlineStyle.Color,
    ToolBarButton: <Icon name="Palette" className="w-4 h-4" />,
    category: "modal",
    group: ToolbarGroupId.InlineStyles,
    Plugin: InlineStyleModal,
  },
  {
    id: InlineStyle.BackgroundColor,
    ToolBarButton: <Icon name="Sun" className="w-4 h-4" />,
    category: "modal",
    group: ToolbarGroupId.InlineStyles,
    Plugin: InlineStyleModal,
  },
  {
    id: InlineStyle.LetterSpacing,
    ToolBarButton: <Icon name="Eraser" className="w-4 h-4" />,
    category: "modal",
    group: ToolbarGroupId.InlineStyles,
    Plugin: InlineStyleModal,
  },
  {
    id: InlineStyle.LineHeight,
    ToolBarButton: <Icon name="Plus" className="w-4 h-4" />,
    category: "modal",
    group: ToolbarGroupId.InlineStyles,
    Plugin: InlineStyleModal,
  },
  {
    id: InlineStyle.TextTransform,
    ToolBarButton: <Icon name="CaseUpper" className="w-4 h-4" />,
    category: "modal",
    group: ToolbarGroupId.InlineStyles,
    Plugin: InlineStyleModal,
  },

  // Core Inserts
  {
    id: ComponentType.Table,
    ToolBarButton: <Icon name="Table" className="w-4 h-4" />,
    category: "insert",
    group: ToolbarGroupId.Inserts,
    renderComponent: TableElementRenderer,
    onClick: (editor: CustomEditor) =>
      Transforms.insertNodes(editor, {
        type: ComponentType.Table,
        children: [
          {
            type: ComponentType.TableRow,
            children: [
              {
                type: ComponentType.TableCell,
                children: [{ text: "Header 1" }],
              },
              {
                type: ComponentType.TableCell,
                children: [{ text: "Header 2" }],
              },
            ],
          },
          {
            type: ComponentType.TableRow,
            children: [
              { type: ComponentType.TableCell, children: [{ text: "Cell 1" }] },
              { type: ComponentType.TableCell, children: [{ text: "Cell 2" }] },
            ],
          },
        ],
      } as TableElement),
  },
  {
    id: ComponentType.Image,
    ToolBarButton: <Icon name="Image" className="w-4 h-4" />,
    category: "modal",
    group: ToolbarGroupId.Inserts,
    renderComponent: ImageElementRenderer,
    Plugin: InsertImageModal,
  },
  {
    id: ComponentType.Video,
    ToolBarButton: <Icon name="Video" className="w-4 h-4" />,
    category: "modal",
    group: ToolbarGroupId.Inserts,
    renderComponent: VideoElementRenderer,
    Plugin: InsertVideoModal,
  },
  {
    id: ComponentType.Link,
    ToolBarButton: <Icon name="Link" className="w-4 h-4" />,
    category: "modal",
    group: ToolbarGroupId.Inserts,
    renderComponent: LinkElementRenderer,
    Plugin: InsertLinkModal,
  },

  //External plugins
  {
    id: ComponentType.Mention,
    ToolBarButton: <Icon name="AtSign" className="w-4 h-4" />,
    category: "modal",
    group: ToolbarGroupId.Inserts,
    renderComponent: MentionElementRenderer,
    Plugin: InsertMentionModal,
  },
  {
    id: ComponentType.EmbeddedStory,
    ToolBarButton: <Icon name="FileText" className="w-4 h-4" />,
    category: "modal",
    group: ToolbarGroupId.Inserts,
    renderComponent: EmbeddedStoryElementRenderer,
    Plugin: InsertStoryModal,
  },
];

export const defaultToolbarGroups: IToolbarGroup[] = [
  { group: ToolbarGroupId.Marks, label: "Text Marks" },
  { group: ToolbarGroupId.Block, label: "Block Types" },
  { group: ToolbarGroupId.Alignments, label: "Alignment" },
  { group: ToolbarGroupId.Headings, label: "Headings" },
  { group: ToolbarGroupId.Inserts, label: "Inserts" },
  { group: ToolbarGroupId.InlineStyles, label: "Styles" },
];

const App: React.FC = () => {
  const [value, setValue] = useState(initialValue);
  const onSave = () => console.log("Content saved!", value);
  const onChange = (newValue) => {
    setValue(newValue);
    console.log("Content changed:", newValue);
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-gray-800">
          Advanced Rich Text Editor
        </h1>
        <AdvancedRichTextEditor
          value={value}
          onChange={onChange}
          onSave={onSave}
          tools={defaultTools}
          groups={defaultToolbarGroups}
          placeholder="Start typing or use the toolbar..."
          height="60vh"
        />
        <div className="mt-4 text-center text-gray-500 text-sm">
          Press 'Cmd + S' (or 'Ctrl + S') to save the content.
        </div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

interface AdvancedRichTextEditorProps {
  value: Descendant[];
  onChange: (value: Descendant[]) => void;
  placeholder?: string;
  className?: string;
  height?: number | string;
  onSave?: () => void;
  tools: ITool[];
  groups: IToolbarGroup[];
}

const withCustomPlugins = (editor: CustomEditor): CustomEditor => {
  const { normalizeNode } = editor;
  editor.normalizeNode = (entry) => {
    if (entry[1].length === 0) {
      const lastNode = editor.children[editor.children.length - 1];
      if (
        !lastNode ||
        !Element.isElement(lastNode) ||
        lastNode.type !== ComponentType.Paragraph
      ) {
        const paragraph: ParagraphElement = {
          type: ComponentType.Paragraph,
          children: [{ text: "" }],
        };
        Transforms.insertNodes(editor, paragraph, {
          at: [editor.children.length],
        });
        return;
      }
    }
    normalizeNode(entry);
  };
  return editor;
};

const MarkButton = ({
  editor,
  id,
  ToolBarButton,
  className = "",
}: {
  editor: CustomEditor;
  id: string;
  ToolBarButton: React.ReactNode;
  className?: string;
}) => {
  return (
    <button
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, id);
      }}
      className={`p-2 rounded-lg transition-colors ${
        isMarkActive(editor, id) ? "bg-gray-200" : "hover:bg-gray-100"
      } ${className}`}
    >
      {ToolBarButton}
    </button>
  );
};

const BlockButton = ({
  editor,
  id,
  ToolBarButton,
  className = "",
}: {
  editor: CustomEditor;
  id: string;
  ToolBarButton: React.ReactNode;
  className?: string;
}) => {
  const isActive = isBlockActive(editor, id, "type");
  return (
    <button
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, id);
      }}
      className={`p-2 rounded-lg transition-colors ${
        isActive ? "bg-gray-200" : "hover:bg-gray-100"
      } ${className}`}
    >
      {ToolBarButton}
    </button>
  );
};

const AlignButton = ({
  editor,
  id,
  ToolBarButton,
  className = "",
}: {
  editor: CustomEditor;
  id: string;
  ToolBarButton: React.ReactNode;
  className?: string;
}) => {
  const isActive = isBlockActive(editor, id, "align");
  return (
    <button
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, id);
      }}
      className={`p-2 rounded-lg transition-colors ${
        isActive ? "bg-gray-200" : "hover:bg-gray-100"
      } ${className}`}
    >
      {ToolBarButton}
    </button>
  );
};

const Toolbar = ({
  editor,
  onToolClick,
  tools,
  groups,
  isInline = false,
}: {
  editor: CustomEditor;
  onToolClick: (command: string) => void;
  tools: ITool[];
  groups: IToolbarGroup[];
  isInline?: boolean;
}) => {
  const toolsByGroup = useMemo(() => {
    const map = new Map<string, ITool[]>();
    tools.forEach((tool) => {
      if (!map.has(tool.group)) {
        map.set(tool.group, []);
      }
      map.get(tool.group)?.push(tool);
    });
    return map;
  }, [tools]);

  const renderTool = useCallback(
    (tool: ITool) => {
      switch (tool.category) {
        case "mark":
          return (
            <MarkButton
              key={tool.id}
              editor={editor}
              id={tool.id}
              ToolBarButton={tool.ToolBarButton}
            />
          );
        case "block":
          return (
            <BlockButton
              key={tool.id}
              editor={editor}
              id={tool.id}
              ToolBarButton={tool.ToolBarButton}
            />
          );
        case "align":
          return (
            <AlignButton
              key={tool.id}
              editor={editor}
              id={tool.id}
              ToolBarButton={tool.ToolBarButton}
            />
          );
        case "insert":
        case "modal":
          return (
            <button
              key={tool.id}
              onMouseDown={(event) => {
                event.preventDefault();
                onToolClick(tool.id);
              }}
              className="p-2 rounded-lg transition-colors hover:bg-gray-100"
            >
              {tool.ToolBarButton}
            </button>
          );
        default:
          return null;
      }
    },
    [onToolClick, editor]
  );

  return (
    <div
      className={`flex flex-wrap items-center gap-1 p-2 rounded-lg shadow-sm border border-gray-200 transition-all ${
        isInline ? "" : "mb-4"
      }`}
    >
      {groups.map((group) => {
        const groupTools = toolsByGroup.get(group.group);
        if (!groupTools || groupTools.length === 0) return null;
        return (
          <React.Fragment key={group.group}>
            <div className="flex items-center gap-1 p-1">
              {groupTools.map((tool) => renderTool(tool))}
            </div>
            <span className="w-px h-6 bg-gray-300 mx-1 last:hidden"></span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

const HoveringToolbar = ({
  editor,
  onToolClick,
  tools,
  groups,
}: {
  editor: CustomEditor;
  onToolClick: (command: string) => void;
  tools: ITool[];
  groups: IToolbarGroup[];
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inFocus = useFocused();
  const isSelected = useSelected();

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    const { selection } = editor;
    if (
      !selection ||
      !inFocus ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ""
    ) {
      el.removeAttribute("style");
      return;
    }

    const domRange = ReactEditor.toDOMRange(editor, selection);
    const rect = domRange.getBoundingClientRect();
    el.style.opacity = "1";
    el.style.top = `${rect.top + window.scrollY - el.offsetHeight - 8}px`;
    el.style.left = `${
      rect.left + window.scrollX - el.offsetWidth / 2 + rect.width / 2
    }px`;
  }, [editor, inFocus, isSelected]);

  return (
    <div
      ref={ref}
      className="absolute z-10 opacity-0 bg-white p-1 rounded-lg shadow-xl -mt-2 transition-opacity duration-150 transform -translate-x-1/2 left-1/2"
      onMouseDown={(e) => e.preventDefault()}
    >
      <Toolbar
        editor={editor}
        onToolClick={onToolClick}
        tools={tools}
        groups={groups}
        isInline={true}
      />
    </div>
  );
};

const CommandPalette = ({
  editor,
  command,
  onClose,
  tools,
}: {
  editor: CustomEditor;
  command: string | null;
  onClose: () => void;
  tools: ITool[];
}) => {
  const tool = useMemo(
    () => tools.find((t) => t.id === command),
    [command, tools]
  );

  if (!tool || !tool.Plugin) return null;

  const Plugin = tool.Plugin;
  const styleType = Object.values(InlineStyle).includes(tool.id as InlineStyle)
    ? (tool.id as InlineStyle)
    : undefined;

  return (
    <Modal onClose={onClose}>
      <Plugin editor={editor} onClose={onClose} styleType={styleType} />
    </Modal>
  );
};

const initialValue: CustomElement[] = [
  {
    type: ComponentType.Paragraph,
    children: [{ text: "Start typing or use the toolbar..." }],
  },
];
interface AdvancedRichTextEditorProps {
  value: Descendant[];
  onChange: (value: Descendant[]) => void;
  placeholder?: string;
  className?: string;
  height?: number | string;
  onSave?: () => void;
  tools: ITool[];
  groups: IToolbarGroup[];
}

const AdvancedRichTextEditor: React.FC<AdvancedRichTextEditorProps> = ({
  value: externalValue,
  onChange,
  placeholder = "Start typing or use the toolbar...",
  className = "",
  height = 400,
  onSave,
  tools,
  groups,
}) => {
  const [value, setValue] = useState<Descendant[]>(
    externalValue || initialValue
  );
  const editor = useMemo(
    () => withCustomPlugins(withHistory(withReact(createEditor()))),
    []
  );
  const [activeCommand, setActiveCommand] = useState<string | null>(null);

  const allRenderers = useMemo(() => {
    const renderers: { [key: string]: React.FC<any> } = {};
    tools.forEach((tool) => {
      if (tool.renderComponent) {
        renderers[tool.id] = tool.renderComponent;
      }
    });
    return renderers;
  }, [tools]);

  const allCommands = useMemo(() => {
    const commands: {
      [key: string]: (editor: CustomEditor, data?: any) => void;
    } = {};
    tools.forEach((tool) => {
      if (tool.onClick) {
        commands[tool.id] = tool.onClick;
      }
    });
    return commands;
  }, [tools]);

  const renderElement = useCallback(
    (props: any) => {
      const { element, children, attributes } = props;
      const Renderer = allRenderers[element.type] || ParagraphElementRenderer;
      return (
        <Renderer attributes={attributes} element={element}>
          {children}
        </Renderer>
      );
    },
    [allRenderers]
  );

  const renderLeaf = useCallback(
    (props: any) => <LeafRenderer {...props} />,
    []
  );

  const handleCommand = useCallback(
    (command: string, data?: {}) => {
      const commandHandler = allCommands[command];
      if (commandHandler) {
        commandHandler(editor, data);
      } else {
        setActiveCommand(command);
      }
    },
    [editor, allCommands]
  );

  const handleChange = useCallback(
    (newValue: Descendant[]) => {
      setValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    },
    [onChange]
  );

  const containerHeight = typeof height === "number" ? `${height}px` : height;

  const hotkeys = {
    "mod+b": Mark.Bold,
    "mod+i": Mark.Italic,
    "mod+s": "save",
  };

  return (
    <div
      className={`border border-gray-200 rounded-lg bg-white shadow-sm ${className}`}
    >
      <Slate editor={editor} value={value} onChange={handleChange}>
        <HoveringToolbar
          editor={editor}
          onToolClick={handleCommand}
          tools={tools}
          groups={groups}
        />
        <Toolbar
          editor={editor}
          onToolClick={handleCommand}
          tools={tools}
          groups={groups}
        />
        <div className="p-4" style={{ minHeight: containerHeight }}>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            className="min-h-full leading-relaxed focus:outline-none"
            placeholder={placeholder}
            onKeyDown={(event) => {
              for (const hotkey in hotkeys) {
                if (isHotkey(hotkey, event)) {
                  event.preventDefault();
                  const command = hotkeys[hotkey];
                  if (command === "save") {
                    onSave?.();
                  } else {
                    toggleMark(editor, command);
                  }
                }
              }
            }}
          />
        </div>
      </Slate>
      <CommandPalette
        editor={editor}
        command={activeCommand}
        onClose={() => setActiveCommand(null)}
        tools={tools}
      />
    </div>
  );
};

//===========================
// Data
//===========================
const defaultTools: ITool[] = [
  // Core Marks
  {
    id: Mark.Bold,
    ToolBarButton: <Icon name="Bold" className="w-4 h-4" />,
    category: "mark",
    group: ToolbarGroupId.Marks,
  },
  {
    id: Mark.Italic,
    ToolBarButton: <Icon name="Italic" className="w-4 h-4" />,
    category: "mark",
    group: ToolbarGroupId.Marks,
  },
  {
    id: Mark.Strikethrough,
    ToolBarButton: <Icon name="Strikethrough" className="w-4 h-4" />,
    category: "mark",
    group: ToolbarGroupId.Marks,
  },
  {
    id: Mark.Code,
    ToolBarButton: <Icon name="Code" className="w-4 h-4" />,
    category: "mark",
    group: ToolbarGroupId.Marks,
  },
  {
    id: Mark.Superscript,
    ToolBarButton: <sup>2</sup>,
    category: "mark",
    group: ToolbarGroupId.Marks,
  },
  {
    id: Mark.Subscript,
    ToolBarButton: <sub>2</sub>,
    category: "mark",
    group: ToolbarGroupId.Marks,
  },

  // Core Blocks
  {
    id: ComponentType.BlockQuote,
    ToolBarButton: <Icon name="Quote" className="w-4 h-4" />,
    category: "block",
    group: ToolbarGroupId.Block,
    renderComponent: ParagraphElementRenderer,
  },
  {
    id: ComponentType.BulletedList,
    ToolBarButton: <Icon name="List" className="w-4 h-4" />,
    category: "block",
    group: ToolbarGroupId.Block,
    renderComponent: BulletedListElementRenderer,
  },
  {
    id: ComponentType.NumberedList,
    ToolBarButton: <Icon name="ListOrdered" className="w-4 h-4" />,
    category: "block",
    group: ToolbarGroupId.Block,
    renderComponent: NumberedListElementRenderer,
  },
  {
    id: ComponentType.ListItem,
    ToolBarButton: <></>,
    category: "block",
    group: ToolbarGroupId.Block,
    renderComponent: ListItemElementRenderer,
  },
  {
    id: ComponentType.CodeBlock,
    ToolBarButton: <></>,
    category: "block",
    group: ToolbarGroupId.Block,
    renderComponent: CodeBlockElementRenderer,
  },
  {
    id: ComponentType.Paragraph,
    ToolBarButton: <></>,
    category: "block",
    group: ToolbarGroupId.Block,
    renderComponent: ParagraphElementRenderer,
  },

  // Core Alignments
  {
    id: Alignment.Left,
    ToolBarButton: <Icon name="AlignLeft" className="w-4 h-4" />,
    category: "align",
    group: ToolbarGroupId.Alignments,
  },
  {
    id: Alignment.Center,
    ToolBarButton: <Icon name="AlignCenter" className="w-4 h-4" />,
    category: "align",
    group: ToolbarGroupId.Alignments,
  },
  {
    id: Alignment.Right,
    ToolBarButton: <Icon name="AlignRight" className="w-4 h-4" />,
    category: "align",
    group: ToolbarGroupId.Alignments,
  },
  {
    id: Alignment.Justify,
    ToolBarButton: <Icon name="AlignJustify" className="w-4 h-4" />,
    category: "align",
    group: ToolbarGroupId.Alignments,
  },

  // Core Headings
  {
    id: ComponentType.HeadingOne,
    ToolBarButton: <Icon name="Heading1" className="w-4 h-4" />,
    category: "block",
    group: ToolbarGroupId.Headings,
    renderComponent: HeadingOneElementRenderer,
  },
  {
    id: ComponentType.HeadingTwo,
    ToolBarButton: <Icon name="Heading2" className="w-4 h-4" />,
    category: "block",
    group: ToolbarGroupId.Headings,
    renderComponent: HeadingTwoElementRenderer,
  },
  {
    id: ComponentType.HeadingThree,
    ToolBarButton: <Icon name="Heading3" className="w-4 h-4" />,
    category: "block",
    group: ToolbarGroupId.Headings,
    renderComponent: HeadingThreeElementRenderer,
  },
  {
    id: ComponentType.HeadingFour,
    ToolBarButton: <Icon name="Heading4" className="w-4 h-4" />,
    category: "block",
    group: ToolbarGroupId.Headings,
    renderComponent: HeadingFourElementRenderer,
  },
  {
    id: ComponentType.HeadingFive,
    ToolBarButton: <Icon name="Heading5" className="w-4 h-4" />,
    category: "block",
    group: ToolbarGroupId.Headings,
    renderComponent: HeadingFiveElementRenderer,
  },
  {
    id: ComponentType.HeadingSix,
    ToolBarButton: <Icon name="Heading6" className="w-4 h-4" />,
    category: "block",
    group: ToolbarGroupId.Headings,
    renderComponent: HeadingSixElementRenderer,
  },

  // Core Inline Styles (modal tools)
  {
    id: InlineStyle.FontSize,
    ToolBarButton: <Icon name="Type" className="w-4 h-4" />,
    category: "modal",
    group: ToolbarGroupId.InlineStyles,
    Plugin: InlineStyleModal,
  },
  {
    id: InlineStyle.Color,
    ToolBarButton: <Icon name="Palette" className="w-4 h-4" />,
    category: "modal",
    group: ToolbarGroupId.InlineStyles,
    Plugin: InlineStyleModal,
  },
  {
    id: InlineStyle.BackgroundColor,
    ToolBarButton: <Icon name="Sun" className="w-4 h-4" />,
    category: "modal",
    group: ToolbarGroupId.InlineStyles,
    Plugin: InlineStyleModal,
  },
  {
    id: InlineStyle.LetterSpacing,
    ToolBarButton: <Icon name="Eraser" className="w-4 h-4" />,
    category: "modal",
    group: ToolbarGroupId.InlineStyles,
    Plugin: InlineStyleModal,
  },
  {
    id: InlineStyle.LineHeight,
    ToolBarButton: <Icon name="Plus" className="w-4 h-4" />,
    category: "modal",
    group: ToolbarGroupId.InlineStyles,
    Plugin: InlineStyleModal,
  },
  {
    id: InlineStyle.TextTransform,
    ToolBarButton: <Icon name="CaseUpper" className="w-4 h-4" />,
    category: "modal",
    group: ToolbarGroupId.InlineStyles,
    Plugin: InlineStyleModal,
  },

  // Core Inserts
  {
    id: ComponentType.Table,
    ToolBarButton: <Icon name="Table" className="w-4 h-4" />,
    category: "insert",
    group: ToolbarGroupId.Inserts,
    renderComponent: TableElementRenderer,
    onClick: (editor: CustomEditor) =>
      Transforms.insertNodes(editor, {
        type: ComponentType.Table,
        children: [
          {
            type: ComponentType.TableRow,
            children: [
              {
                type: ComponentType.TableCell,
                children: [{ text: "Header 1" }],
              },
              {
                type: ComponentType.TableCell,
                children: [{ text: "Header 2" }],
              },
            ],
          },
          {
            type: ComponentType.TableRow,
            children: [
              { type: ComponentType.TableCell, children: [{ text: "Cell 1" }] },
              { type: ComponentType.TableCell, children: [{ text: "Cell 2" }] },
            ],
          },
        ],
      } as TableElement),
  },
  {
    id: ComponentType.Image,
    ToolBarButton: <Icon name="Image" className="w-4 h-4" />,
    category: "modal",
    group: ToolbarGroupId.Inserts,
    renderComponent: ImageElementRenderer,
    Plugin: InsertImageModal,
  },
  {
    id: ComponentType.Video,
    ToolBarButton: <Icon name="Video" className="w-4 h-4" />,
    category: "modal",
    group: ToolbarGroupId.Inserts,
    renderComponent: VideoElementRenderer,
    Plugin: InsertVideoModal,
  },
  {
    id: ComponentType.Link,
    ToolBarButton: <Icon name="Link" className="w-4 h-4" />,
    category: "modal",
    group: ToolbarGroupId.Inserts,
    renderComponent: LinkElementRenderer,
    Plugin: InsertLinkModal,
  },

  //External plugins
  {
    id: ComponentType.Mention,
    ToolBarButton: <Icon name="AtSign" className="w-4 h-4" />,
    category: "modal",
    group: ToolbarGroupId.Inserts,
    renderComponent: MentionElementRenderer,
    Plugin: InsertMentionModal,
  },
  {
    id: ComponentType.EmbeddedStory,
    ToolBarButton: <Icon name="FileText" className="w-4 h-4" />,
    category: "modal",
    group: ToolbarGroupId.Inserts,
    renderComponent: EmbeddedStoryElementRenderer,
    Plugin: InsertStoryModal,
  },
];

export const defaultToolbarGroups: IToolbarGroup[] = [
  { group: ToolbarGroupId.Marks, label: "Text Marks" },
  { group: ToolbarGroupId.Block, label: "Block Types" },
  { group: ToolbarGroupId.Alignments, label: "Alignment" },
  { group: ToolbarGroupId.Headings, label: "Headings" },
  { group: ToolbarGroupId.Inserts, label: "Inserts" },
  { group: ToolbarGroupId.InlineStyles, label: "Styles" },
];

const AdvancedRichTextEditor: React.FC<AdvancedRichTextEditorProps> = ({
  value: externalValue,
  onChange,
  placeholder = "Start typing or use the toolbar...",
  className = "",
  height = 400,
  onSave,
  tools,
  groups,
}) => {
  const [value, setValue] = useState<Descendant[]>(
    externalValue || initialValue
  );
  const editor = useMemo(
    () => withCustomPlugins(withHistory(withReact(createEditor()))),
    []
  );
  const [activeCommand, setActiveCommand] = useState<string | null>(null);

  const allRenderers = useMemo(() => {
    const renderers: { [key: string]: React.FC<any> } = {};
    tools.forEach((tool) => {
      if (tool.renderComponent) {
        renderers[tool.id] = tool.renderComponent;
      }
    });
    return renderers;
  }, [tools]);

  const allCommands = useMemo(() => {
    const commands: {
      [key: string]: (editor: CustomEditor, data?: any) => void;
    } = {};
    tools.forEach((tool) => {
      if (tool.onClick) {
        commands[tool.id] = tool.onClick;
      }
    });
    return commands;
  }, [tools]);

  const renderElement = useCallback(
    (props: any) => {
      const { element, children, attributes } = props;
      const Renderer = allRenderers[element.type] || ParagraphElementRenderer;
      return (
        <Renderer attributes={attributes} element={element}>
          {children}
        </Renderer>
      );
    },
    [allRenderers]
  );

  const renderLeaf = useCallback(
    (props: any) => <LeafRenderer {...props} />,
    []
  );

  const handleCommand = useCallback(
    (command: string, data?: {}) => {
      const commandHandler = allCommands[command];
      if (commandHandler) {
        commandHandler(editor, data);
      } else {
        setActiveCommand(command);
      }
    },
    [editor, allCommands]
  );

  const handleChange = useCallback(
    (newValue: Descendant[]) => {
      setValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    },
    [onChange]
  );

  const containerHeight = typeof height === "number" ? `${height}px` : height;

  const hotkeys = {
    "mod+b": Mark.Bold,
    "mod+i": Mark.Italic,
    "mod+s": "save",
  };

  return (
    <div
      className={`border border-gray-200 rounded-lg bg-white shadow-sm ${className}`}
    >
      <Slate editor={editor} value={value} onChange={handleChange}>
        <HoveringToolbar
          editor={editor}
          onToolClick={handleCommand}
          tools={tools}
          groups={groups}
        />
        <Toolbar
          editor={editor}
          onToolClick={handleCommand}
          tools={tools}
          groups={groups}
        />
        <div className="p-4" style={{ minHeight: containerHeight }}>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            className="min-h-full leading-relaxed focus:outline-none"
            placeholder={placeholder}
            onKeyDown={(event) => {
              for (const hotkey in hotkeys) {
                if (isHotkey(hotkey, event)) {
                  event.preventDefault();
                  const command = hotkeys[hotkey];
                  if (command === "save") {
                    onSave?.();
                  } else {
                    toggleMark(editor, command);
                  }
                }
              }
            }}
          />
        </div>
      </Slate>
      <CommandPalette
        editor={editor}
        command={activeCommand}
        onClose={() => setActiveCommand(null)}
        tools={tools}
      />
    </div>
  );
};

//===========================
// Main App Component
//===========================
const App: React.FC = () => {
  const [value, setValue] = useState(initialValue);
  const onSave = () => console.log("Content saved!", value);
  const onChange = (newValue) => {
    setValue(newValue);
    console.log("Content changed:", newValue);
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-gray-800">
          Advanced Rich Text Editor
        </h1>
        <AdvancedRichTextEditor
          value={value}
          onChange={onChange}
          onSave={onSave}
          tools={defaultTools}
          groups={defaultToolbarGroups}
          placeholder="Start typing or use the toolbar..."
          height="60vh"
        />
        <div className="mt-4 text-center text-gray-500 text-sm">
          Press 'Cmd + S' (or 'Ctrl + S') to save the content.
        </div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

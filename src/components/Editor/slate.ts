import { BaseEditor, Descendant } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor, RenderElementProps } from "slate-react";
import { BlockQuoteElement } from "./BlockQuoteElement";
import { BulletedListElement } from "./BulletedListElement";
import { CheckListItemElement } from "./CheckListItemElement";
import { CodeBlockElement } from "./CodeBlockElement";
import { EditableVoidElement } from "./EditableVoidElement";
import { EmbeddedStoryElement } from "./EmbeddedStoryElement";
import {
  HeadingElement,
  HeadingOneElement,
  HeadingTwoElement,
  HeadingThreeElement,
  HeadingFourElement,
  HeadingFiveElement,
  HeadingSixElement,
} from "./HeadingElement";
import { LinkElement } from "./LinkElement";
import { ListItemElement } from "./ListItemElement";
import { NumberedListElement } from "./NumberedListElement";
import { ParagraphElement } from "./ParagraphElement";
import { TagElement } from "./TagElement";
import { TitleElement } from "./TitleElement";
import { VideoElement } from "./VideoElement";
import { ThematicBreakElement } from "./Elements/ThematicBreakElement";
import { ImageElement } from "./Plugins/Image/ImageElement";
import { MentionElement } from "./Plugins/Mention/MentionPlugin";
import {
  TableElement,
  TableRowElement,
  TableCellElement,
} from "./Plugins/Table/TableElement";

// ------------------------
// Types, Enums, Interfaces
// ------------------------
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
  userId?: string;
  url?: string;
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
  | HeadingElement
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

export type EditorElementPlugin = {
  type: string;
  render: (
    props: RenderSlateElementProps & { editor: CustomEditor }
  ) => JSX.Element;
};

export interface PluginEditor extends BaseEditor, ReactEditor, HistoryEditor {
  renderElement: (props: RenderSlateElementProps) => JSX.Element | undefined;
  registerElement: (plugin: EditorElementPlugin) => void;
}

// Slate Editor Type
export type CustomEditor = BaseEditor &
  ReactEditor &
  HistoryEditor &
  PluginEditor;

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

export {
  BlockQuoteElement,
  BulletedListElement,
  CheckListItemElement,
  CodeBlockElement,
  EditableVoidElement,
  EmbeddedStoryElement,
  HeadingElement,
  HeadingOneElement,
  HeadingTwoElement,
  HeadingThreeElement,
  HeadingFourElement,
  HeadingFiveElement,
  HeadingSixElement,
  ImageElement,
  LinkElement,
  ListItemElement,
  MentionElement,
  NumberedListElement,
  ParagraphElement,
  TableCellElement,
  TableElement,
  TableRowElement,
  TagElement,
  TitleElement,
  ThematicBreakElement,
  VideoElement,
};

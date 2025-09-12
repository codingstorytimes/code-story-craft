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

export interface IToolbarGroup {
  group: ToolbarGroupId | string;
  label: string;
}

export interface ITool {
  id: string;
  ToolBarButton: React.ReactNode;
  category: "mark" | "block" | "align" | "insert" | "modal";
  group: ToolbarGroupId | string;
}

export const defaultToolbarGroups: IToolbarGroup[] = [
  { group: ToolbarGroupId.Marks, label: "Text Marks" },
  { group: ToolbarGroupId.Block, label: "Block Types" },
  { group: ToolbarGroupId.Alignments, label: "Alignment" },
  { group: ToolbarGroupId.Headings, label: "Headings" },
  { group: ToolbarGroupId.Inserts, label: "Inserts" },
  { group: ToolbarGroupId.InlineStyles, label: "Styles" },
];

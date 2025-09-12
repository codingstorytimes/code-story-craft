import React, {
  useCallback,
  useMemo,
  useState,
  createContext,
  useContext,
  forwardRef,
  useRef,
  useEffect,
  ButtonHTMLAttributes,
} from "react";

// The following imports must be used in this implementation , all functionality must be retained based on the external library
// Do not remove external libraries, use them event if they result in problems compiling the code.previewing the code is not as important as the important as the code being correct
import {
  createEditor,
  Editor,
  Transforms,
  Element as SlateElement,
  Node,
  BaseEditor,
  Descendant,
  Point,
} from "slate";
import { Slate, Editable, withReact, useSlate, ReactEditor } from "slate-react";
import { SketchPicker } from "react-color";

import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  CheckSquare,
  Image,
  Video,
  Link,
  Table,
  Hash,
  AtSign,
  BookOpen,
  Minus,
  MoreHorizontal,
  Type,
  X,
  Palette,
  Droplet,
  Text,
} from "lucide-react";
import { HistoryEditor } from "slate-history";

export type IEmbedType = "mini" | "inline" | "full";

// ------------------------
// Custom Slate Types
// ------------------------
export type CustomText = {
  text: string;
  bold?: boolean;
  code?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  color?: string;
  backgroundColor?: string;
  fontSize?: string;
};

export type ParagraphElement = {
  type: ComponentType.Paragraph;
  align?: Alignment;
  children: CustomText[];
};

export type BlockQuoteElement = {
  type: ComponentType.BlockQuote;
  align?: Alignment;
  children: CustomText[];
};

export type HeadingOneElement = {
  type: ComponentType.HeadingOne;
  align?: Alignment;
  children: CustomText[];
};
export type HeadingTwoElement = {
  type: ComponentType.HeadingTwo;
  align?: Alignment;
  children: CustomText[];
};
export type HeadingThreeElement = {
  type: ComponentType.HeadingThree;
  align?: Alignment;
  children: CustomText[];
};
export type HeadingFourElement = {
  type: ComponentType.HeadingFour;
  align?: Alignment;
  children: CustomText[];
};
export type HeadingFiveElement = {
  type: ComponentType.HeadingFive;
  align?: Alignment;
  children: CustomText[];
};
export type HeadingSixElement = {
  type: ComponentType.HeadingSix;
  align?: Alignment;
  children: CustomText[];
};

export type CodeBlockElement = {
  type: ComponentType.CodeBlock;
  language: string;
  children: CustomText[];
};

export type ThematicBreakElement = {
  type: ComponentType.ThematicBreak;
  children: CustomText[];
};

export type LinkElement = {
  type: ComponentType.Link;
  url: string;
  children: CustomText[];
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

export type TableCellElement = {
  type: ComponentType.TableCell;
  children: CustomText[];
};

export type TableRowElement = {
  type: ComponentType.TableRow;
  children: TableCellElement[];
};

export type TableElement = {
  type: ComponentType.Table;
  children: TableRowElement[];
};

export type EmbeddedStoryElement = {
  type: ComponentType.EmbeddedStory;
  storyId: string;
  embedType?: IEmbedType;
  children: CustomText[];
};

export type MentionElement = {
  type: ComponentType.Mention;
  userId: string;
  children: CustomText[];
};

export type TagElement = {
  type: ComponentType.Tag;
  tagId: string;
  children: CustomText[];
};

// Unified Element Type
export type CustomElement =
  | ParagraphElement
  | BlockQuoteElement
  | HeadingOneElement
  | HeadingTwoElement
  | HeadingThreeElement
  | HeadingFourElement
  | HeadingFiveElement
  | HeadingSixElement
  | CodeBlockElement
  | ThematicBreakElement
  | LinkElement
  | ImageElement
  | VideoElement
  | TableElement
  | TableRowElement
  | TableCellElement
  | EmbeddedStoryElement
  | MentionElement
  | TagElement;

// Slate Editor Type
export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

// Augment Slate's Custom Types
declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

// ------------------------
// Custom UI Components (to replace shadcn/ui)
// ------------------------

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50";

    const variantClasses: Record<string, string> = {
      default: "bg-blue-600 text-white shadow hover:bg-blue-700",
      ghost: "hover:bg-gray-100 hover:text-gray-900",
      outline:
        "border border-gray-300 bg-transparent shadow-sm hover:bg-gray-100",
    };

    const sizeClasses: Record<string, string> = {
      default: "h-9 px-4 py-2",
      sm: "h-8 px-3 text-xs",
      lg: "h-10 px-8",
      icon: "h-9 w-9",
    };

    const finalClasses = `${baseClasses} ${variantClasses[variant]} ${
      sizeClasses[size]
    } ${className || ""}`;

    return <button className={finalClasses} ref={ref} {...props} />;
  }
);

Button.displayName = "Button";

// Dropdown Menu Context
const DropdownMenuContext = createContext(null);

const DropdownMenu = ({ children }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div ref={dropdownRef} className="relative">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuTrigger = ({ children, asChild }) => {
  const { open, setOpen } = useContext(DropdownMenuContext);
  const child = React.Children.only(children);

  const onSelect = (e) => {
    e.preventDefault(); // Prevent text editor from losing focus
    setOpen(!open);
  };

  return React.cloneElement(child, {
    onMouseDown: onSelect,
  });
};

const DropdownMenuContent = ({ children, className }) => {
  const { open, setOpen } = useContext(DropdownMenuContext);
  if (!open) return null;

  return (
    <div
      className={`absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white p-1 shadow-lg z-50 animate-in fade-in-0 zoom-in-95 ${className}`}
      style={{ transformOrigin: "top right" }}
      onBlur={() => setOpen(false)}
    >
      {children}
    </div>
  );
};

const DropdownMenuItem = ({ children, asChild, onClick }) => {
  const { setOpen } = useContext(DropdownMenuContext);

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      if (onClick) {
        onClick(e);
      }
      setOpen(false);
    },
    [onClick, setOpen]
  );

  if (asChild) {
    return React.cloneElement(React.Children.only(children), {
      onMouseDown: handleClick,
    });
  }

  return (
    <button
      className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
      onMouseDown={handleClick} // Use onMouseDown to prevent blur
    >
      {children}
    </button>
  );
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

// ------------------------
// Command Dispatch Table
// ------------------------
type CommandHandler = (editor: Editor, data?: any) => void;

const toggleMark = (editor: Editor, format: string, value: any = true) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, value);
  }
};

const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(editor, format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      (n as any).type === format,
    split: true,
  });

  Transforms.setNodes(editor, {
    type: isActive ? ComponentType.Paragraph : format,
  });
};

const toggleAlign = (editor: Editor, align: Alignment) => {
  Transforms.setNodes(
    editor,
    { align },
    { match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n) }
  );
};

const insertInline = (editor: Editor, type: ComponentType, data: any) => {
  if (editor.selection) {
    Transforms.insertNodes(editor, {
      type,
      ...data,
      children: [{ text: "" }],
    });
  }
};

const commandDispatch: Record<string, CommandHandler> = {
  // Marks
  [Mark.Bold]: (editor) => toggleMark(editor, Mark.Bold),
  [Mark.Italic]: (editor) => toggleMark(editor, Mark.Italic),
  [Mark.Strikethrough]: (editor) => toggleMark(editor, Mark.Strikethrough),
  [Mark.Code]: (editor) => toggleMark(editor, Mark.Code),

  // Blocks
  [ComponentType.BlockQuote]: (editor) =>
    toggleBlock(editor, ComponentType.BlockQuote),
  [ComponentType.CodeBlock]: (editor, lang) => {
    toggleBlock(editor, ComponentType.CodeBlock);
    Transforms.setNodes(editor, { language: lang });
  },
  [ComponentType.Paragraph]: (editor) =>
    toggleBlock(editor, ComponentType.Paragraph),
  [ComponentType.HeadingOne]: (editor) =>
    toggleBlock(editor, ComponentType.HeadingOne),
  [ComponentType.HeadingTwo]: (editor) =>
    toggleBlock(editor, ComponentType.HeadingTwo),
  [ComponentType.HeadingThree]: (editor) =>
    toggleBlock(editor, ComponentType.HeadingThree),
  [ComponentType.HeadingFour]: (editor) =>
    toggleBlock(editor, ComponentType.HeadingFour),
  [ComponentType.HeadingFive]: (editor) =>
    toggleBlock(editor, ComponentType.HeadingFive),
  [ComponentType.HeadingSix]: (editor) =>
    toggleBlock(editor, ComponentType.HeadingSix),

  // Alignment
  [Alignment.Left]: (editor) => toggleAlign(editor, Alignment.Left),
  [Alignment.Center]: (editor) => toggleAlign(editor, Alignment.Center),
  [Alignment.Right]: (editor) => toggleAlign(editor, Alignment.Right),
  [Alignment.Justify]: (editor) => toggleAlign(editor, Alignment.Justify),

  // Inline Styles
  [InlineStyle.Color]: (editor, color) =>
    toggleMark(editor, InlineStyle.Color, color),
  [InlineStyle.BackgroundColor]: (editor, color) =>
    toggleMark(editor, InlineStyle.BackgroundColor, color),
  [InlineStyle.FontSize]: (editor, size) =>
    toggleMark(editor, InlineStyle.FontSize, size),

  // Inline inserts
  [ComponentType.Tag]: (editor, tagId) =>
    insertInline(editor, ComponentType.Tag, { tagId }),
  [ComponentType.Mention]: (editor, userId) =>
    insertInline(editor, ComponentType.Mention, { userId }),
};

// ------------------------
// Helpers to detect active states
// ------------------------
const isMarkActive = (editor: Editor, mark: string) => {
  const marks = Editor.marks(editor);
  return marks ? !!marks[mark] : false;
};

const isBlockActive = (editor: Editor, format: string) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      (n as any).type === format,
  });
  return !!match;
};

const isAlignActive = (editor: Editor, align: Alignment) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      (n as any).align === align,
  });
  return !!match;
};

// ------------------------
// Modals
// ------------------------
export const TableGridModal = ({ onClose }) => {
  const editor = useSlate();
  const [hoveredCell, setHoveredCell] = useState({ row: 0, col: 0 });

  const createTableCell = (text = ""): TableCellElement => ({
    type: ComponentType.TableCell,
    children: [{ text }],
  });

  const createTableRow = (cellCount): TableRowElement => ({
    type: ComponentType.TableRow,
    children: Array.from({ length: cellCount }, () => createTableCell()),
  });

  const createTable = (rows, cols): TableElement => ({
    type: ComponentType.Table,
    children: Array.from({ length: rows }, () => createTableRow(cols)),
  });

  const handleCellHover = (row, col) => {
    setHoveredCell({ row, col });
  };

  const handleCellClick = (rows, cols) => {
    const table = createTable(rows + 1, cols + 1);
    Transforms.insertNodes(editor, table);
    onClose();
  };

  const renderGrid = () => {
    const grid = [];
    for (let row = 0; row < 8; row++) {
      const rowCells = [];
      for (let col = 0; col < 10; col++) {
        const isHighlighted = row <= hoveredCell.row && col <= hoveredCell.col;
        rowCells.push(
          <div
            key={`${row}-${col}`}
            className={`w-6 h-6 border border-gray-300 cursor-pointer transition-colors ${
              isHighlighted ? "bg-blue-500" : "bg-white hover:bg-gray-100"
            }`}
            onMouseEnter={() => handleCellHover(row, col)}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleCellClick(row, col)}
          />
        );
      }
      grid.push(
        <div key={row} className="flex">
          {rowCells}
        </div>
      );
    }
    return grid;
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 shadow-2xl w-auto animate-in fade-in-0 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Insert Table</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="mb-4">
          <div className="flex flex-col gap-1">{renderGrid()}</div>
          <p className="text-sm text-gray-600 mt-3 text-center">
            {hoveredCell.row + 1} × {hoveredCell.col + 1} table
          </p>
        </div>
      </div>
    </div>
  );
};

export const InsertLinkModal = ({ onClose }) => {
  const editor = useSlate();
  const [url, setUrl] = useState("");

  const insertLink = () => {
    if (!url) return;
    const link: LinkElement = {
      type: ComponentType.Link,
      url,
      children: [{ text: url }],
    };
    Transforms.insertNodes(editor, link);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 shadow-2xl w-96 animate-in fade-in-0 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Insert Link</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="border border-gray-300 p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              insertLink();
            }
          }}
          autoFocus
        />
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onMouseDown={(e) => {
              e.preventDefault();
              insertLink();
            }}
            disabled={!url}
          >
            Insert
          </Button>
        </div>
      </div>
    </div>
  );
};

export const InsertImageModal = ({ onClose }) => {
  const editor = useSlate();
  const [url, setUrl] = useState("");

  const insertImage = () => {
    if (!url) return;
    const image: ImageElement = {
      type: ComponentType.Image,
      url,
      children: [{ text: "" }],
    };
    Transforms.insertNodes(editor, image);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 shadow-2xl w-96 animate-in fade-in-0 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Insert Image</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="border border-gray-300 p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              insertImage();
            }
          }}
          autoFocus
        />
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onMouseDown={(e) => {
              e.preventDefault();
              insertImage();
            }}
            disabled={!url}
          >
            Insert
          </Button>
        </div>
      </div>
    </div>
  );
};

export const InsertVideoModal = ({ onClose }) => {
  const editor = useSlate();
  const [url, setUrl] = useState("");

  const insertVideo = () => {
    if (!url) return;
    const video: VideoElement = {
      type: ComponentType.Video,
      url,
      children: [{ text: "" }],
    };
    Transforms.insertNodes(editor, video);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 shadow-2xl w-96 animate-in fade-in-0 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Insert Video</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="border border-gray-300 p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              insertVideo();
            }
          }}
          autoFocus
        />
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onMouseDown={(e) => {
              e.preventDefault();
              insertVideo();
            }}
            disabled={!url}
          >
            Insert
          </Button>
        </div>
      </div>
    </div>
  );
};

export const ColorPickerMenu = ({ onClose }) => {
  const editor = useSlate();
  const [color, setColor] = useState("#000000");
  const [isTextColor, setIsTextColor] = useState(true);

  const handleColorChange = (newColor) => {
    setColor(newColor.hex);
  };

  const handleColorChangeComplete = (newColor) => {
    const mark = isTextColor ? InlineStyle.Color : InlineStyle.BackgroundColor;
    Editor.addMark(editor, mark, newColor.hex);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onMouseDown={onClose}
    >
      <div
        className="bg-white rounded-xl p-0 shadow-2xl w-auto animate-in fade-in-0 zoom-in-95"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center py-2 bg-gray-50 border-b">
          <Button
            size="sm"
            variant={isTextColor ? "default" : "ghost"}
            className="mr-2"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsTextColor(true);
            }}
          >
            <Text className="w-4 h-4 mr-1" /> Text
          </Button>
          <Button
            size="sm"
            variant={!isTextColor ? "default" : "ghost"}
            onMouseDown={(e) => {
              e.preventDefault();
              setIsTextColor(false);
            }}
          >
            <Droplet className="w-4 h-4 mr-1" /> Background
          </Button>
        </div>
        <div className="p-2">
          <SketchPicker
            color={color}
            onChange={handleColorChange}
            onChangeComplete={handleColorChangeComplete}
          />
        </div>
      </div>
    </div>
  );
};

export const FontSizeMenu = ({ onClose }) => {
  const editor = useSlate();
  const fontSizes = ["12px", "14px", "16px", "18px", "20px", "24px", "28px"];

  const handleSizeChange = (size) => {
    Editor.addMark(editor, InlineStyle.FontSize, size);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onMouseDown={onClose}
    >
      <div
        className="bg-white rounded-xl p-2 shadow-2xl w-48 animate-in fade-in-0 zoom-in-95"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {fontSizes.map((size) => (
          <Button
            key={size}
            variant="ghost"
            className="w-full justify-start"
            onMouseDown={(e) => {
              e.preventDefault();
              handleSizeChange(size);
            }}
          >
            <span style={{ fontSize: size }}>{size}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export const CodeBlockMenu = ({ onClose }) => {
  const editor = useSlate();
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customLanguage, setCustomLanguage] = useState("");

  const languages = [
    "javascript",
    "typescript",
    "python",
    "css",
    "html",
    "json",
    "markdown",
  ];

  const handleSelect = (lang) => {
    const codeBlock: CodeBlockElement = {
      type: ComponentType.CodeBlock,
      language: lang,
      children: [{ text: "" }],
    };
    Transforms.insertNodes(editor, codeBlock);
    onClose();
  };

  const handleCustomSubmit = () => {
    if (customLanguage.trim()) {
      handleSelect(customLanguage.trim().toLowerCase());
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onMouseDown={onClose}
    >
      <div
        className="bg-white rounded-xl p-2 shadow-2xl w-48 animate-in fade-in-0 zoom-in-95"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {!showCustomInput ? (
          <>
            {languages.map((lang) => (
              <Button
                key={lang}
                variant="ghost"
                className="w-full justify-start"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(lang);
                }}
              >
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </Button>
            ))}
            <div className="my-1 border-b border-gray-100" />
            <Button
              variant="ghost"
              className="w-full justify-start"
              onMouseDown={(e) => {
                e.preventDefault();
                setShowCustomInput(true);
              }}
            >
              Other...
            </Button>
          </>
        ) : (
          <div className="p-2">
            <input
              type="text"
              value={customLanguage}
              onChange={(e) => setCustomLanguage(e.target.value)}
              placeholder="Enter language..."
              className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCustomSubmit();
                }
              }}
              autoFocus
            />
            <div className="mt-2 flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setShowCustomInput(false);
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleCustomSubmit();
                }}
                disabled={!customLanguage.trim()}
              >
                Add
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const InsertEmbeddedStoryModal = ({ onClose }) => {
  const editor = useSlate();
  const [storyId, setStoryId] = useState("");
  const [embedType, setEmbedType] = useState<IEmbedType>("inline");

  const insertStory = () => {
    if (!storyId) return;
    const embeddedStory: EmbeddedStoryElement = {
      type: ComponentType.EmbeddedStory,
      storyId,
      embedType,
      children: [{ text: "" }],
    };
    Transforms.insertNodes(editor, embeddedStory);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 shadow-2xl w-96 animate-in fade-in-0 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Embed Story</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <input
          type="text"
          value={storyId}
          onChange={(e) => setStoryId(e.target.value)}
          placeholder="Enter Story ID"
          className="border border-gray-300 p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              insertStory();
            }
          }}
          autoFocus
        />

        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Embed Type</p>
          <div className="flex gap-2">
            <Button
              variant={embedType === "inline" ? "default" : "outline"}
              size="sm"
              onClick={() => setEmbedType("inline")}
            >
              Inline
            </Button>
            <Button
              variant={embedType === "mini" ? "default" : "outline"}
              size="sm"
              onClick={() => setEmbedType("mini")}
            >
              Mini
            </Button>
            <Button
              variant={embedType === "full" ? "default" : "outline"}
              size="sm"
              onClick={() => setEmbedType("full")}
            >
              Full
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onMouseDown={(e) => {
              e.preventDefault();
              insertStory();
            }}
            disabled={!storyId}
          >
            Insert
          </Button>
        </div>
      </div>
    </div>
  );
};

export const InsertMentionModal = ({ onClose }) => {
  const editor = useSlate();
  const [userId, setUserId] = useState("");

  const insertMention = () => {
    if (!userId) return;
    const mention: MentionElement = {
      type: ComponentType.Mention,
      userId,
      children: [{ text: "@" + userId }],
    };
    Transforms.insertNodes(editor, mention);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 shadow-2xl w-96 animate-in fade-in-0 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Insert Mention
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter User ID"
          className="border border-gray-300 p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              insertMention();
            }
          }}
          autoFocus
        />
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onMouseDown={(e) => {
              e.preventDefault();
              insertMention();
            }}
            disabled={!userId}
          >
            Insert
          </Button>
        </div>
      </div>
    </div>
  );
};

// ------------------------
// Custom Code Editor Component (content is not editable by user)
// ------------------------
const CodeEditor = ({ content, language }) => {
  const editorRef = useRef(null);
  const [lineNumbers, setLineNumbers] = useState("");

  useEffect(() => {
    const lines = content.split("\n").length;
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1).join("\n"));
  }, [content]);

  return (
    <div className="relative my-4 rounded-lg shadow-md overflow-hidden min-h-[100px] bg-[#1e1e1e] text-[#d4d4d4] font-mono">
      <div className="bg-[#2d2d2d] px-4 py-2 flex justify-between items-center text-[#9cdcfe] text-sm font-semibold border-b border-[#3e3e3e]">
        <span>{language.toUpperCase()}</span>
      </div>
      <div className="flex">
        <div className="flex-none w-12 text-right p-4 text-[#858585] text-sm leading-relaxed border-r border-[#3e3e3e]">
          <pre className="m-0 p-0 text-right">{lineNumbers}</pre>
        </div>
        <pre className="flex-grow min-h-[100px] p-4 font-mono text-sm resize-none bg-transparent text-[#d4d4d4] outline-none leading-relaxed overflow-auto">
          <code>{content}</code>
        </pre>
      </div>
    </div>
  );
};

// ------------------------
// Toolbar + Renderers
// ------------------------
const ToolbarButton = ({ tool, onOpenModal }) => {
  const editor = useSlate();

  let isActive = false;
  if (tool.category === "mark") isActive = isMarkActive(editor, tool.id);
  if (tool.category === "block") isActive = isBlockActive(editor, tool.id);
  if (tool.category === "align") isActive = isAlignActive(editor, tool.id);

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();

      if (tool.category === "modal" && tool.ModalComponent) {
        onOpenModal(tool.id);
        return;
      }

      const handler = commandDispatch[tool.id];
      if (handler) {
        handler(editor);
      }
    },
    [editor, tool, onOpenModal]
  );

  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      className={`h-9 px-3 rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
      }`}
      onMouseDown={handleClick}
    >
      {tool.ToolBarButton}
    </Button>
  );
};

const Toolbar = ({ groups, tools, onOpenModal }) => {
  if (!groups || !tools) return null;

  return (
    <div className="toolbar flex items-center gap-1 p-3 border-b border-gray-200 bg-white rounded-t-xl shadow-sm overflow-x-auto">
      {groups.map((group, i) => (
        <React.Fragment key={group.group}>
          <div className="flex gap-1 items-center">
            {tools
              .filter((t) => t.group === group.group)
              .map((tool) => (
                <ToolbarButton
                  key={tool.id}
                  tool={tool}
                  onOpenModal={onOpenModal}
                />
              ))}
          </div>
          {group.divider && i < groups.length - 1 && (
            <div className="w-px h-6 bg-gray-300 mx-3" />
          )}
        </React.Fragment>
      ))}
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="h-9 px-3 rounded-lg hover:bg-gray-100"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            {tools.map((tool) => (
              <DropdownMenuItem key={tool.id} asChild>
                <ToolbarButton tool={tool} onOpenModal={onOpenModal} />
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

// ------------------------
// Element & Leaf Renderers
// ------------------------
const renderElementDispatch = {
  [ComponentType.BlockQuote]: ({ attributes, children, element }) => (
    <blockquote
      {...attributes}
      style={{ textAlign: element.align || "left" }}
      className="border-l-4 border-blue-500 pl-6 py-2 italic text-gray-700 bg-gray-50 rounded-r-lg my-4"
    >
      {children}
    </blockquote>
  ),
  [ComponentType.CodeBlock]: ({ attributes, children, element }) => (
    <div
      {...attributes}
      style={{ textAlign: element.align || "left" }}
      contentEditable={false}
    >
      <CodeEditor language={element.language} content={Node.string(element)} />
      {children}
    </div>
  ),
  [ComponentType.Link]: ({ attributes, children, element }) => (
    <a
      {...attributes}
      href={element.url}
      className="text-blue-600 underline hover:text-blue-800 transition-colors"
    >
      {children}
    </a>
  ),
  [ComponentType.Image]: ({ attributes, children, element }) => (
    <div {...attributes} contentEditable={false}>
      <img
        src={element.url}
        alt="User inserted content"
        className="max-w-full my-4 rounded-lg shadow-md"
      />
      {children}
    </div>
  ),
  [ComponentType.Video]: ({ attributes, children, element }) => (
    <div {...attributes} contentEditable={false}>
      <div className="relative w-full aspect-video my-4 rounded-lg overflow-hidden shadow-md">
        <iframe
          src={element.url}
          title="video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
      {children}
    </div>
  ),
  [ComponentType.Table]: ({ attributes, children }) => (
    <div {...attributes} className="my-4 overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
        <tbody>{children}</tbody>
      </table>
    </div>
  ),
  [ComponentType.TableRow]: ({ attributes, children }) => (
    <tr {...attributes}>{children}</tr>
  ),
  [ComponentType.TableCell]: ({ attributes, children }) => (
    <td
      {...attributes}
      className="border border-gray-300 p-3 min-w-[100px] bg-white hover:bg-gray-50 focus-within:bg-blue-50 transition-colors"
    >
      {children}
    </td>
  ),
  [ComponentType.ThematicBreak]: ({ attributes, children }) => (
    <div {...attributes} contentEditable={false} className="my-8">
      <hr className="border-t-2 border-gray-200" />
      {children}
    </div>
  ),
  [ComponentType.HeadingOne]: ({ attributes, children, element }) => (
    <h1
      {...attributes}
      style={{ textAlign: element.align || "left" }}
      className="text-4xl font-bold text-gray-900 mb-4 mt-6"
    >
      {children}
    </h1>
  ),
  [ComponentType.HeadingTwo]: ({ attributes, children, element }) => (
    <h2
      {...attributes}
      style={{ textAlign: element.align || "left" }}
      className="text-3xl font-semibold text-gray-900 mb-3 mt-5"
    >
      {children}
    </h2>
  ),
  [ComponentType.HeadingThree]: ({ attributes, children, element }) => (
    <h3
      {...attributes}
      style={{ textAlign: element.align || "left" }}
      className="text-2xl font-semibold text-gray-900 mb-3 mt-4"
    >
      {children}
    </h3>
  ),
  [ComponentType.HeadingFour]: ({ attributes, children, element }) => (
    <h4
      {...attributes}
      style={{ textAlign: element.align || "left" }}
      className="text-xl font-semibold text-gray-900 mb-2 mt-4"
    >
      {children}
    </h4>
  ),
  [ComponentType.HeadingFive]: ({ attributes, children, element }) => (
    <h5
      {...attributes}
      style={{ textAlign: element.align || "left" }}
      className="text-lg font-semibold text-gray-900 mb-2 mt-3"
    >
      {children}
    </h5>
  ),
  [ComponentType.HeadingSix]: ({ attributes, children, element }) => (
    <h6
      {...attributes}
      style={{ textAlign: element.align || "left" }}
      className="text-base font-semibold text-gray-900 mb-2 mt-3"
    >
      {children}
    </h6>
  ),
  [ComponentType.Paragraph]: ({ attributes, children, element }) => (
    <p
      {...attributes}
      style={{ textAlign: element.align || "left" }}
      className="leading-relaxed mb-3 text-gray-900"
    >
      {children}
    </p>
  ),
  [ComponentType.EmbeddedStory]: ({ attributes, children, element }) => (
    <span
      {...attributes}
      className="inline-block relative my-2 mr-2 py-1 px-3 rounded-md bg-blue-100 text-blue-800 text-sm font-medium leading-none"
      contentEditable={false}
    >
      <span className="opacity-0">{children}</span>
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1">
        <BookOpen className="w-3 h-3 text-blue-500" />
        <span className="text-sm font-medium">
          Story: {element.storyId} ({element.embedType})
        </span>
      </span>
    </span>
  ),
  [ComponentType.Mention]: ({ attributes, children, element }) => (
    <span
      {...attributes}
      className="inline-block relative my-2 mr-2 py-1 px-3 rounded-md bg-blue-100 text-blue-800 text-sm font-medium leading-none"
      contentEditable={false}
    >
      <span className="opacity-0">{children}</span>
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1">
        <AtSign className="w-3 h-3 text-blue-500" />
        <span className="text-sm font-medium">{element.userId}</span>
      </span>
    </span>
  ),
  [ComponentType.Tag]: ({ attributes, children, element }) => (
    <span
      {...attributes}
      className="inline-block relative my-2 mr-2 py-1 px-3 rounded-md bg-gray-200 text-gray-800 text-sm font-medium leading-none"
      contentEditable={false}
    >
      <span className="opacity-0">{children}</span>
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1">
        <Hash className="w-3 h-3 text-gray-500" />
        <span className="text-sm font-medium">{element.tagId}</span>
      </span>
    </span>
  ),
};

const Element = (props) => {
  const { element } = props;
  const renderFn =
    renderElementDispatch[element.type] ||
    renderElementDispatch[ComponentType.Paragraph];
  return renderFn(props);
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf[Mark.Bold])
    children = <strong className="font-semibold">{children}</strong>;
  if (leaf[Mark.Italic]) children = <em>{children}</em>;
  if (leaf[Mark.Strikethrough]) children = <s>{children}</s>;
  if (leaf[Mark.Code])
    children = (
      <code className="bg-gray-100 rounded-md px-2 py-1 font-mono text-sm text-gray-800">
        {children}
      </code>
    );

  if (leaf[InlineStyle.Color]) {
    children = (
      <span style={{ color: leaf[InlineStyle.Color] }}>{children}</span>
    );
  }
  if (leaf[InlineStyle.BackgroundColor]) {
    children = (
      <span style={{ backgroundColor: leaf[InlineStyle.BackgroundColor] }}>
        {children}
      </span>
    );
  }
  if (leaf[InlineStyle.FontSize]) {
    children = (
      <span style={{ fontSize: leaf[InlineStyle.FontSize] }}>{children}</span>
    );
  }

  return <span {...attributes}>{children}</span>;
};

// ------------------------
// Editor
// ------------------------
export function SlateEditor({ toolbarGroups, tools }) {
  const editor = useMemo(() => withReact(createEditor()), []) as CustomEditor;
  const [value, setValue] = useState<Descendant[]>([
    {
      type: ComponentType.Paragraph,
      children: [{ text: "Start typing your content here..." }],
    },
  ]);
  const [activeModal, setActiveModal] = useState(null);

  const onOpenModal = useCallback((modalId) => {
    setActiveModal(modalId);
  }, []);

  const onCloseModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const ActiveModalComponent = useMemo(() => {
    if (!activeModal) return null;
    const tool = tools.find((t) => t.id === activeModal);
    return tool?.ModalComponent;
  }, [activeModal, tools]);

  return (
    <div className="max-w-4xl mx-auto">
      <Slate
        editor={editor}
        initialValue={value}
        onChange={(newValue) => setValue(newValue)}
      >
        <div className="border border-gray-300 rounded-xl shadow-lg bg-white overflow-hidden">
          <Toolbar
            groups={toolbarGroups}
            tools={tools}
            onOpenModal={onOpenModal}
          />
          <Editable
            className="p-6 min-h-[300px] focus:outline-none prose prose-lg max-w-none"
            renderElement={(props) => <Element {...props} />}
            renderLeaf={(props) => <Leaf {...props} />}
            placeholder="Start typing your content here..."
          />
        </div>
        {ActiveModalComponent && (
          <ActiveModalComponent onClose={onCloseModal} />
        )}
      </Slate>
    </div>
  );
}

//=======================
// Example Tools Config
//=======================
export const defaultToolbarGroups = [
  { group: ToolbarGroupId.Marks, label: "Text Marks", divider: true },
  { group: "inline-styles", label: "Inline Styles", divider: true },
  { group: ToolbarGroupId.Headings, label: "Headings", divider: true },
  { group: ToolbarGroupId.Block, label: "Block Types", divider: true },
  { group: ToolbarGroupId.Lists, label: "Lists", divider: true },
  { group: ToolbarGroupId.Align, label: "Alignment", divider: true },
  { group: ToolbarGroupId.Inserts, label: "Inserts", divider: true },
  { group: ToolbarGroupId.Media, label: "Media" },
];

export const defaultTools = [
  // Marks
  {
    id: Mark.Bold,
    ToolBarButton: <Bold className="w-4 h-4" />,
    category: "mark",
    group: ToolbarGroupId.Marks,
  },
  {
    id: Mark.Italic,
    ToolBarButton: <Italic className="w-4 h-4" />,
    category: "mark",
    group: ToolbarGroupId.Marks,
  },
  {
    id: Mark.Strikethrough,
    ToolBarButton: <Strikethrough className="w-4 h-4" />,
    category: "mark",
    group: ToolbarGroupId.Marks,
  },
  {
    id: Mark.Code,
    ToolBarButton: <Code className="w-4 h-4" />,
    category: "mark",
    group: ToolbarGroupId.Marks,
  },

  // Inline Styles
  {
    id: InlineStyle.Color,
    ToolBarButton: <Palette className="w-4 h-4" />,
    category: "modal",
    group: "inline-styles",
    ModalComponent: ColorPickerMenu,
  },
  {
    id: InlineStyle.FontSize,
    ToolBarButton: <Text className="w-4 h-4" />,
    category: "modal",
    group: "inline-styles",
    ModalComponent: FontSizeMenu,
  },

  // Headings
  {
    id: ComponentType.HeadingOne,
    ToolBarButton: <span className="font-bold text-lg">H1</span>,
    category: "block",
    group: ToolbarGroupId.Headings,
  },
  {
    id: ComponentType.HeadingTwo,
    ToolBarButton: <span className="font-bold">H2</span>,
    category: "block",
    group: ToolbarGroupId.Headings,
  },
  {
    id: ComponentType.HeadingThree,
    ToolBarButton: <span className="font-semibold">H3</span>,
    category: "block",
    group: ToolbarGroupId.Headings,
  },
  {
    id: ComponentType.HeadingFour,
    ToolBarButton: <span className="font-medium text-sm">H4</span>,
    category: "block",
    group: ToolbarGroupId.Headings,
  },
  {
    id: ComponentType.HeadingFive,
    ToolBarButton: <span className="font-medium text-xs">H5</span>,
    category: "block",
    group: ToolbarGroupId.Headings,
  },
  {
    id: ComponentType.HeadingSix,
    ToolBarButton: <span className="text-xs">H6</span>,
    category: "block",
    group: ToolbarGroupId.Headings,
  },

  // Blocks
  {
    id: ComponentType.Paragraph,
    ToolBarButton: <Type className="w-4 h-4" />,
    category: "block",
    group: ToolbarGroupId.Block,
  },
  {
    id: ComponentType.BlockQuote,
    ToolBarButton: <Quote className="w-4 h-4" />,
    category: "block",
    group: ToolbarGroupId.Block,
  },
  {
    id: ComponentType.ThematicBreak,
    ToolBarButton: <Minus className="w-4 h-4" />,
    category: "block",
    group: ToolbarGroupId.Block,
  },
  {
    id: ComponentType.CodeBlock,
    ToolBarButton: <Code className="w-4 h-4" />,
    category: "modal",
    group: ToolbarGroupId.Block,
    ModalComponent: CodeBlockMenu,
  },

  // Lists
  {
    id: ComponentType.BulletedList,
    ToolBarButton: <List className="w-4 h-4" />,
    category: "block",
    group: ToolbarGroupId.Lists,
  },
  {
    id: ComponentType.NumberedList,
    ToolBarButton: <ListOrdered className="w-4 h-4" />,
    category: "block",
    group: ToolbarGroupId.Lists,
  },
  {
    id: ComponentType.CheckListItem,
    ToolBarButton: <CheckSquare className="w-4 h-4" />,
    category: "block",
    group: ToolbarGroupId.Lists,
  },

  // Alignment
  {
    id: Alignment.Left,
    ToolBarButton: <AlignLeft className="w-4 h-4" />,
    category: "align",
    group: ToolbarGroupId.Align,
  },
  {
    id: Alignment.Center,
    ToolBarButton: <AlignCenter className="w-4 h-4" />,
    category: "align",
    group: ToolbarGroupId.Align,
  },
  {
    id: Alignment.Right,
    ToolBarButton: <AlignRight className="w-4 h-4" />,
    category: "align",
    group: ToolbarGroupId.Align,
  },
  {
    id: Alignment.Justify,
    ToolBarButton: <AlignJustify className="w-4 h-4" />,
    category: "align",
    group: ToolbarGroupId.Align,
  },

  // Inserts
  {
    id: ComponentType.Link,
    ToolBarButton: <Link className="w-4 h-4" />,
    category: "modal",
    group: ToolbarGroupId.Inserts,
    ModalComponent: InsertLinkModal,
  },
  {
    id: ComponentType.Table,
    ToolBarButton: <Table className="w-4 h-4" />,
    category: "modal",
    group: ToolbarGroupId.Inserts,
    ModalComponent: TableGridModal,
  },
  {
    id: ComponentType.EmbeddedStory,
    ToolBarButton: <BookOpen className="w-4 h-4" />,
    category: "modal",
    group: ToolbarGroupId.Inserts,
    ModalComponent: InsertEmbeddedStoryModal,
  },
  {
    id: ComponentType.Mention,
    ToolBarButton: <AtSign className="w-4 h-4" />,
    category: "modal",
    group: ToolbarGroupId.Inserts,
    ModalComponent: InsertMentionModal,
  },
  {
    id: ComponentType.Tag,
    ToolBarButton: <Hash className="w-4 h-4" />,
    category: "inline",
    group: ToolbarGroupId.Inserts,
    ModalComponent: undefined,
  },

  // Media
  {
    id: ComponentType.Image,
    ToolBarButton: <Image className="w-4 h-4" />,
    category: "modal",
    group: ToolbarGroupId.Media,
    ModalComponent: InsertImageModal,
  },
  {
    id: ComponentType.Video,
    ToolBarButton: <Video className="w-4 h-4" />,
    category: "modal",
    group: ToolbarGroupId.Media,
    ModalComponent: InsertVideoModal,
  },
];

//=======================
export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Modern Slate Editor
        </h1>
        <p className="text-gray-600">
          A rich text editor with table support and modern design
        </p>
      </div>
      <SlateEditor toolbarGroups={defaultToolbarGroups} tools={defaultTools} />
    </div>
  );
}

import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  KeyboardEvent,
} from "react";
import {
  createEditor,
  Descendant,
  Editor,
  Element as SlateElement,
  Text,
  Transforms,
  Range,
  Path,
} from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { withHistory, HistoryEditor } from "slate-history";

import {
  Bold,
  Italic,
  Code,
  FileText,
  Plus,
  Hash,
  Save,
  Quote,
  Heading1,
  Underline as UnderlineIcon,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StoryAutocomplete from "@/components/StoryAutocomplete";
import { Button } from "@/components/ui/button";
import {
  Version,
  EditorVersionControl,
} from "@/components/Editor/EditorVersionControl";
import DialogPostUploadImage from "./DialogPostUploadImage";
import RenderSlateElement, { RenderLeaf } from "./RenderSlateElement";

import {
  IEmbedType,
  CustomText,
  CustomElement,
  ComponentType,
} from "../../common/types/slate";
import {
  deleteImageBackend,
  insertCodeBlock,
  insertEmbeddedStory,
  insertHeadingBlock,
  insertImage,
  insertQuote,
  isMarkActive,
  toggleMark,
  updateHeadingSlugs,
} from "./editorUtils";

// Languages for code blocks
const languages = ["javascript", "typescript", "python", "ruby", "go"];

const initialValue: Descendant[] = [
  {
    type: ComponentType.Paragraph,
    children: [{ text: "" }],
  },
];

interface ContentEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  onStoryEmbed?: (storyId: string) => void;
  placeholder?: string;
  userId: string;
}

export default function ContentEditor({
  value,
  onChange,
  onStoryEmbed,
  placeholder,
  userId,
}: ContentEditorProps) {
  const editor = useMemo(() => {
    let e = withHistory(withReact(createEditor())) as Editor &
      ReactEditor &
      HistoryEditor;

    e.isVoid = (el) =>
      SlateElement.isElement(el) && el.type === ComponentType.Image;
    e.isInline = (el) =>
      SlateElement.isElement(el) && el.type === ComponentType.Image;

    const { insertBreak } = e;
    e.insertBreak = () => {
      const [match] = Editor.nodes(e, {
        match: (n) =>
          SlateElement.isElement(n) && n.type === ComponentType.CodeBlock,
      });
      if (match) Editor.insertText(e, "\n");
      else insertBreak();
    };

    return e;
  }, []);

  const [slateValue, setSlateValue] = useState<Descendant[]>(initialValue);
  const [showEmbeddedStoryDialog, setShowEmbeddedStoryDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [embedStoryId, setEmbedStoryId] = useState("");
  const [embedType, setEmbedType] = useState<IEmbedType>("inline");
  const [versions, setVersions] = useState<Version[]>([]);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  useEffect(() => {
    if (!value) return;
    const lines = value.split("\n");
    const newSlateValue = lines.map((line) => ({
      type: ComponentType.Paragraph,
      children: [{ text: line }],
    }));
    setSlateValue(newSlateValue);
  }, [value]);

  const handleChange = useCallback(
    (newValue: Descendant[]) => {
      setSlateValue(newValue);
      const markdown = newValue
        .map((node) =>
          SlateElement.isElement(node)
            ? node.children.map((c: any) => c.text || "").join("")
            : ""
        )
        .join("\n");
      onChange(markdown);
      updateHeadingSlugs(editor);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { selection } = editor;
      if (!selection) return;

      // Handle Backspace/Delete near image
      if (
        (event.key === "Backspace" || event.key === "Delete") &&
        Range.isCollapsed(selection)
      ) {
        const point =
          event.key === "Backspace"
            ? Editor.before(editor, selection)
            : Editor.after(editor, selection);
        if (point) {
          const [nodeEntry] = Editor.nodes(editor, {
            at: point,
            match: (n) =>
              SlateElement.isElement(n) && n.type === ComponentType.Image,
          });
          if (nodeEntry) {
            event.preventDefault();
            const [node, path] = nodeEntry;
            Transforms.removeNodes(editor, { at: path });
            if ("url" in node && node.url) deleteImageBackend(node.url);
            return;
          }
        }
      }

      // Tab in code block
      const [block] =
        Editor.above(editor, {
          at: selection,
          match: (n) => SlateElement.isElement(n),
        }) || [];
      if (
        event.key === "Tab" &&
        SlateElement.isElement(block) &&
        block.type === ComponentType.CodeBlock
      ) {
        event.preventDefault();
        Transforms.insertText(editor, "    ");
        return;
      }

      // Heading Enter handling
      const [currentTextNode, textPath] = Editor.node(
        editor,
        selection.anchor.path
      );
      const [currentElementNode, elementPath] = Editor.parent(editor, textPath);
      if (
        SlateElement.isElement(currentElementNode) &&
        currentElementNode.type === ComponentType.Heading &&
        event.key === "Enter"
      ) {
        event.preventDefault();
        Transforms.insertNodes(
          editor,
          {
            type: ComponentType.Paragraph,
            children: [{ text: "" }],
          } as Descendant,
          { at: Path.next(elementPath) }
        );
        Transforms.select(editor, Editor.start(editor, Path.next(elementPath)));
        return;
      }

      // Ctrl/Cmd shortcuts
      if ((event.ctrlKey || event.metaKey) && Range.isCollapsed(selection)) {
        switch (event.key.toLowerCase()) {
          case "b":
            event.preventDefault();
            toggleMark(editor, "bold");
            break;
          case "i":
            event.preventDefault();
            toggleMark(editor, "italic");
            break;
          case "u":
            event.preventDefault();
            toggleMark(editor, "underline");
            break;
          case "z":
            event.preventDefault();
            HistoryEditor.undo(editor);
            break;
          case "y":
            event.preventDefault();
            HistoryEditor.redo(editor);
            break;
        }
      }
    },
    [editor, toggleMark]
  );

  const saveVersion = (description: string) => {
    const newVersion: Version = {
      id: Date.now().toString(),
      content: value,
      timestamp: new Date(),
      description,
    };
    setVersions((prev) => [newVersion, ...prev].slice(0, 10));
  };

  const restoreVersion = (version: Version) => {
    onChange(version.content);
  };

  useEffect(() => {
    if (!value) return;
    const autoSaveTimer = setTimeout(() => {
      setIsAutoSaving(true);
      saveVersion(`Auto-save ${new Date().toLocaleTimeString()}`);
      setTimeout(() => setIsAutoSaving(false), 1000);
    }, 5000);
    return () => clearTimeout(autoSaveTimer);
  }, [value]);

  return (
    <>
      <div className="border-b border-border p-2 flex gap-1 flex-wrap justify-between">
        <div className="toolbar flex gap-1 flex-wrap">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={isMarkActive(editor, "bold") ? "bg-accent" : ""}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleMark(editor, "bold");
            }}
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={isMarkActive(editor, "italic") ? "bg-accent" : ""}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleMark(editor, "italic");
            }}
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={isMarkActive(editor, "underline") ? "bg-accent" : ""}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleMark(editor, "underline");
            }}
          >
            <UnderlineIcon className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={isMarkActive(editor, "code") ? "bg-accent" : ""}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleMark(editor, "code");
            }}
          >
            <Code className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault();
              insertCodeBlock(editor);
            }}
          >
            <Hash className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            onMouseDown={(e) => {
              e.preventDefault();
              setShowImageDialog(true);
            }}
          >
            Upload Image
          </Button>
          <Button
            type="button"
            variant="ghost"
            onMouseDown={(e) => {
              e.preventDefault();
              insertQuote(editor);
            }}
          >
            <Quote className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            onMouseDown={(e) => {
              e.preventDefault();
              insertHeadingBlock(editor);
            }}
          >
            <Heading1 className="w-4 h-4" />
          </Button>

          <Dialog
            open={showEmbeddedStoryDialog}
            onOpenChange={setShowEmbeddedStoryDialog}
          >
            <DialogTrigger asChild>
              <Button type="button" variant="ghost" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Embed Story</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Select Story</label>
                  <StoryAutocomplete
                    onSelect={setEmbedStoryId}
                    placeholder="Search and select a story to embed..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Display Type</label>
                  <Select
                    value={embedType}
                    onValueChange={(value: IEmbedType) => setEmbedType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mini">Mini Card</SelectItem>
                      <SelectItem value="inline">Inline Preview</SelectItem>
                      <SelectItem value="full">Full Content</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => {
                    setShowEmbeddedStoryDialog(false);
                    setEmbedStoryId("");
                    onStoryEmbed?.(embedStoryId);
                    insertEmbeddedStory(editor, embedStoryId, embedType);
                  }}
                  className="w-full"
                  disabled={!embedStoryId}
                >
                  Insert Embed
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <DialogPostUploadImage
            cropMode="flex"
            isOpen={showImageDialog}
            onClose={() => setShowImageDialog(false)}
            insertImage={(url) => {
              insertImage(editor, url);
            }}
            userId={userId}
          />
        </div>

        <div className="flex items-center gap-2">
          <EditorVersionControl
            versions={versions}
            currentVersion={value}
            onRestore={restoreVersion}
            onSaveVersion={saveVersion}
          />
          {isAutoSaving && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Save className="w-3 h-3 animate-spin" /> Saving...
            </div>
          )}
        </div>
      </div>

      <div className="p-3">
        <Slate
          editor={editor}
          initialValue={slateValue}
          onChange={handleChange}
        >
          <Editable
            renderElement={(props) => (
              <RenderSlateElement
                {...props}
                editor={editor}
                viewMode="editor"
              />
            )}
            renderLeaf={(props) => <RenderLeaf {...props} />}
            placeholder={placeholder}
            className="min-h-[300px] text-base leading-relaxed outline-none"
            spellCheck
            onKeyDown={handleKeyDown}
          />
        </Slate>
      </div>
    </>
  );
}

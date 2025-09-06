import React, { useMemo, useCallback, useEffect, KeyboardEvent } from "react";
import {
  createEditor,
  Descendant,
  Editor,
  Element as SlateElement,
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
  Hash,
  Quote,
  Heading1,
  Underline as UnderlineIcon,
  Image as ImageIcon,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import StoryAutocomplete from "@/components/StoryAutocomplete";
import DialogPostUploadImage from "./DialogPostUploadImage";
import RenderSlateElement, { RenderLeaf } from "./RenderSlateElement";

import {
  IEmbedType,
  ComponentType,
} from "../../common/types/slate";
import {
  insertCodeBlock,
  insertEmbeddedStory,
  insertHeadingBlock,
  insertImage,
  insertQuote,
  isMarkActive,
  toggleMark,
  updateHeadingSlugs,
  createCustomEditor,
} from "./editorUtils";

interface SlateEditorCoreProps {
  value: Descendant[];
  onChange: (value: Descendant[]) => void;
  placeholder?: string;
  userId: string;
}

export default function SlateEditorCore({
  value,
  onChange,
  placeholder = "Start writing your story...",
  userId,
}: SlateEditorCoreProps) {
  const editor = useMemo(() => createCustomEditor(), []);
  
  const [showEmbeddedStoryDialog, setShowEmbeddedStoryDialog] = React.useState(false);
  const [showImageDialog, setShowImageDialog] = React.useState(false);
  const [embedStoryId, setEmbedStoryId] = React.useState("");
  const [embedType, setEmbedType] = React.useState<IEmbedType>("inline");

  const handleChange = useCallback(
    (newValue: Descendant[]) => {
      onChange(newValue);
      updateHeadingSlugs(editor);
    },
    [onChange, editor]
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
            Transforms.removeNodes(editor, { at: nodeEntry[1] });
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
      if (event.key === "Enter") {
        const [currentTextNode, textPath] = Editor.node(
          editor,
          selection.anchor.path
        );
        const [currentElementNode, elementPath] = Editor.parent(editor, textPath);
        if (
          SlateElement.isElement(currentElementNode) &&
          currentElementNode.type === ComponentType.Heading
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
            if (event.shiftKey) {
              HistoryEditor.redo(editor);
            } else {
              HistoryEditor.undo(editor);
            }
            break;
          case "y":
            event.preventDefault();
            HistoryEditor.redo(editor);
            break;
        }
      }
    },
    [editor]
  );

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="border-b border-border p-2 flex gap-1 flex-wrap">
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
            insertHeadingBlock(editor);
          }}
        >
          <Heading1 className="w-4 h-4" />
        </Button>
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
          size="sm"
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
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            setShowImageDialog(true);
          }}
        >
          <ImageIcon className="w-4 h-4" />
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

      {/* Editor */}
      <div className="flex-1 p-4">
        <Slate
          key={JSON.stringify(value)} // Force re-render when value changes
          editor={editor}
          initialValue={value}
          onValueChange={handleChange}
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
    </div>
  );
}
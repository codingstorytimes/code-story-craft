import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { createEditor, Descendant } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  FileText,
  Save,
  Settings,
  Undo,
  Redo,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

import SlateEditorCore from "./SlateEditorCore";
import { serialize, deserialize } from "../SlateMarkdown/slate-markdown";
import { RichTextViewer } from "../RichTextViewer";
import { Store } from "../../common/store";
import { ComponentType } from "./slate";
import { ICodingStory } from "../../common/types/types";

type EditorMode = "editor" | "source" | "preview";

interface StoryEditorProps {
  story?: ICodingStory;
  onChange: (content: string) => void;
  userId: string;
}

const initialValue: Descendant[] = [
  {
    type: ComponentType.Paragraph,
    children: [{ text: "" }],
  },
];

export default function StoryEditor({
  story,
  onChange,
  userId,
}: StoryEditorProps) {
  const [mode, setMode] = useState<EditorMode>("editor");
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Canonical source of truth: Markdown content
  const [markdownContent, setMarkdownContent] = useState(story?.content || "");

  // Slate value derived from markdown (with error handling)
  const [slateValue, setSlateValue] = useState<Descendant[]>(initialValue);

  // Debounce timer ref for source mode updates
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  // Store for persistence
  const store = useMemo(
    () =>
      new Store({
        key: `story-${story?.id || "draft"}`,
        defaults: { content: "", versions: [] },
      }),
    [story?.id]
  );

  // Sync Slate value with markdown content
  const syncSlateFromMarkdown = useCallback((markdown: string) => {
    try {
      const newSlateValue = markdown ? deserialize(markdown) : slateValue;
      setSlateValue(newSlateValue);
      setParseError(null);
      return true;
    } catch (error) {
      console.error("Error parsing markdown:", error);
      setParseError(
        error instanceof Error ? error.message : "Invalid markdown syntax"
      );
      return false;
    }
  }, []);

  // Update markdown from Slate value
  const syncMarkdownFromSlate = useCallback(
    (slateNodes: Descendant[]) => {
      try {
        const newMarkdown = serialize(slateNodes);
        setMarkdownContent(newMarkdown);
        onChange(newMarkdown);
        setParseError(null);
      } catch (error) {
        console.error("Error serializing slate to markdown:", error);
      }
    },
    [onChange]
  );

  // Load saved content on mount
  useEffect(() => {
    if (!story?.content) {
      const saved = store.get("content", "");
      if (saved) {
        setMarkdownContent(saved);
        syncSlateFromMarkdown(saved);
        onChange(saved);
      }
    } else {
      setMarkdownContent(story.content);
      syncSlateFromMarkdown(story.content);
    }
  }, [story?.content, store, onChange, syncSlateFromMarkdown]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !markdownContent) return;

    const timer = setTimeout(() => {
      store.patch({
        content: markdownContent,
        lastSaved: new Date().toISOString(),
      });
      setLastSaved(new Date());
    }, 2000);

    return () => clearTimeout(timer);
  }, [markdownContent, autoSave, store]);

  // Handle editor mode content changes (from Slate)
  const handleSlateChange = useCallback(
    (newSlateValue: Descendant[]) => {
      if (isUpdating) return; // Prevent loops during sync

      setSlateValue(newSlateValue);
      syncMarkdownFromSlate(newSlateValue);
    },
    [syncMarkdownFromSlate, isUpdating]
  );

  // Handle source mode content changes (from textarea with debouncing)
  const handleMarkdownChange = useCallback(
    (newMarkdown: string) => {
      setMarkdownContent(newMarkdown);
      onChange(newMarkdown);

      // Clear existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Debounce the slate sync to avoid excessive parsing
      debounceTimerRef.current = setTimeout(() => {
        setIsUpdating(true);
        syncSlateFromMarkdown(newMarkdown);
        setIsUpdating(false);
      }, 500); // 500ms debounce
    },
    [onChange, syncSlateFromMarkdown]
  );

  // Handle manual save
  const handleManualSave = useCallback(() => {
    const version = {
      id: Date.now().toString(),
      content: markdownContent,
      timestamp: new Date().toISOString(),
      description: `Manual save ${new Date().toLocaleTimeString()}`,
    };

    const versions = store.get("versions", []);
    store.patch({
      content: markdownContent,
      versions: [version, ...versions].slice(0, 10),
      lastSaved: new Date().toISOString(),
    });
    setLastSaved(new Date());
  }, [markdownContent, store]);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Editor Header */}
      <div className="border-b border-border p-2 flex items-center justify-between">
        <Tabs
          value={mode}
          onValueChange={(value) => setMode(value as EditorMode)}
        >
          <TabsList className="grid w-fit grid-cols-3">
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="source" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Source
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Toggle
            pressed={autoSave}
            onPressedChange={setAutoSave}
            size="sm"
            className="text-xs"
          >
            Auto-save
          </Toggle>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleManualSave}
            className="flex items-center gap-1"
          >
            <Save className="w-4 h-4" />
            Save
          </Button>

          {lastSaved && (
            <span className="text-xs text-muted-foreground">
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Parse Error Alert */}
      {parseError && (
        <Alert variant="destructive" className="mx-4 mt-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Markdown parse error: {parseError}
          </AlertDescription>
        </Alert>
      )}

      {/* Editor Content */}
      <div className="flex-1 overflow-hidden">
        {mode === "editor" && (
          <SlateEditorCore
            value={slateValue}
            onChange={handleSlateChange}
            placeholder="Start writing your story..."
            userId={userId}
          />
        )}

        {mode === "source" && (
          <div className="h-full p-4 space-y-2">
            {parseError && (
              <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4" />
                Fix syntax errors to sync with editor
              </div>
            )}
            <Textarea
              value={markdownContent}
              onChange={(e) => handleMarkdownChange(e.target.value)}
              placeholder="# Your story in Markdown

Write your story using Markdown syntax...

## Examples:
- **Bold text**
- *Italic text*
- `Code snippets`
- > Blockquotes
- [Links](url)
- ![Images](url)"
              className="h-full resize-none font-mono text-sm"
            />
          </div>
        )}

        {mode === "preview" && (
          <div className="h-full overflow-auto p-4">
            <div className="max-w-4xl mx-auto">
              <RichTextViewer content={markdownContent} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

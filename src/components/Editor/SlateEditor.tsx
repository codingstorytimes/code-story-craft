import React, { useState, useMemo, useCallback, useEffect } from "react";
import { createEditor, Descendant } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { 
  Eye, 
  FileText, 
  Save, 
  Settings,
  Undo,
  Redo
} from "lucide-react";

import ContentEditor from "./ContentEditor";
import { serialize, deserialize } from "../SlateMarkdown/slate-markdown";
import { RichTextViewer } from "../RichTextViewer";
import { Store } from "../../common/store";
import { ComponentType } from "../../common/types/slate";
import { ICodingStory } from "../../common/types/types";

type EditorMode = "editor" | "source" | "preview";

interface SlateEditorProps {
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

export default function SlateEditor({ story, onChange, userId }: SlateEditorProps) {
  const [mode, setMode] = useState<EditorMode>("editor");
  const [content, setContent] = useState(story?.content || "");
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Store for persistence
  const store = useMemo(() => new Store({
    key: `story-${story?.id || 'draft'}`,
    defaults: { content: "", versions: [] }
  }), [story?.id]);

  // Load saved content on mount
  useEffect(() => {
    if (!story?.content) {
      const saved = store.get('content', '');
      if (saved) {
        setContent(saved);
        onChange(saved);
      }
    }
  }, [story?.content, store, onChange]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !content) return;
    
    const timer = setTimeout(() => {
      store.patch({ content, lastSaved: new Date().toISOString() });
      setLastSaved(new Date());
    }, 2000);

    return () => clearTimeout(timer);
  }, [content, autoSave, store]);

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    onChange(newContent);
  }, [onChange]);

  const handleManualSave = useCallback(() => {
    const version = {
      id: Date.now().toString(),
      content,
      timestamp: new Date().toISOString(),
      description: `Manual save ${new Date().toLocaleTimeString()}`
    };
    
    const versions = store.get('versions', []);
    store.patch({ 
      content, 
      versions: [version, ...versions].slice(0, 10),
      lastSaved: new Date().toISOString()
    });
    setLastSaved(new Date());
  }, [content, store]);

  const slateValue = useMemo(() => {
    if (!content) return initialValue;
    try {
      return deserialize(content);
    } catch {
      return initialValue;
    }
  }, [content]);

  return (
    <div className="flex flex-col h-full">
      {/* Editor Header */}
      <div className="border-b border-border p-2 flex items-center justify-between">
        <Tabs value={mode} onValueChange={(value) => setMode(value as EditorMode)}>
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

      {/* Editor Content */}
      <div className="flex-1 overflow-hidden">
        {mode === "editor" && (
          <ContentEditor
            value={content}
            onChange={handleContentChange}
            placeholder="Start writing your story..."
            userId={userId}
          />
        )}

        {mode === "source" && (
          <div className="h-full p-4">
            <Textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="# Your story in Markdown

Write your story using Markdown syntax..."
              className="h-full resize-none font-mono text-sm"
            />
          </div>
        )}

        {mode === "preview" && (
          <div className="h-full overflow-auto p-4">
            <div className="max-w-4xl mx-auto">
              <RichTextViewer content={content} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
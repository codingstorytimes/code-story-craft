import { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { createEditor, Descendant, Element, Text, Transforms, Editor, Range } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { withHistory } from 'slate-history';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bold, Italic, Code, Link, FileText, Plus, Hash, Eye, History, Save } from "lucide-react";
import StoryAutocomplete from "@/components/StoryAutocomplete";
import StoryPreview from "@/components/StoryPreview";
import EditorVersionControl from "@/components/EditorVersionControl";

interface Version {
  id: string;
  content: string;
  timestamp: Date;
  description: string;
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onStoryEmbed?: (storyId: string) => void;
  title?: string;
  category?: string;
  storyType?: string;
  tags?: string[];
  authorName?: string;
}

// Custom types
type CustomElement = {
  type: 'paragraph' | 'code-block' | 'heading' | 'link' | 'embed';
  children: CustomText[];
  language?: string;
  url?: string;
  storyId?: string;
  embedType?: 'mini' | 'inline' | 'full';
};

type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: any;
    Element: CustomElement;
    Text: CustomText;
  }
}

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  } as CustomElement,
];

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder, 
  className, 
  onStoryEmbed,
  title = "",
  category = "",
  storyType = "",
  tags = [],
  authorName = "Anonymous"
}: RichTextEditorProps) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [slateValue, setSlateValue] = useState<Descendant[]>(initialValue);
  const [showEmbedDialog, setShowEmbedDialog] = useState(false);
  const [embedStoryId, setEmbedStoryId] = useState("");
  const [embedType, setEmbedType] = useState<'mini' | 'inline' | 'full'>('inline');
  const [versions, setVersions] = useState<Version[]>([]);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  const handleChange = useCallback((newValue: Descendant[]) => {
    setSlateValue(newValue);
    // Convert to markdown
    const markdown = newValue.map(node => {
      if (Element.isElement(node)) {
        const text = node.children.map((child: any) => child.text || '').join('');
        return text;
      }
      return '';
    }).join('\n');
    onChange(markdown);
  }, [onChange]);

  const toggleMark = (format: string) => {
    const isActive = isMarkActive(editor, format);
    if (isActive) {
      editor.removeMark(format);
    } else {
      editor.addMark(format, true);
    }
  };

  const isMarkActive = (editor: any, format: string) => {
    const marks = editor.getMarks();
    return marks ? marks[format] === true : false;
  };

  const insertCodeBlock = () => {
    const codeBlock: CustomElement = {
      type: 'code-block',
      language: 'javascript',
      children: [{ text: '// Your code here' }],
    };
    Transforms.insertNodes(editor, codeBlock);
    Transforms.insertNodes(editor, { type: 'paragraph', children: [{ text: '' }] } as CustomElement);
  };

  const insertEmbed = () => {
    if (!embedStoryId) return;
    
    const embedBlock: CustomElement = {
      type: 'embed',
      storyId: embedStoryId,
      embedType: embedType,
      children: [{ text: '' }],
    };
    
    Transforms.insertNodes(editor, embedBlock);
    Transforms.insertNodes(editor, { type: 'paragraph', children: [{ text: '' }] } as CustomElement);
    
    setShowEmbedDialog(false);
    setEmbedStoryId("");
    onStoryEmbed?.(embedStoryId);
  };

  const handleStorySelect = (storyId: string, storyTitle: string) => {
    setEmbedStoryId(storyId);
  };

  const saveVersion = (description: string) => {
    const newVersion: Version = {
      id: Date.now().toString(),
      content: value,
      timestamp: new Date(),
      description,
    };
    setVersions(prev => [newVersion, ...prev].slice(0, 10)); // Keep last 10 versions
  };

  const restoreVersion = (version: Version) => {
    onChange(version.content);
    // Convert string content back to slate format
    const newSlateValue = value.split('\n').map(line => ({
      type: 'paragraph' as const,
      children: [{ text: line }],
    }));
    setSlateValue(newSlateValue);
  };

  // Auto-save functionality
  useEffect(() => {
    if (!value) return;
    
    const autoSaveTimer = setTimeout(() => {
      setIsAutoSaving(true);
      saveVersion(`Auto-save ${new Date().toLocaleTimeString()}`);
      setTimeout(() => setIsAutoSaving(false), 1000);
    }, 5000); // Auto-save every 5 seconds

    return () => clearTimeout(autoSaveTimer);
  }, [value]);

  const renderElement = useCallback((props: any) => {
    switch (props.element.type) {
      case 'code-block':
        return (
          <div {...props.attributes} className="relative">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className={`language-${props.element.language || 'javascript'}`}>
                {props.children}
              </code>
            </pre>
          </div>
        );
      case 'heading':
        return <h2 {...props.attributes} className="text-2xl font-bold mt-6 mb-4">{props.children}</h2>;
      case 'embed':
        return (
          <div {...props.attributes} className="bg-accent/50 border border-border rounded-lg p-4 my-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <FileText className="w-4 h-4" />
              Embedded Story: {props.element.storyId} ({props.element.embedType})
            </div>
            {props.children}
          </div>
        );
      default:
        return <p {...props.attributes}>{props.children}</p>;
    }
  }, []);

  const renderLeaf = useCallback((props: any) => {
    let children = props.children;

    if (props.leaf.bold) {
      children = <strong>{children}</strong>;
    }

    if (props.leaf.italic) {
      children = <em>{children}</em>;
    }

    if (props.leaf.code) {
      children = <code className="bg-muted px-1 rounded font-mono text-sm">{children}</code>;
    }

    return <span {...props.attributes}>{children}</span>;
  }, []);

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'write' | 'preview')} className={className}>
      <div className="border border-border rounded-md">
      {/* Tab Headers */}
      <TabsList className="grid w-full grid-cols-2 mb-0">
        <TabsTrigger value="write" className="flex items-center gap-2">
          <Hash className="w-4 h-4" />
          Write
        </TabsTrigger>
        <TabsTrigger value="preview" className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Preview
        </TabsTrigger>
      </TabsList>

      <TabsContent value="write" className="mt-0">
        {/* Toolbar */}
        <div className="border-b border-border p-2 flex gap-1 flex-wrap justify-between">
          <div className="flex gap-1 flex-wrap">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={isMarkActive(editor, 'bold') ? 'bg-accent' : ''}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark('bold');
          }}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={isMarkActive(editor, 'italic') ? 'bg-accent' : ''}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark('italic');
          }}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={isMarkActive(editor, 'code') ? 'bg-accent' : ''}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark('code');
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
            insertCodeBlock();
          }}
        >
          <Hash className="w-4 h-4" />
        </Button>
        
            <Dialog open={showEmbedDialog} onOpenChange={setShowEmbedDialog}>
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
                      onSelect={handleStorySelect}
                      placeholder="Search and select a story to embed..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Display Type</label>
                    <Select value={embedType} onValueChange={(value: 'mini' | 'inline' | 'full') => setEmbedType(value)}>
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
                  <Button onClick={insertEmbed} className="w-full" disabled={!embedStoryId}>
                    Insert Embed
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Version Control */}
          <div className="flex items-center gap-2">
            <EditorVersionControl
              versions={versions}
              currentVersion={value}
              onRestore={restoreVersion}
              onSaveVersion={saveVersion}
            />
            {isAutoSaving && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Save className="w-3 h-3 animate-spin" />
                Saving...
              </div>
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="p-3">
          <Slate editor={editor} initialValue={slateValue} onChange={handleChange}>
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder={placeholder}
              className="min-h-[300px] text-base leading-relaxed outline-none"
              spellCheck
            />
          </Slate>
        </div>
      </TabsContent>

      <TabsContent value="preview" className="mt-0">
        <div className="p-4 border-t">
          {title || category || storyType || tags.length > 0 ? (
            <StoryPreview
              title={title || "Untitled Story"}
              content={value}
              category={category || "Uncategorized"}
              storyType={storyType || "Story"}
              tags={tags}
              readTime="5 min read"
              authorName={authorName}
            />
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Add a title and content to see the preview</p>
            </div>
          )}
        </div>
      </TabsContent>
      </div>
    </Tabs>
  );
}
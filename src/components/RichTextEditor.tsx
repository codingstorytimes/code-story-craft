import { useCallback, useMemo, useState, useRef } from 'react';
import { createEditor, Descendant, Element, Text, Transforms, Editor, Range } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { withHistory } from 'slate-history';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bold, Italic, Code, Link, FileText, Plus, Hash } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onStoryEmbed?: (storyId: string) => void;
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

export default function RichTextEditor({ value, onChange, placeholder, className, onStoryEmbed }: RichTextEditorProps) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [slateValue, setSlateValue] = useState<Descendant[]>(initialValue);
  const [showEmbedDialog, setShowEmbedDialog] = useState(false);
  const [embedStoryId, setEmbedStoryId] = useState("");
  const [embedType, setEmbedType] = useState<'mini' | 'inline' | 'full'>('inline');

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
    <div className={`border border-border rounded-md ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-border p-2 flex gap-1 flex-wrap">
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
                <label className="text-sm font-medium">Story ID</label>
                <Input
                  value={embedStoryId}
                  onChange={(e) => setEmbedStoryId(e.target.value)}
                  placeholder="Enter story ID to embed..."
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
              <Button onClick={insertEmbed} className="w-full">
                Insert Embed
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
    </div>
  );
}
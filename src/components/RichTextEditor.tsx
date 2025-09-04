import { useCallback, useMemo, useState } from 'react';
import { createEditor, Descendant, Element, Text } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { Button } from "@/components/ui/button";
import { Bold, Italic, Code } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Custom types
type CustomElement = {
  type: 'paragraph' | 'code' | 'heading';
  children: CustomText[];
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

export default function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [slateValue, setSlateValue] = useState<Descendant[]>(initialValue);

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

  const renderElement = useCallback((props: any) => {
    return <p {...props.attributes}>{props.children}</p>;
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
      <div className="border-b border-border p-2 flex gap-1">
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
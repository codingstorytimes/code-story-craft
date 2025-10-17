import { Editor, Transforms, Element as SlateElement } from "slate";
import {
  ComponentType,
  CustomEditor,
  RenderSlateElementProps,
} from "../../slate";

import {
  RenderCodeBlockElement,
  RenderCodeBlockLineElement,
} from "../../Elements/CodeBlock/CodeBlockElement";

// -----------------------------
// withCodeBlock plugin
// -----------------------------

export const withCodeBlock = (editor: CustomEditor) => {
  const { insertBreak, onKeyDown } = editor;

  if (typeof editor.registerElement === "function") {
    editor.registerElement({
      type: ComponentType.CodeBlock,
      render: (props: RenderSlateElementProps & { editor: CustomEditor }) => (
        <RenderCodeBlockElement {...props} editor={props.editor} />
      ),
    });

    editor.registerElement({
      type: ComponentType.CodeBlockLine,
      render: (props: RenderSlateElementProps & { editor: CustomEditor }) => (
        <RenderCodeBlockLineElement {...props} editor={props.editor} />
      ),
    });
  }

  editor.insertBreak = () => {
    const [codeBlock] = Editor.nodes(editor, {
      match: (n) =>
        SlateElement.isElement(n) &&
        (n as any).type === ComponentType.CodeBlock,
    });
    if (codeBlock) {
      Transforms.insertNodes(editor, {
        type: ComponentType.CodeBlockLine,
        children: [{ text: "" }],
      });
      return;
    }
    insertBreak();
  };

  editor.onKeyDown = (event) => {
    const { selection } = editor;
    if (!selection) return;

    // Tab in code block
    const blockEntry = Editor.above(editor, {
      at: selection,
      match: (n) => SlateElement.isElement(n),
    });

    if (
      event.key === "Tab" &&
      blockEntry &&
      SlateElement.isElement(blockEntry[0]) &&
      (blockEntry[0] as any).type === ComponentType.CodeBlock
    ) {
      event.preventDefault();
      Transforms.insertText(editor, "    ");
      return;
    }
    if (onKeyDown) onKeyDown(event);
  };
  return editor;
};

// -----------------------------
// Initial value
// -----------------------------

/*

function ToolbarButton(props: any) {
  const { onClick, active = false, children } = props;
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`px-3 py-2 rounded-md ${
        active
          ? "bg-blue-600 text-white"
          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
      } mr-2`}
    >
      {children}
    </button>
  );
}

function Toolbar(props: any) {
  const { editor } = props;
  return (
    <div className="mb-4 flex items-center p-2 rounded-lg bg-white shadow-md">
      <ToolbarButton
        onClick={() => toggleMark(editor, Mark.Bold)}
        active={isMarkActive(editor, Mark.Bold)}
      >
        B
      </ToolbarButton>
      <ToolbarButton
        onClick={() => toggleMark(editor, Mark.Italic)}
        active={isMarkActive(editor, Mark.Italic)}
      >
        I
      </ToolbarButton>
      <ToolbarButton
        onClick={() => toggleMark(editor, Mark.Underline)}
        active={isMarkActive(editor, Mark.Underline)}
      >
        U
      </ToolbarButton>
    </div>
  );
}

const initialValue: CustomElement[] = [
  {
    type: ComponentType.Paragraph,
    children: [
      { text: "This is a rich text editor with syntax highlighting." },
    ],
  },
  {
    type: ComponentType.CodeBlock,
    language: "javascript",
    children: [
      {
        type: ComponentType.CodeBlockLine,
        children: [{ text: 'const greeting = "Hello, world!";' }],
      },
      {
        type: ComponentType.CodeBlockLine,
        children: [{ text: "console.log(greeting);" }],
      },
    ],
  },
  { type: ComponentType.Paragraph, children: [{ text: "" }] },
  {
    type: ComponentType.CodeBlock,
    language: "javascript",
    children: [
      {
        type: ComponentType.CodeBlockLine,
        children: [{ text: "const x = 42;" }],
      },
      {
        type: ComponentType.CodeBlockLine,
        children: [{ text: "console.log(x);" }],
      },
    ],
  },
  {
    type: ComponentType.CodeBlock,
    language: "python",
    children: [
      {
        type: ComponentType.CodeBlockLine,
        children: [{ text: "def greet(name):" }],
      },
      {
        type: ComponentType.CodeBlockLine,
        children: [{ text: "    print('hello', name)" }],
      },
    ],
  },
];
// -----------------------------
// Main Editor Component
// -----------------------------
export default function RichTextEditor() {
  const editor = useMemo(
    () => withCodeBlock(withHistory(withReact(createEditor()))),
    []
  );
  const [value, setValue] = useState<CustomElement[]>(initialValue);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "b") {
        event.preventDefault();
        toggleMark(editor, ComponentType.Bold);
      }
    },
    [editor]
  );

  const renderElement = useCallback(
    ({ attributes, children, element }: any) => {
      switch (element.type) {
        case ComponentType.CodeBlock:
          return (
            <RenderCodeBlockElement
              attributes={attributes}
              children={children}
              element={element}
            />
          );
        case ComponentType.CodeBlockLine:
          return (
            <RenderCodeBlockLineElement
              attributes={attributes}
              children={children}
            />
          );
        case ComponentType.CodeBlockInline:
          return (
            <RenderCodeBlockInlineElement
              attributes={attributes}
              children={children}
            />
          );
        default:
          return <p {...attributes}>{children}</p>;
      }
    },
    []
  );

  const renderLeaf = useCallback(({ attributes, children, leaf }: any) => {
    if (leaf.bold) children = <strong>{children}</strong>;
    if (leaf.italic) children = <em>{children}</em>;
    if (leaf.underline) children = <u>{children}</u>;
    if (leaf.className)
      children = <span className={leaf.className}>{children}</span>;
    return <span {...attributes}>{children}</span>;
  }, []);

  return (
    <div className="p-8 border-2 border-gray-200 rounded-xl bg-gray-50 shadow-lg">
      <Slate
        editor={editor}
        initialValue={value}
        onChange={(newValue) => setValue(newValue as CustomElement[])}
      >
        <Toolbar editor={editor} />
        <Editable
          decorate={decorateCodeBlock}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={handleKeyDown}
          placeholder="Enter some text..."
          className="min-h-[300px] border border-gray-300 rounded-md p-4 bg-white"
        />
      </Slate>
    </div>
  );
}
*/

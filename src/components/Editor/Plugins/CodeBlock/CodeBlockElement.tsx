import { Editor, Transforms, Element as SlateElement, Text } from "slate";
import { useSlateStatic, ReactEditor } from "slate-react";

import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import CreatableSelect from "react-select/creatable";
import { isBlockActive } from "../../editorUtils";
import { ComponentType, CustomEditor } from "../../slate";
import { FileCode2 } from "lucide-react";
import { ToolbarButton } from "../../Toolbar/ToolbarButton";

export type ParagraphElement = {
  type: ComponentType.Paragraph;
  children: Text[];
};
export type CodeBlockLineElement = {
  type: ComponentType.CodeBlockLine;
  children: Text[];
};
export type CodeBlockElement = {
  type: ComponentType.CodeBlock;
  language?: string;
  children: CodeBlockLineElement[];
};

export type CustomElement = ParagraphElement | CodeBlockElement;

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  className?: string;
};

// -----------------------------
// Helpers
// -----------------------------

const toggleCodeBlock = (editor: Editor, language: string = "javascript") => {
  const isActive = isBlockActive(editor, ComponentType.CodeBlock);
  if (isActive) {
    Transforms.unwrapNodes(editor, {
      match: (n) =>
        SlateElement.isElement(n) &&
        (n as any).type === ComponentType.CodeBlock,
    });
  } else {
    const codeBlock: CodeBlockElement = {
      type: ComponentType.CodeBlock,
      language,
      children: [
        { type: ComponentType.CodeBlockLine, children: [{ text: "" }] },
      ],
    };
    Transforms.wrapNodes(editor, codeBlock, { split: true });
  }
};

// -----------------------------
// Decorator (highlight.js)
// -----------------------------
export function decorateCodeBlock(entry: any) {
  const ranges: any[] = [];
  const node = entry[0];
  const path = entry[1];

  if (SlateElement.isElement(node) && node.type === ComponentType.CodeBlock) {
    const language = node.language || "javascript";

    node.children.forEach((lineNode: any, i: number) => {
      const text = lineNode.children.map((c: any) => c.text).join("");
      if (!text) return;

      try {
        const hasLang =
          typeof (hljs as any).getLanguage === "function"
            ? !!(hljs as any).getLanguage(language)
            : false;
        const highlighted = hasLang
          ? (hljs as any).highlight(text, { language })
          : (hljs as any).highlightAuto(text);

        const parser = new DOMParser();
        const doc = parser.parseFromString(highlighted.value, "text/html");

        let offset = 0;
        const basePath = [...path, i, 0];

        const walk = (domNode: ChildNode) => {
          if (domNode.nodeType === 3) {
            const content = domNode.textContent || "";
            if (content.length > 0) {
              const className = domNode.parentElement?.className || "";
              ranges.push({
                anchor: { path: basePath, offset },
                focus: { path: basePath, offset: offset + content.length },
                className,
              });
              offset += content.length;
            }
          } else if (domNode.nodeType === 1) {
            domNode.childNodes.forEach(walk);
          }
        };

        doc.body.childNodes.forEach(walk);

        if (
          !ranges.some(
            (r) =>
              r.anchor &&
              JSON.stringify(r.anchor.path) === JSON.stringify(basePath)
          )
        ) {
          ranges.push({
            anchor: { path: basePath, offset: 0 },
            focus: { path: basePath, offset: text.length },
          });
        }
      } catch (err) {
        ranges.push({
          anchor: { path: [...path, i, 0], offset: 0 },
          focus: { path: [...path, i, 0], offset: text.length },
        });
      }
    });
  }

  return ranges;
}

// -----------------------------
// Renderers
// -----------------------------
export function RenderCodeBlockElement(props: any) {
  const { attributes, children, element } = props;
  const editor = useSlateStatic();

  const languages = hljs.listLanguages().slice().sort();
  const options = [
    { value: "", label: "Auto-detect" },
    ...languages.map((l) => ({ value: l, label: l })),
  ];

  const applyLanguageToNode = (lang: string | null) => {
    Transforms.setNodes(
      editor,
      { language: lang || undefined },
      { at: ReactEditor.findPath(editor, element) }
    );
  };

  return (
    <div
      {...attributes}
      className="relative rounded-md bg-gray-100 p-2 pt-8 my-2"
    >
      <div
        contentEditable={false}
        className="language-picker absolute right-2 top-2 w-48"
      >
        <CreatableSelect
          isClearable
          menuPortalTarget={document.body}
          styles={{
            control: (base) => ({
              ...base,
              minHeight: "28px",
              backgroundColor: "#111827",
              borderColor: "#374151",
              boxShadow: "none",
              fontSize: "0.8rem",
              color: "#f9fafb",
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "#1f2937",
              zIndex: 9999,
            }),
            option: (base, { isFocused }) => ({
              ...base,
              backgroundColor: isFocused ? "#374151" : "#1f2937",
              color: "#f9fafb",
              fontSize: "0.8rem",
            }),
            singleValue: (base) => ({ ...base, color: "#f9fafb" }),
            input: (base) => ({ ...base, color: "#f9fafb" }),
            placeholder: (base) => ({ ...base, color: "#9ca3af" }),
          }}
          value={
            element.language
              ? { value: element.language, label: element.language }
              : { value: "", label: "Auto-detect" }
          }
          onChange={(newValue) => {
            const val = (newValue as any)?.value || null;
            applyLanguageToNode(val);
          }}
          options={options}
          placeholder="Language"
        />
      </div>
      <div className="overflow-x-auto font-mono text-sm">{children}</div>
    </div>
  );
}

export function RenderCodeBlockLineElement(props: any) {
  const { attributes, children } = props;
  return (
    <div {...attributes} className="whitespace-pre">
      <code>{children}</code>
    </div>
  );
}

export const CodeBlockToolbarButton = ({
  editor,
}: {
  editor: CustomEditor;
}) => {
  return (
    <ToolbarButton
      editor={editor}
      icon={FileCode2}
      onAction={() => toggleCodeBlock(editor)}
      isActive={isBlockActive(editor, ComponentType.CodeBlock)}
      tooltip={`Code Block`}
    />
  );
};

// -----------------------------
// withCodeBlock plugin
// -----------------------------

export const withCodeBlock = <T extends CustomEditor>(
  editor: T
): CustomEditor => {
  const { insertBreak } = editor;

  editor.registerElement({
    type: ComponentType.CodeBlock,

    render: (props) => (
      <RenderCodeBlockElement {...props} editor={props.editor as T} />
    ),
  });

  editor.registerElement({
    type: ComponentType.CodeBlockLine,
    render: (props) => (
      <RenderCodeBlockLineElement {...props} editor={props.editor as T} />
    ),
  });

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

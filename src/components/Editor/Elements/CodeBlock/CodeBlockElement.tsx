import { Transforms, Element as SlateElement, Text } from "slate";

import { useSlateStatic, ReactEditor } from "slate-react";

import { ComponentType } from "@/components/Editor/slate";
import CreatableSelect from "react-select/creatable";

import hljs from "highlight.js";
import "highlight.js/styles/github.css";

export type CodeBlockLineElement = {
  type: ComponentType.CodeBlockLine;
  children: Text[];
};
export type CodeBlockElement = {
  type: ComponentType.CodeBlock;
  language?: string;
  children: CodeBlockLineElement[];
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

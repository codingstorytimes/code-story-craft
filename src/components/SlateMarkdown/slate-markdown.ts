import { Descendant } from "slate";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { Node, Parent } from "unist";

import {
  ComponentType,
  ParagraphElement,
  HeadingElement,
  CodeBlockElement,
  BlockQuoteElement,
  EmbeddedStoryElement,
  BulletedListElement,
  NumberedListElement,
  ListItemElement,
  ImageElement,
  CustomText,
  CustomElement,
} from "@/components/Editor/slate";

// ------------------- Slate → Markdown -------------------

type MarkdownConverter<T extends CustomElement = CustomElement> = (
  node: T,
  level?: number
) => string;

const slateMarkdownConverters: Record<string, MarkdownConverter> = {
  [ComponentType.Paragraph]: (node: ParagraphElement) =>
    node.children.map(slateTextToMarkdown).join(""),

  [ComponentType.Heading]: (node: HeadingElement) => {
    const lvl = (node as any).slug ? 2 : 1;
    return `${"#".repeat(lvl)} ${node.children
      .map(slateTextToMarkdown)
      .join("")}`;
  },

  [ComponentType.CodeBlock]: (node: CodeBlockElement) =>
    `\`\`\`${node.language ?? "text"}\n${node.children
      .map((c) => (c as any).children?.[0]?.text || "")
      .join("")}\n\`\`\``,

  [ComponentType.BlockQuote]: (node: BlockQuoteElement, level = 0) =>
    node.children
      .map((child) => slateNodeToMarkdown(child as CustomElement, level))
      .map((line) => `> ${line}`)
      .join("\n"),

  [ComponentType.EmbeddedStory]: (node: EmbeddedStoryElement) =>
    `<embedded-story id="${node.embedStoryId}" embedType="${
      node.embedType ?? "inline"
    }" />`,

  [ComponentType.BulletedList]: (node: BulletedListElement, level = 0) =>
    node.children.map((child) => slateNodeToMarkdown(child, level)).join("\n"),

  [ComponentType.NumberedList]: (node: NumberedListElement, level = 0) =>
    node.children
      .map((child, idx) => {
        const lines = slateNodeToMarkdown(child, level).split("\n");
        return lines
          .map((line, i) => (i === 0 ? `${idx + 1}. ${line}` : `   ${line}`))
          .join("\n");
      })
      .join("\n"),

  [ComponentType.ListItem]: (node: ListItemElement, level = 0) =>
    node.children.map((child) => slateNodeToMarkdown(child, level)).join("\n"),

  [ComponentType.Image]: (node: ImageElement) => `![alt](${node.url})`,
};

function slateNodeToMarkdown(
  node: Descendant | CustomElement,
  level = 0
): string {
  if ("type" in node && slateMarkdownConverters[node.type]) {
    return slateMarkdownConverters[node.type](node as CustomElement, level);
  }
  return (node as CustomText).text ?? "";
}

function slateTextToMarkdown(textNode: CustomText): string {
  let text = textNode.text;
  if (textNode.code) text = `\`${text}\``;
  if (textNode.bold) text = `**${text}**`;
  if (textNode.italic) text = `*${text}*`;
  if (textNode.underline) text = `<u>${text}</u>`;
  return text;
}

// ------------------- Slate → HTML -------------------

type HtmlConverter<T extends CustomElement = CustomElement> = (
  node: T
) => string;

const slateHtmlConverters: Record<string, HtmlConverter> = {
  [ComponentType.Paragraph]: (node: ParagraphElement) =>
    `<p>${node.children.map(slateTextToHtml).join("")}</p>`,
  [ComponentType.Heading]: (node: HeadingElement) => {
    const lvl = (node as any).slug ? 2 : 1;
    return `<h${lvl}>${node.children.map(slateTextToHtml).join("")}</h${lvl}>`;
  },
  [ComponentType.BlockQuote]: (node: BlockQuoteElement) =>
    `<blockquote>${node.children
      .map(slateNodeToHtmlDispatch)
      .join("")}</blockquote>`,
  [ComponentType.CodeBlock]: (node: CodeBlockElement) =>
    `<pre><code>${node.children.map((c) => (c as any).children?.[0]?.text || "").join("")}</code></pre>`,
  [ComponentType.EmbeddedStory]: (node: EmbeddedStoryElement) =>
    `<embedded-story id="${node.embedStoryId}" embedType="${
      node.embedType ?? "inline"
    }" />`,
  [ComponentType.BulletedList]: (node: BulletedListElement) =>
    `<ul>${node.children.map(slateNodeToHtmlDispatch).join("")}</ul>`,
  [ComponentType.NumberedList]: (node: NumberedListElement) =>
    `<ol>${node.children.map(slateNodeToHtmlDispatch).join("")}</ol>`,
  [ComponentType.ListItem]: (node: ListItemElement) =>
    `<li>${node.children.map(slateNodeToHtmlDispatch).join("")}</li>`,
  [ComponentType.Image]: (node: ImageElement) =>
    `<img src="${node.url}" alt="" />`,
};

function slateNodeToHtmlDispatch(node: Descendant | CustomElement): string {
  if ("type" in node && slateHtmlConverters[node.type]) {
    return slateHtmlConverters[node.type](node as CustomElement);
  }
  return (node as CustomText).text ?? "";
}

function slateTextToHtml(textNode: CustomText): string {
  let text = textNode.text;
  if (textNode.code) text = `<code>${text}</code>`;
  if (textNode.bold) text = `<strong>${text}</strong>`;
  if (textNode.italic) text = `<em>${text}</em>`;
  if (textNode.underline) text = `<u>${text}</u>`;
  if (textNode.strikethrough) text = `<del>${text}</del>`;
  return text;
}

// ------------------- Markdown → Slate -------------------

const markdownAstConverter: Record<string, (node: Node) => Descendant[]> = {
  root: (node) => ((node as Parent).children ?? []).flatMap(markdownAstToSlate),
  paragraph: (node) => [
    {
      type: ComponentType.Paragraph,
      children: ((node as Parent).children ?? []).flatMap((c) =>
        markdownAstInlineToSlate(c)
      ),
    },
  ],
  heading: (node) => [
    {
      type: ComponentType.Heading,
      children: ((node as Parent).children ?? []).flatMap((c) =>
        markdownAstInlineToSlate(c)
      ),
    } as HeadingElement,
  ],
  blockquote: (node) => [
    {
      type: ComponentType.BlockQuote,
      children: ((node as Parent).children ?? []).flatMap(
        markdownAstToSlate
      ) || [{ text: "" }],
    },
  ],
  list: (node) => [
    {
      type: (node as any).ordered
        ? ComponentType.NumberedList
        : ComponentType.BulletedList,
      children: ((node as Parent).children ?? []).flatMap((c) => {
        const items = markdownAstToSlate(c);
        // wrap any non-list-item node into a ListItemElement
        return items.map((item) =>
          "type" in item && item.type === ComponentType.ListItem
            ? item
            : { type: ComponentType.ListItem, children: [item] }
        );
      }),
    },
  ],
  listItem: (node) => [
    {
      type: ComponentType.ListItem,
      children: ((node as Parent).children ?? []).flatMap(markdownAstToSlate),
    },
  ],
  code: (node) => [
    {
      type: ComponentType.CodeBlock,
      language: (node as any).lang ?? "text",
      children: [{ type: ComponentType.CodeBlockLine, children: [{ text: (node as any).value ?? "" }] }],
    } as CodeBlockElement,
  ],
  html: (node) => {
    const htmlValue = (node as any).value ?? "";
    const match = htmlValue.match(
      /<embedded-story id="(.+?)"(?: embedType="(mini|inline|full)")?\s*\/?>/
    );
    if (match) {
      return [
        {
          type: ComponentType.EmbeddedStory,
          embedStoryId: match[1],
          embedType: match[2] ?? "inline",
          children: [{ text: "" }],
        } as EmbeddedStoryElement,
      ];
    }
    return [{ type: ComponentType.Paragraph, children: [{ text: htmlValue }] }];
  },
};

function markdownAstToSlate(node: Node): Descendant[] {
  if (node.type && markdownAstConverter[node.type])
    return markdownAstConverter[node.type](node);
  return [
    {
      type: ComponentType.Paragraph,
      children: [{ text: `Unsupported node type: ${node.type ?? "unknown"}` }],
    },
  ];
}

function markdownAstInlineToSlate(
  node: Node,
  marks: Partial<CustomText> = {}
): Descendant[] {
  const inlineConverter: Record<
    string,
    (n: Node, m: Partial<CustomText>) => Descendant[]
  > = {
    text: (n, m) => [{ text: (n as any).value ?? "", ...m }],
    emphasis: (n, m) =>
      ((n as Parent).children ?? []).flatMap((c) =>
        markdownAstInlineToSlate(c, { ...m, italic: true })
      ),
    strong: (n, m) =>
      ((n as Parent).children ?? []).flatMap((c) =>
        markdownAstInlineToSlate(c, { ...m, bold: true })
      ),
    delete: (n, m) =>
      ((n as Parent).children ?? []).flatMap((c) =>
        markdownAstInlineToSlate(c, { ...m, underline: true })
      ),
    inlineCode: (n, m) => [{ text: (n as any).value ?? "", code: true, ...m }],
  };
  return inlineConverter[node.type as string]
    ? inlineConverter[node.type as string](node, marks)
    : [{ text: (node as any).value ?? "", ...marks }];
}

// ------------------- Serialization -------------------

export function serialize(nodes: Descendant[] | CustomElement[]): string {
  return nodes.map((n) => slateNodeToMarkdown(n)).join("\n\n");
}

export function deserialize(markdown: string): Descendant[] {
  const tree = unified().use(remarkParse).parse(markdown) as Node;
  return markdownAstToSlate(tree);
}

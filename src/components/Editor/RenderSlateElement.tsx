import { RenderLeafProps } from "slate-react";
import {
  CheckListItemElement,
  ComponentType,
  CustomElement,
  EmbeddedStoryElement,
  HeadingElement,
  ImageElement,
  MentionElement,
  RenderSlateElementProps,
  TagElement,
  VideoElement,
} from "./slate";

// --- Dispatch table with all component types ---
const elementRenderers: Record<
  CustomElement["type"],
  (props: RenderSlateElementProps) => JSX.Element
> = {
  [ComponentType.Paragraph]: ({ attributes, children }) => (
    <p {...attributes}>{children}</p>
  ),

  [ComponentType.Title]: ({ attributes, children }) => (
    <h1 {...attributes} className="text-3xl font-bold mb-4">
      {children}
    </h1>
  ),

  [ComponentType.Heading]: ({ attributes, element, children }) => (
    <h2
      {...attributes}
      className="text-xl font-bold mb-2"
      id={(element as HeadingElement).slug}
    >
      {children}
    </h2>
  ),

  [ComponentType.HeadingOne]: ({ attributes, children }) => (
    <h1 {...attributes} className="text-2xl font-bold">
      {children}
    </h1>
  ),
  [ComponentType.HeadingTwo]: ({ attributes, children }) => (
    <h2 {...attributes} className="text-xl font-semibold">
      {children}
    </h2>
  ),
  [ComponentType.HeadingThree]: ({ attributes, children }) => (
    <h3 {...attributes} className="text-lg font-medium">
      {children}
    </h3>
  ),
  [ComponentType.HeadingFour]: ({ attributes, children }) => (
    <h4 {...attributes} className="text-base font-medium">
      {children}
    </h4>
  ),

  [ComponentType.HeadingFive]: ({ attributes, children }) => (
    <h5 {...attributes} className="text-sm font-medium">
      {children}
    </h5>
  ),

  [ComponentType.HeadingSix]: ({ attributes, children }) => (
    <h6 {...attributes} className="text-xs font-medium">
      {children}
    </h6>
  ),

  [ComponentType.BlockQuote]: ({ attributes, children }) => (
    <blockquote
      {...attributes}
      className="border-l-4 pl-3 italic text-muted-foreground"
    >
      {children}
    </blockquote>
  ),

  [ComponentType.CodeBlock]: ({ attributes, children }) => (
    <pre
      {...attributes}
      className="bg-muted p-3 rounded-md font-mono text-sm overflow-x-auto"
    >
      <code>{children}</code>
    </pre>
  ),

  [ComponentType.BulletedList]: ({ attributes, children }) => (
    <ul {...attributes} className="list-disc pl-6">
      {children}
    </ul>
  ),

  [ComponentType.NumberedList]: ({ attributes, children }) => (
    <ol {...attributes} className="list-decimal pl-6">
      {children}
    </ol>
  ),

  [ComponentType.CheckListItem]: ({ attributes, element, children }) => {
    const el = element as CheckListItemElement;
    return (
      <div {...attributes} className="flex items-center gap-2">
        <input type="checkbox" checked={el.checked} readOnly />
        <span>{children}</span>
      </div>
    );
  },

  [ComponentType.ListItem]: ({ attributes, children }) => (
    <li {...attributes}>{children}</li>
  ),

  [ComponentType.Link]: ({ attributes, element, children }) => (
    <a
      {...attributes}
      href={(element as any).url}
      className="text-primary underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),

  [ComponentType.Image]: ({ attributes, element }) => {
    const el = element as ImageElement;
    return (
      <div {...attributes} contentEditable={false} className="my-3">
        <img
          src={el.url}
          alt=""
          className="max-w-full rounded-md border border-border"
        />
      </div>
    );
  },

  [ComponentType.EmbeddedStory]: ({ attributes, element }) => {
    const el = element as EmbeddedStoryElement;
    return (
      <div
        {...attributes}
        contentEditable={false}
        className={`my-4 border rounded-md p-3 ${
          el.embedType === "mini"
            ? "text-sm"
            : el.embedType === "full"
            ? "bg-muted"
            : ""
        }`}
      >
        <p className="text-muted-foreground">
          Embedded story: {el.storyId ?? "unknown"}
        </p>
      </div>
    );
  },

  [ComponentType.Tag]: ({ attributes, element, children }) => {
    const el = element as TagElement;
    return (
      <span
        {...attributes}
        className="inline-block px-2 py-1 text-xs bg-muted text-muted-foreground rounded"
      >
        {el.value ?? "#"}
        {children}
      </span>
    );
  },

  [ComponentType.Video]: ({ attributes, element, children }) => {
    const el = element as VideoElement;
    return (
      <div {...attributes} contentEditable={false} className="my-4">
        <video src={el.url} controls className="max-w-full rounded" />
        {children}
      </div>
    );
  },

  [ComponentType.Mention]: ({ attributes, element, children }) => {
    const el = element as MentionElement;
    return (
      <span
        {...attributes}
        contentEditable={false}
        className="px-1 py-0.5 rounded bg-blue-100 text-blue-800 text-xs"
      >
        @{el.character}
        {children}
      </span>
    );
  },
  [ComponentType.EditableVoid]: ({ attributes, children }) => (
    <div {...attributes}>{children}</div>
  ),

  [ComponentType.Table]: ({ attributes, children }) => (
    <table {...attributes} className="w-full border-collapse border border-border">
      {children}
    </table>
  ),

  [ComponentType.TableRow]: ({ attributes, children }) => (
    <tr {...attributes} className="border border-border">
      {children}
    </tr>
  ),

  [ComponentType.TableCell]: ({ attributes, children }) => (
    <td {...attributes} className="border border-border p-2">
      {children}
    </td>
  ),

  [ComponentType.ThematicBreak]: ({ attributes, children }) => (
    <div {...attributes} contentEditable={false} className="my-4">
      <hr className="border-t-2 border-border" />
      {children}
    </div>
  ),

  // Fallback for any additional unhandled types
};

// --- Renderer function ---
export default function renderSlateElement({
  attributes,
  children,
  element,
  editor,
  viewMode = "editor",
}: RenderSlateElementProps) {
  // The plugin chain will handle rendering for elements it knows about.
  // We start the chain here.
  const pluginElement = editor.renderElement({ attributes, children, element, editor, viewMode });
  if (pluginElement) {
    return pluginElement;
  }

  const renderer = elementRenderers[element.type];

  if (renderer) {
    return renderer({ attributes, children, element, editor, viewMode });
  }
  return <p {...attributes}>{children}</p>;
}

export const RenderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  if (leaf.strikethrough) {
    children = <del>{children}</del>;
  }

  if (leaf.code) {
    children = (
      <code className="bg-muted px-1 rounded font-mono text-sm">
        {children}
      </code>
    );
  }

  return <span {...attributes}>{children}</span>;
};

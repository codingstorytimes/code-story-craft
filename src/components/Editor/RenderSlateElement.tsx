import { RenderLeafProps } from "slate-react";

import { RenderSlateElementProps, ComponentType } from "./slate";

import { RenderVideoElement } from "./Elements/Video/VideoElement";

import { RenderThematicBreakElement } from "./Elements/ThematicBreak/ThematicBreakElement";
import {
  RenderHeading1Element,
  RenderHeading2Element,
  RenderHeading3Element,
  RenderHeading4Element,
  RenderHeading5Element,
  RenderHeading6Element,
} from "./Elements/Headings/HeadingElements";
import { RenderBlockQuoteElement } from "./Elements/BlockQuote/BlockQuoteElement";
import { RenderBulletedListElement } from "./Elements/BulletedList/BulletedListElement";
import { RenderNumberedListElement } from "./Elements/NumberedList/NumberedListElement";
import { RenderTagElement } from "./Elements/Tag/TagElement";
import { RenderParagraphElement } from "./Elements/Paragraph/ParagraphElement";
import { RenderListItemElement } from "./Elements/ListItem/ListItemElement";
import { RenderCheckListItemElement } from "./Elements/CheckList/CheckListItemElement";
import { RenderEmbeddedStoryElement } from "./Elements/EmbeddedStory/EmbeddedStoryElement";
import { RenderLinkElement } from "./Elements/Link/LinkElement";
import { RenderMentionElement } from "./Elements/Mention/MentionElement";

export const RenderEditableVoidElement = ({ attributes, children }) => (
  <div {...attributes}>{children}</div>
);

// --- Dispatch table with all component types ---
const elementRenderers: Partial<
  Record<ComponentType, (props: RenderSlateElementProps) => JSX.Element>
> = {
  [ComponentType.EmbeddedStory]: RenderEmbeddedStoryElement,

  [ComponentType.Tag]: RenderTagElement,

  [ComponentType.Video]: RenderVideoElement,

  [ComponentType.EditableVoid]: RenderEditableVoidElement,
  [ComponentType.Paragraph]: RenderParagraphElement,
  [ComponentType.NumberedList]: RenderNumberedListElement,
  [ComponentType.Mention]: RenderMentionElement,

  [ComponentType.CheckListItem]: RenderCheckListItemElement,

  [ComponentType.ListItem]: RenderListItemElement,

  [ComponentType.BulletedList]: RenderBulletedListElement,
  [ComponentType.BlockQuote]: RenderBlockQuoteElement,
  [ComponentType.HeadingOne]: RenderHeading1Element,
  [ComponentType.HeadingTwo]: RenderHeading2Element,
  [ComponentType.HeadingThree]: RenderHeading3Element,
  [ComponentType.HeadingFour]: RenderHeading4Element,
  [ComponentType.HeadingFive]: RenderHeading5Element,
  [ComponentType.HeadingSix]: RenderHeading6Element,
  [ComponentType.ThematicBreak]: RenderThematicBreakElement,

  [ComponentType.Link]: RenderLinkElement,
  //[ComponentType.Image]: RenderImageElement,
  //[ComponentType.CodeBlock]: RenderCodeBlockElement,
  //[ComponentType.CodeBlockLine]: RenderCodeBlockLineElement,

  /*
  [ComponentType.Table]: ({ attributes, children }) => (
    <table
      {...attributes}
      className="w-full border-collapse border border-border"
    >
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
  )
  ,*/
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
  const pluginElement = editor.renderElement({
    attributes,
    children,
    element,
    editor,
    viewMode,
  });
  if (pluginElement) {
    return pluginElement;
  }
  console.log("ksxkjd", editor.plugins);
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

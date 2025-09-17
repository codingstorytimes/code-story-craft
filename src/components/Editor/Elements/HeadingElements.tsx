import React, { JSX } from "react";
import { Descendant, Editor, Transforms } from "slate";
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  LucideIcon,
} from "lucide-react";
import { ComponentType } from "../slate";
import { EditorButton } from "../Toolbar/EditorButton";

export type HeadingLevelType = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingElement = {
  type: ComponentType.Heading;
  headingLevel: HeadingLevelType;
  children: Descendant[];
  slug?: string;
};

const headingIconMap: Record<HeadingElement["headingLevel"], LucideIcon> = {
  1: Heading1,
  2: Heading2,
  3: Heading3,
  4: Heading4,
  5: Heading5,
  6: Heading6,
};

export const insertHeadingBlock = (
  editor: Editor,
  headingLevel: HeadingElement["headingLevel"]
) => {
  const headingBlock: HeadingElement = {
    type: ComponentType.Heading,
    headingLevel,
    children: [{ text: "" }],
  };

  Transforms.insertNodes(editor, headingBlock as Descendant);
};

export const HeadingToolbarButton = ({
  editor,
  headingLevel,
}: {
  editor: Editor;
  headingLevel: HeadingElement["headingLevel"];
}) => {
  const Icon = headingIconMap[headingLevel];
  return (
    <EditorButton
      editor={editor}
      icon={Icon}
      tooltip={`Heading ${headingLevel}`}
      onAction={() => insertHeadingBlock(editor, headingLevel)}
    />
  );
};

// Component for rendering an <h1> element.
export const RenderHeading1Element = ({ attributes, children }) => {
  return (
    <h1 {...attributes} className="text-4xl font-bold my-4">
      {children}
    </h1>
  );
};

// Component for rendering an <h2> element.
export const RenderHeading2Element = ({ attributes, children }) => {
  return (
    <h2 {...attributes} className="text-3xl font-bold my-3">
      {children}
    </h2>
  );
};

// Component for rendering an <h3> element.
export const RenderHeading3Element = ({ attributes, children }) => {
  return (
    <h3 {...attributes} className="text-2xl font-bold my-2">
      {children}
    </h3>
  );
};

// Component for rendering an <h4> element.
export const RenderHeading4Element = ({ attributes, children }) => {
  return (
    <h4 {...attributes} className="text-xl font-bold my-1">
      {children}
    </h4>
  );
};

// Component for rendering an <h5> element.
export const RenderHeading5Element = ({ attributes, children }) => {
  return (
    <h5 {...attributes} className="text-lg font-bold my-0">
      {children}
    </h5>
  );
};

// Component for rendering an <h6> element.
export const RenderHeading6Element = ({ attributes, children }) => {
  return (
    <h6 {...attributes} className="text-base font-bold my-0">
      {children}
    </h6>
  );
};

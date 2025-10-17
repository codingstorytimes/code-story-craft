import { RenderElementProps } from "slate-react";
import { Descendant, Editor, Transforms } from "slate";
import { ComponentType } from "../../slate";

export type MentionElement = {
  type: ComponentType.Mention;
  character: string;
  children: Descendant[];
};

export const RenderMentionElement = ({
  attributes,
  children,
  element,
}: RenderElementProps & { element: MentionElement }) => {
  return (
    <span
      {...attributes}
      contentEditable={false}
      className="px-1 py-0.5 rounded bg-blue-100 text-blue-800 text-xs"
    >
      @{element.character}
      {children}
    </span>
  );
};

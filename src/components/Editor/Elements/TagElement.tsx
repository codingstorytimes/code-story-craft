import { RenderElementProps } from "slate-react";
import { ComponentType, CustomText } from "../slate";

export interface TagElement {
  type: ComponentType.Tag;
  children: CustomText[];
  text: string;
}

export const RenderTagElement = ({
  attributes,
  element,
}: RenderElementProps) => {
  const el = element as TagElement;
  return (
    <span
      {...attributes}
      className="inline-block px-2 py-1 text-xs bg-muted text-muted-foreground rounded"
    >
      {el.text ?? "#"}
    </span>
  );
};

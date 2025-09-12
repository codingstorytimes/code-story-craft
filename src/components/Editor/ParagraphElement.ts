import { Descendant } from "slate";
import { ComponentType } from "./slate";

export type ParagraphElement = {
  type: ComponentType.Paragraph;
  children: Descendant[];
};

import { Descendant } from "slate";
import { ComponentType } from "../../slate";

export type TitleElement = {
  type: ComponentType.Title;
  children: Descendant[];
};

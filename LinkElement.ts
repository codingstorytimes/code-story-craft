import { Descendant } from "slate";
import { ComponentType } from "../../slate";

export type LinkElement = {
  type: ComponentType.Link;
  url: string;
  children: Descendant[];
};

import { Descendant } from "slate";
import { ComponentType } from "../slate";

export type ListItemElement = {
  type: ComponentType.ListItem;
  children: Descendant[];
  level?: number;
};

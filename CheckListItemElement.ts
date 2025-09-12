import { Descendant } from "slate";
import { ComponentType } from "../../slate";

export type CheckListItemElement = {
  type: ComponentType.CheckListItem;
  checked: boolean;
  children: Descendant[];
};

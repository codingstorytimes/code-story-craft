import { ComponentType } from "./slate";
import { ListItemElement } from "./ListItemElement";

export type NumberedListElement = {
  type: ComponentType.NumberedList;
  children: ListItemElement[];
};

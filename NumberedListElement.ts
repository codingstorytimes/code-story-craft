import { ComponentType } from "../../slate";
import { ListItemElement } from "../ListItem/ListItemElement";

export type NumberedListElement = {
  type: ComponentType.NumberedList;
  children: ListItemElement[];
};

import { ComponentType } from "../../slate";
import { ListItemElement } from "../ListItem/ListItemElement";

export type BulletedListElement = {
  type: ComponentType.BulletedList;
  children: ListItemElement[];
};

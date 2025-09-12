import { ComponentType } from "./slate";
import { ListItemElement } from "./ListItemElement";

export type BulletedListElement = {
  type: ComponentType.BulletedList;
  children: ListItemElement[];
};

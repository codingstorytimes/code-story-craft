import { Descendant } from "slate";
import { ComponentType } from "../../slate";
import { MentionToolbarButton } from "../Mention/MentionToolbarButton";

export type ListItemElement = {
  type: ComponentType.ListItem;
  children: Descendant[];
  level?: number;
};

export const RenderListItemElement = ({ attributes, children }) => (
  <li {...attributes}>{children}</li>
);

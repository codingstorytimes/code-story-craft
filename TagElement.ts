import { CustomText, ComponentType } from "../../slate";

export type TagElement = {
  type: ComponentType.Tag;
  value?: string;
  num?: number;
  children: CustomText[];
};

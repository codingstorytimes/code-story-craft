import { CustomText, ComponentType } from "../../slate";

export type EditableVoidElement = {
  type: ComponentType.EditableVoid;
  children: CustomText[];
};

import { CustomText, ComponentType } from "../slate";

export type ThematicBreakElement = {
  type: ComponentType.ThematicBreak;
  children: CustomText[];
};
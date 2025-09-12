import { CustomText, ComponentType } from "../../slate";

export type ImageElement = {
  type: ComponentType.Image;
  url: string;
  children: CustomText[];
};

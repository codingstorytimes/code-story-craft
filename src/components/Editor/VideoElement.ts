import { CustomText, ComponentType } from "./slate";

export type VideoElement = {
  type: ComponentType.Video;
  url?: string;
  children: CustomText[];
};

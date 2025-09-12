import { CustomText, IEmbedType, ComponentType } from "./slate";

export type EmbeddedStoryElement = {
  type: ComponentType.EmbeddedStory;
  storyId: string;
  embedType?: IEmbedType;
  children: CustomText[];
};

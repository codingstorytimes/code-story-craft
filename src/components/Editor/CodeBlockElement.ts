import { CustomText, ComponentType } from "./slate";

export type CodeBlockElement = {
  type: ComponentType.CodeBlock;
  language?: string;
  children: CustomText[];
};

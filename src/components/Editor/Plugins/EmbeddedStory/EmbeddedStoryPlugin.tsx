import { Editor, Transforms, Descendant } from "slate";
import { ensureLastParagraph } from "../../editorUtils";
import {
  CustomText,
  IEmbedType,
  ComponentType,
  CustomElement,
} from "../../slate";

export type EmbeddedStoryElement = {
  type: ComponentType.EmbeddedStory;
  storyId: string;
  embedType?: IEmbedType;
  children: CustomText[];
};

export const insertEmbeddedStory = (
  editor: Editor,
  embedStoryId: string,
  embedType: IEmbedType
) => {
  if (!embedStoryId) return;
  const embedBlock: CustomElement = {
    type: ComponentType.EmbeddedStory,
    storyId: embedStoryId,
    embedType,
    children: [{ text: "" }],
  };
  Transforms.insertNodes(editor, embedBlock as Descendant);
  ensureLastParagraph(editor);
};

export const EmbeddedStoryToolbarButton = () => {};

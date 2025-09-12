import { Descendant, Editor, Transforms } from "slate";
import { ensureLastParagraph } from "../../editorUtils";
import { IEmbedType, ComponentType, CustomElement } from "../../slate";

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

import { Editor, Transforms, Descendant } from "slate";
import { ensureLastParagraph } from "../../editorUtils";
import { CustomText, ComponentType, CustomElement } from "../../slate";

export type ImageElement = {
  type: ComponentType.Image;
  url: string;
  children: CustomText[];
};

export function insertImage(editor: Editor, url: string) {
  const image: CustomElement = {
    type: ComponentType.Image,
    url,
    children: [{ text: "" }],
  };

  Transforms.insertNodes(editor, image as Descendant);
  ensureLastParagraph(editor);
}

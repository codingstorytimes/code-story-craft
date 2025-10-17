import { Editor, Transforms, Descendant } from "slate";
import { ensureLastParagraph } from "../../editorUtils";
import {
  CustomText,
  IEmbedType,
  ComponentType,
  CustomElement,
  CustomEditor,
} from "../../slate";

export type EmbeddedStoryElement = {
  type: ComponentType.EmbeddedStory;
  embedStoryId: string;
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
    embedStoryId: embedStoryId,
    embedType,
    children: [{ text: "" }],
  };
  Transforms.insertNodes(editor, embedBlock as Descendant);
  ensureLastParagraph(editor);
};

export const RenderEmbeddedStoryElement = ({ attributes, element }) => {
  const el = element as EmbeddedStoryElement;
  return (
    <div
      {...attributes}
      contentEditable={false}
      className={`my-4 border rounded-md p-3 ${
        el.embedType === "mini"
          ? "text-sm"
          : el.embedType === "full"
          ? "bg-muted"
          : ""
      }`}
    >
      <p className="text-muted-foreground">
        Embedded story: {el.embedStoryId ?? "unknown"}
      </p>
    </div>
  );
};

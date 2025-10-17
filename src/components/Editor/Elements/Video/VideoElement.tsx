import {
  CustomText,
  ComponentType,
  RenderSlateElementProps,
  CustomEditor,
} from "../../slate";

export type VideoElement = {
  type: ComponentType.Video;
  url?: string;
  children: CustomText[]; // Slate still requires children, but void elements ignore them
};

export const RenderVideoElement = ({
  attributes,
  element,
}: RenderSlateElementProps) => {
  const el = element as VideoElement;

  return (
    <div {...attributes} contentEditable={false} className="my-4">
      <video src={el.url} controls className="max-w-full rounded" />
    </div>
  );
};

export const withVideos = (editor: CustomEditor) => {
  const { isVoid } = editor;
  editor.isVoid = (element) =>
    element.type === "video" ? true : isVoid(element);
  return editor;
};

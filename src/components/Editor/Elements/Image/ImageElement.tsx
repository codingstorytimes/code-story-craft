import { ComponentType, CustomText } from "../../slate";

export type ImageElement = {
  type: ComponentType.Image;
  url: string;
  children: CustomText[];
};

export const RenderImageElement = ({ attributes, element }) => {
  const el = element as ImageElement;
  return (
    <div {...attributes} contentEditable={false} className="my-3">
      <img
        src={el.url}
        alt=""
        className="max-w-full rounded-md border border-border"
      />
    </div>
  );
};

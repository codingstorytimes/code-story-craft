// -----------------------------
// withLinks plugin

import { RenderElementProps } from "slate-react";
import {
  CustomEditor,
  ComponentType,
  RenderSlateElementProps,
  LinkElement,
} from "../../slate";
import { LinkEvents, RenderLinkElement } from "../../Elements/Link/LinkElement";
import isHotkey from "is-hotkey";

// -----------------------------
export const withLinks = (editor: CustomEditor) => {
  const { isInline, onKeyDown } = editor as any;

  editor.registerElement({
    type: ComponentType.Link,
    render: (props: RenderSlateElementProps & { editor: CustomEditor }) => (
      <RenderLinkElement
        {...(props as unknown as RenderElementProps & {
          element: LinkElement;
        })}
      />
    ),
  });

  editor.isInline = (element: any) =>
    element.type === ComponentType.Link ? true : isInline(element);
  editor.onKeyDown = (event: any) => {
    if (onKeyDown) onKeyDown(event);
    if (isHotkey("mod+k", event)) {
      event.preventDefault();
      window.dispatchEvent(new CustomEvent(LinkEvents.OPEN));
    }
  };
  return editor;
};

import { RenderElementProps } from "slate-react";
import { Element as SlateElement } from "slate";
import {
  ComponentType,
  CustomEditor,
  RenderSlateElementProps,
} from "../../slate";
import isHotkey from "is-hotkey";
import {
  MentionElement,
  RenderMentionElement,
} from "../../Elements/Mention/MentionElement";

export const MentionEvents = {
  OPEN: "slate.mention.open",
};

export const withMentions = (editor: CustomEditor) => {
  const { isInline, isVoid, markableVoid } = editor;

  if (typeof editor.registerElement === "function") {
    editor.registerElement({
      type: ComponentType.Mention,
      render: (props: RenderSlateElementProps & { editor: CustomEditor }) => (
        <RenderMentionElement
          {...(props as unknown as RenderElementProps & {
            element: MentionElement;
          })}
        />
      ),
    });
  }

  editor.isInline = (element: SlateElement) => {
    return element.type === ComponentType.Mention ? true : isInline(element);
  };

  editor.isVoid = (element: SlateElement) => {
    return element.type === ComponentType.Mention ? true : isVoid(element);
  };

  editor.markableVoid = (element: SlateElement) => {
    return element.type === ComponentType.Mention || markableVoid(element);
  };

  // Dispatch a namespaced custom event when @ is typed
  const { onKeyDown } = editor as any;
  (editor as any).onKeyDown = (event: KeyboardEvent) => {
    if (onKeyDown) onKeyDown(event);
    if (isHotkey("@", event)) {
      const mentionEvent = new CustomEvent(MentionEvents.OPEN, {
        detail: { editor },
      });
      window.dispatchEvent(mentionEvent);
    }
  };

  return editor;
};

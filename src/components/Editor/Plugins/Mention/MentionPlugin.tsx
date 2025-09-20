import React, { useState } from "react";
import { RenderElementProps, useSlateStatic } from "slate-react";
import { ComponentType, CustomEditor } from "../../slate";
import { AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import DialogInsertMention from "./DialogInsertMention";

import { Descendant } from "slate";

export type MentionElement = {
  type: ComponentType.Mention;
  character: string;
  children: Descendant[];
};

export const withMention = <T extends CustomEditor>(editor: T): T => {
  const { isInline } = editor;
  editor.isInline = (element) =>
    element.type === ComponentType.Mention ? true : isInline(element);

  editor.registerElement({
    type: ComponentType.Mention,
    render: ({ attributes, children, element }) => (
      <span
        {...attributes}
        contentEditable={false}
        className="px-1 py-0.5 rounded bg-blue-100 text-blue-800 text-xs"
      >
        @{(element as MentionElement).character}
        {children}
      </span>
    ),
  });

  return editor;
};

export const RenderMentionElement = ({ attributes, element, children }) => {
  const el = element as MentionElement;
  return (
    <span
      {...attributes}
      contentEditable={false}
      className="px-1 py-0.5 rounded bg-blue-100 text-blue-800 text-xs"
    >
      @{el.character}
      {children}
    </span>
  );
};

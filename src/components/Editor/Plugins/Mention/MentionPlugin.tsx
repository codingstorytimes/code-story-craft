import React, { useState } from "react";
import { RenderElementProps, useSlateStatic } from "slate-react";
import { ComponentType, CustomEditor } from "../../slate";
import { AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import DialogInsertMention from "./DialogInsertMention";
import { IEditorPlugin } from "../plugins";
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

const MentionToolbarButton = () => {
  const editor = useSlateStatic();
  const [showMentionDialog, setShowMentionDialog] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onMouseDown={(e) => {
          e.preventDefault();
          setShowMentionDialog(true);
        }}
      >
        <AtSign className="w-4 h-4" />
      </Button>
      <DialogInsertMention
        isOpen={showMentionDialog}
        onClose={() => setShowMentionDialog(false)}
        editor={editor}
      />
    </>
  );
};

export const MentionPlugin: IEditorPlugin = {
  id: "mention",
  withPlugin: withMention,
  toolbarButtons: [
    {
      id: "mention",
      group: "inserts",
      tooltip: "Mention User",
      render: () => <MentionToolbarButton />,
    },
  ],
};

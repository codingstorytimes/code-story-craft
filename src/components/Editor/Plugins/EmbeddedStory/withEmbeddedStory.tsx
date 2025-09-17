import React from "react";
import { ComponentType, CustomEditor } from "../../slate";
import { EmbeddedStoryElement } from "./EmbeddedStoryPlugin";

export const withEmbeddedStory = <T extends CustomEditor>(editor: T): T => {
  editor.registerElement({
    type: ComponentType.EmbeddedStory,
    render: ({ attributes, element }) => {
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
            Embedded story: {el.storyId ?? "unknown"}
          </p>
        </div>
      );
    },
  });

  return editor;
};

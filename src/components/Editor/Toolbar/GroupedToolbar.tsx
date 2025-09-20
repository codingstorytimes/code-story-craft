import React from "react";
import { Separator } from "@/components/ui/separator";
import { CustomEditor, ToolbarGroupId } from "../slate";
import MarkButtons from "./MarkButtons";

import { TableToolbarButton } from "../Plugins/Table/TableToolbarButton";
import { ImageToolbarButton } from "../Plugins/Image/ImageToolbarButton";

import { Quote, Code, List, ListOrdered } from "lucide-react";

import {
  BlockQuoteToolbarButton,
  insertQuote,
} from "../Elements/BlockQuoteElement";
import { CodeBlockToolbarButton } from "../Plugins/CodeBlock/CodeBlockElement";
import { HeadingToolbarButton } from "../Elements/HeadingElements";
import { BulletedListToolbarButton } from "../Elements/BulletedListElement";

import { NumberedListToolbarButton } from "../Elements/NumberedListElement";
import { LinkToolbarButton } from "../Elements/LinkElement";
import { ThematicBreakToolbarButton } from "../Elements/ThematicBreakElement";
import { MentionToolbarButton } from "../Plugins/Mention/MentionToolbarButton";
import { EmbeddedStoryToolbarButton } from "../Plugins/EmbeddedStory/EmbeddedStoryToolbarButton";

interface GroupedToolbarProps {
  editor: CustomEditor;
  userId: string;
}

export interface IToolbarButton {
  id: string;
  group: string;
  tooltip?: string;
  render: (editor: CustomEditor) => React.ReactNode;
}

const GroupedToolbar: React.FC<GroupedToolbarProps> = ({ editor, userId }) => {
  const toolbarGroups = [
    {
      id: ToolbarGroupId.Marks,
      label: "Text Formatting",
      buttons: <MarkButtons editor={editor} />,
    },
    {
      id: ToolbarGroupId.Headings,
      label: "Headings",
      buttons: (
        <>
          <HeadingToolbarButton editor={editor} headingLevel={1} />
          <HeadingToolbarButton editor={editor} headingLevel={2} />
          <HeadingToolbarButton editor={editor} headingLevel={3} />
          <HeadingToolbarButton editor={editor} headingLevel={4} />
          <HeadingToolbarButton editor={editor} headingLevel={5} />
          <HeadingToolbarButton editor={editor} headingLevel={6} />
        </>
      ),
    },
    {
      id: ToolbarGroupId.Block,
      label: "Block Elements",
      buttons: (
        <>
          <BlockQuoteToolbarButton editor={editor} />
          <CodeBlockToolbarButton editor={editor} />
        </>
      ),
    },
    {
      id: ToolbarGroupId.Lists,
      label: "Lists",
      buttons: (
        <>
          <BulletedListToolbarButton editor={editor} />
          <NumberedListToolbarButton editor={editor} />
        </>
      ),
    },
    {
      id: ToolbarGroupId.Media,
      label: "Media",
      buttons: (
        <>
          <LinkToolbarButton editor={editor} />
          <ImageToolbarButton editor={editor} userId={userId} />
          <TableToolbarButton editor={editor as any} />
        </>
      ),
    },
    {
      id: ToolbarGroupId.Inserts,
      label: "Inserts",
      buttons: (
        <>
          <ThematicBreakToolbarButton editor={editor} />
          <MentionToolbarButton editor={editor} userId={userId} />
          <EmbeddedStoryToolbarButton editor={editor} userId={userId} />
        </>
      ),
    },
  ];

  return (
    <div className="border-b border-border p-2 flex gap-1 flex-wrap">
      {toolbarGroups.map((group, index) => (
        <React.Fragment key={group.id}>
          <div className="flex gap-1 items-center">{group.buttons}</div>
          {index < toolbarGroups.length - 1 && (
            <Separator orientation="vertical" className="h-6 mx-1" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default GroupedToolbar;

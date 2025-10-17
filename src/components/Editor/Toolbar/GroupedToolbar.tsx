import React from "react";
import { Separator } from "@/components/ui/separator";
import { CustomEditor, ToolbarGroupId } from "../slate";
import MarkButtons from "./MarkButtons";

import { TableToolbarButton } from "../Elements/Table/TableToolbarButton";
import { ImageToolbarButton } from "../Elements/Image/ImageToolbarButton";

import { Quote, Code, List, ListOrdered } from "lucide-react";

import {
  BlockQuoteToolbarButton,
  insertQuote,
} from "../Elements/BlockQuote/BlockQuoteElement";

import { HeadingToolbarButton } from "../Elements/Headings/HeadingElements";
import { BulletedListToolbarButton } from "../Elements/BulletedList/BulletedListElement";

import { NumberedListToolbarButton } from "../Elements/NumberedList/NumberedListElement";

import { ThematicBreakToolbarButton } from "../Elements/ThematicBreak/ThematicBreakElement";
import { MentionToolbarButton } from "../Elements/Mention/MentionToolbarButton";
import { EmbeddedStoryToolbarButton } from "../Elements/EmbeddedStory/EmbeddedStoryToolbarButton";
import { CodeBlockToolbarButton } from "../Elements/CodeBlock/CodeBlockToolbarButton";
import { LinkToolbarButton } from "../Elements/Link/LinkToolbarButton";

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

import React from "react";
import { Separator } from "@/components/ui/separator";
import { CustomEditor, ToolbarGroupId } from "../slate";
import MarkButtons from "./MarkButtons";
import EditorButton from "./EditorButton";
import EmbeddedStoryToolbarButton from "../Plugins/EmbeddedStory/DialogEmbeddedStory";
import { TableToolbarButton } from "../Plugins/Table/TableToolbarButton";
import { ImageToolbarButton } from "./ImageToolbarButton";
import { MentionToolbarButton } from "./MentionToolbarButton";
import { 
  Heading1, 
  Heading2, 
  Heading3, 
  Quote, 
  Code, 
  List, 
  ListOrdered 
} from "lucide-react";
import { 
  insertHeadingBlock, 
  insertCodeBlock, 
  insertQuote 
} from "../editorUtils";

interface GroupedToolbarProps {
  editor: CustomEditor;
  userId: string;
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
          <EditorButton
            editor={editor}
            icon={Heading1}
            tooltip="Heading 1"
            onAction={() => insertHeadingBlock(editor)}
          />
          <EditorButton
            editor={editor}
            icon={Heading2}
            tooltip="Heading 2"
            onAction={() => insertHeadingBlock(editor)}
          />
          <EditorButton
            editor={editor}
            icon={Heading3}
            tooltip="Heading 3"
            onAction={() => insertHeadingBlock(editor)}
          />
        </>
      ),
    },
    {
      id: ToolbarGroupId.Block,
      label: "Block Elements",
      buttons: (
        <>
          <EditorButton
            editor={editor}
            icon={Quote}
            tooltip="Quote"
            onAction={() => insertQuote(editor)}
          />
          <EditorButton
            editor={editor}
            icon={Code}
            tooltip="Code Block"
            onAction={() => insertCodeBlock(editor)}
          />
        </>
      ),
    },
    {
      id: ToolbarGroupId.Lists,
      label: "Lists",
      buttons: (
        <>
          <EditorButton
            editor={editor}
            icon={List}
            tooltip="Bullet List"
            onAction={() => {
              // TODO: Implement list insertion
            }}
          />
          <EditorButton
            editor={editor}
            icon={ListOrdered}
            tooltip="Numbered List"
            onAction={() => {
              // TODO: Implement numbered list insertion
            }}
          />
        </>
      ),
    },
    {
      id: ToolbarGroupId.Media,
      label: "Media",
      buttons: (
        <>
          <ImageToolbarButton userId={userId} />
          <TableToolbarButton editor={editor as any} />
        </>
      ),
    },
    {
      id: ToolbarGroupId.Inserts,
      label: "Inserts",
      buttons: (
        <>
          <MentionToolbarButton />
          <EmbeddedStoryToolbarButton editor={editor} />
        </>
      ),
    },
  ];

  return (
    <div className="border-b border-border p-2 flex gap-1 flex-wrap">
      {toolbarGroups.map((group, index) => (
        <React.Fragment key={group.id}>
          <div className="flex gap-1 items-center">
            {group.buttons}
          </div>
          {index < toolbarGroups.length - 1 && (
            <Separator orientation="vertical" className="h-6 mx-1" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default GroupedToolbar;
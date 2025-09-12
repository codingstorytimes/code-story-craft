import React from "react";
import {
  Bold,
  Italic,
  Underline,
  Code,
  Heading1,
  Hash,
  Quote,
  ImageIcon,
} from "lucide-react";
import { CustomEditor, ComponentType } from "../slate";
import {
  toggleMark,
  insertHeadingBlock,
  insertCodeBlock,
  insertQuote,
} from "../editorUtils";
import { MentionPlugin } from "./Mention/MentionPlugin";
import { ImagePlugin } from "./Image/ImagePlugin";

export interface IToolbarButton {
  id: string;
  group: string;
  tooltip?: string;
  render: (editor: CustomEditor) => React.ReactNode;
}

export interface IEditorPlugin {
  id: string;
  withPlugin?: (editor: CustomEditor) => CustomEditor;
  toolbarButtons?: IToolbarButton[];
}

const corePlugins: IEditorPlugin[] = [
  {
    id: "bold",
    toolbarButtons: [
      {
        id: "bold",
        group: "marks",
        tooltip: "Bold",
        render: (editor) => (
          <Button
            variant="ghost"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault();
              toggleMark(editor, "bold");
            }}
          >
            <Bold className="w-4 h-4" />
          </Button>
        ),
      },
    ],
  },
  {
    id: "italic",
    toolbarButtons: [
      {
        id: "italic",
        group: "marks",
        tooltip: "Italic",
        render: (editor) => (
          <Button
            variant="ghost"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault();
              toggleMark(editor, "italic");
            }}
          >
            <Italic className="w-4 h-4" />
          </Button>
        ),
      },
    ],
  },
  // ... other core plugins for underline, code, headings, etc.
];

const customPlugins: IEditorPlugin[] = [
  MentionPlugin,
  ImagePlugin,
  // Add other custom plugins here
];

// A simple button component to be used internally by plugins
const Button = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: string;
    size?: string;
  }
) => <button {...props} />;

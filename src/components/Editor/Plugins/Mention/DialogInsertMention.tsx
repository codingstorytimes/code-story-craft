import React, { useState } from "react";
import { useSlate } from "slate-react";
import { Descendant, Editor, Transforms } from "slate";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ComponentType, CustomElement } from "../../slate";

export type MentionElement = {
  type: ComponentType.Mention;
  mention: string;
  children: { text: string }[];
};
import { AtSign } from "lucide-react";

interface DialogInsertMentionProps {
  isOpen: boolean;
  onClose: () => void;
  editor?: any;
}

export default function DialogInsertMention({
  isOpen,
  onClose,
  editor: externalEditor,
}: DialogInsertMentionProps) {
  const slateEditor = useSlate();
  const editor = externalEditor || slateEditor;
  const [mention, setCharacter] = useState("");

  const handleInsert = () => {
    if (!mention) return;

    const mentionElement: MentionElement = {
      type: ComponentType.Mention,
      mention: mention,
      children: [{ text: "" }],
    };

    Transforms.insertNodes(editor, mentionElement);
    Transforms.move(editor);
    onClose();
    setCharacter("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insert Mention</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            value={mention}
            onChange={(e) => setCharacter(e.target.value)}
            placeholder="Character to mention..."
            autoFocus
          />
          <Button onClick={handleInsert} disabled={!mention} className="w-full">
            Insert Mention
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function insertMention(editor: Editor, character: string) {
  const mention: CustomElement = {
    type: ComponentType.Mention,
    character,
    children: [{ text: "" }],
  };

  Transforms.insertNodes(editor, mention as Descendant);
  Transforms.move(editor);
}

/*
export const InsertMentionModal = ({ onClose }) => {
  const editor = useSlate();
  const [mention, setUserId] = useState("");

  const insertMention = () => {
    if (!mention) return;
    const mention: MentionElement = {
      type: ComponentType.Mention,
      mention,
      children: [{ text: "@" + mention }],
    };
    Transforms.insertNodes(editor, mention);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 shadow-2xl w-96 animate-in fade-in-0 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Insert Mention
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <input
          type="text"
          value={mention}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter User ID"
          className="border border-gray-300 p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              insertMention();
            }
          }}
          autoFocus
        />
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onMouseDown={(e) => {
              e.preventDefault();
              insertMention();
            }}
            disabled={!mention}
          >
            Insert
          </Button>
        </div>
      </div>
    </div>
  );
};
*/

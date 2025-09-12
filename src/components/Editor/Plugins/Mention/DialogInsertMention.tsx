import React, { useState } from "react";
import { useSlate } from "slate-react";
import { Transforms } from "slate";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ComponentType } from "../../slate";

export type MentionElement = {
  type: ComponentType.Mention;
  character: string;
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
  const [userId, setCharacter] = useState("");

  const handleInsert = () => {
    if (!userId) return;

    const mention: MentionElement = {
      type: ComponentType.Mention,
      character: userId,
      children: [{ text: "" }],
    };

    Transforms.insertNodes(editor, mention);
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
            value={userId}
            onChange={(e) => setCharacter(e.target.value)}
            placeholder="Character to mention..."
            autoFocus
          />
          <Button onClick={handleInsert} disabled={!userId} className="w-full">
            Insert Mention
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
/*
export const InsertMentionModal = ({ onClose }) => {
  const editor = useSlate();
  const [userId, setUserId] = useState("");

  const insertMention = () => {
    if (!userId) return;
    const mention: MentionElement = {
      type: ComponentType.Mention,
      userId,
      children: [{ text: "@" + userId }],
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
          value={userId}
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
            disabled={!userId}
          >
            Insert
          </Button>
        </div>
      </div>
    </div>
  );
};
*/

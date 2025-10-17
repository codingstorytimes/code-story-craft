import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ComponentType, CustomEditor } from "../../slate";

import { X } from "lucide-react";
import { Editor, Transforms, Descendant } from "slate";
import { MentionElement } from "./MentionElement";

export function insertMention(editor: Editor, character: string) {
  const mention: MentionElement = {
    type: ComponentType.Mention,
    character,
    children: [{ text: "" }],
  };

  Transforms.insertNodes(editor, mention as unknown as Descendant);
  Transforms.move(editor);
}

interface DialogInsertMentionProps {
  isOpen: boolean;
  onClose: () => void;
  editor: CustomEditor;
  userId?: string;
}

export function DialogInsertMention({
  isOpen,
  onClose,
  editor,
}: DialogInsertMentionProps) {
  const [character, setCharacter] = useState("");

  const handleInsert = () => {
    if (!character) return;

    insertMention(editor, character);
    onClose();
    setCharacter("");
  };

  if (!isOpen) return null;

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

        <Input
          value={character}
          onChange={(e) => setCharacter(e.target.value)}
          placeholder="Character to mention..."
          autoFocus
          className="mb-4"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleInsert();
            }
          }}
        />

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onMouseDown={(e) => {
              e.preventDefault();
              handleInsert();
            }}
            disabled={!character}
          >
            Insert
          </Button>
        </div>
      </div>
    </div>
  );
}

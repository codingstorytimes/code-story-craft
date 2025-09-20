import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StoryAutocomplete from "@/components/StoryAutocomplete";
import { IEmbedType } from "../../slate";

import { CustomEditor } from "../../slate";

import { useState } from "react";
import { insertEmbeddedStory } from "./EmbeddedStoryPlugin";
import CreatableSelect from "react-select/creatable";

interface DialogEmbeddedStoryProps {
  isOpen: boolean;
  onClose: () => void;
  handler?: (data?: { storyId: string; embedType: IEmbedType }) => void;
}

export default function DialogEmbeddedStory({
  isOpen,
  onClose,
  handler,
}: DialogEmbeddedStoryProps) {
  const [showDialogEmbeddedStory, setShowDialogEmbeddedStory] =
    useState(isOpen);
  const [embedStoryId, setEmbedStoryId] = useState("");
  const [embedType, setEmbedType] = useState<IEmbedType>("inline");

  return (
    <Dialog
      open={showDialogEmbeddedStory}
      onOpenChange={setShowDialogEmbeddedStory}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            setShowDialogEmbeddedStory(true);
          }}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Embed Story</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Select Story</label>
            <StoryAutocomplete
              onSelect={setEmbedStoryId}
              placeholder="Search and select a story to embed..."
            />
          </div>
          <div>
            <label className="text-sm font-medium">Display Type</label>
            <Select
              value={embedType}
              onValueChange={(value: IEmbedType) => setEmbedType(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mini">Mini Card</SelectItem>
                <SelectItem value="inline">Inline Preview</SelectItem>
                <SelectItem value="full">Full Content</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => {
              setShowDialogEmbeddedStory(false);
              if (handler && embedStoryId) {
                handler({ storyId: embedStoryId, embedType });
              }
              onClose();
            }}
            className="w-full"
            disabled={!embedStoryId}
          >
            Insert Embed
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

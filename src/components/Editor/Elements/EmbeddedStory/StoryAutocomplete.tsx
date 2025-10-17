import { useState, useRef, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Search } from "lucide-react";
import { useStories } from "@/hooks/useStories";

interface StoryAutocompleteProps {
  initialValue?: string;
  userId?: string;
  onSelect: (storyId: string, storyTitle: string) => void;
  placeholder?: string;
}

export default function StoryAutocomplete({
  onSelect,
  placeholder = "Search stories...",
  initialValue = "",
}: StoryAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(initialValue);
  const { stories, searchStories } = useStories();

  const handleSelect = (storyId: string) => {
    const story = stories.find((s) => s.id === storyId);
    if (story) {
      onSelect(storyId, story.title);
      setOpen(false);
      setValue("");
    }
  };

  const filteredStories = value ? searchStories(value) : stories.slice(0, 10);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Search className="w-4 h-4 mr-2" />
          {placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <Command>
          <CommandInput
            placeholder={placeholder}
            value={value}
            onValueChange={setValue}
          />
          <CommandEmpty>No stories found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-y-auto">
            {filteredStories.map((story) => (
              <CommandItem
                key={story.id}
                value={story.id}
                onSelect={handleSelect}
                className="flex items-start gap-3 p-3"
              >
                <FileText className="w-4 h-4 mt-1 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{story.title}</div>
                  <div className="text-sm text-muted-foreground truncate">
                    {story.excerpt}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {story.category}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {story.storyType}
                    </Badge>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

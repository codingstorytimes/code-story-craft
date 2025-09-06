import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { ICodingStory } from "@/common/types/types";

interface MiniStoryCardProps {
  story: ICodingStory;
  className?: string;
}

export function MiniStoryCard({ story, className }: MiniStoryCardProps) {
  const { title, storyType } = story;

  return (
    <div
      className={`border border-border rounded-lg p-3 bg-accent/30 ${className}`}
    >
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-primary" />
        <span className="font-medium text-sm">{title}</span>
        <Badge variant="outline" className="text-xs">
          {storyType}
        </Badge>
      </div>
    </div>
  );
}

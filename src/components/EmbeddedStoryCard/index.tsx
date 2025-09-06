import { ICodingStory } from "@/common/types/types";
import { MiniStoryCard } from "./MiniStoryCard";
import { InlineStoryCard } from "./InlineStoryCard";
import { FullStoryCard } from "./FullStoryCard";

interface EmbeddedStoryCardProps {
  story: ICodingStory;
  embedType: "mini" | "inline" | "full";
  className?: string;
}

export default function EmbeddedStoryCard({
  story,
  embedType,
  className,
}: EmbeddedStoryCardProps) {
  if (embedType === "mini") {
    return <MiniStoryCard story={story} className={className} />;
  }

  if (embedType === "inline") {
    return <InlineStoryCard story={story} className={className} />;
  }

  return <FullStoryCard story={story} className={className} />;
}

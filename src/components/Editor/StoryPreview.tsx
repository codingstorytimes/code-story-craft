import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Heart, MessageSquare } from "lucide-react";
import { RichTextViewer } from "@/components/RichTextViewer";
import { ICodingStory } from "@/common/types/types";

interface IStoryPreviewProps {
  story: ICodingStory;
  className?: string;
}

export function StoryPreview({ story, className }: IStoryPreviewProps) {
  const {
    title,
    content,
    author,
    category,
    storyType,
    readTime,
    likes,
    comments,
    tags,
  } = story;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2 mb-4">
          {category && <Badge variant="secondary">{category}</Badge>}
          {storyType && <Badge variant="outline">{storyType}</Badge>}
        </div>
        <CardTitle className="text-3xl">{title}</CardTitle>
        <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
          <span>By {author?.name || "Anonymous"}</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {readTime || "1 min read"}
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {likes}
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              {comments}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <RichTextViewer content={content} />
      </CardContent>
    </Card>
  );
}

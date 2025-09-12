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
    <>
      <Card className={`my-6 ${className}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{title}</CardTitle>
            <Badge variant="secondary">{storyType}</Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>By {author.name}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {readTime}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              {comments}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <RichTextViewer content={content} />
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-sm">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

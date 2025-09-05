import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, Heart, MessageSquare } from "lucide-react";
import { Story } from "@/common/types/types";

interface EmbeddedStoryCardProps {
  story: Story;
  embedType: 'mini' | 'inline' | 'full';
  className?: string;
}

export default function EmbeddedStoryCard({ story, embedType, className }: EmbeddedStoryCardProps) {
  if (embedType === 'mini') {
    return (
      <div className={`border border-border rounded-lg p-3 bg-accent/30 ${className}`}>
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm">{story.title}</span>
          <Badge variant="outline" className="text-xs">{story.storyType}</Badge>
        </div>
      </div>
    );
  }

  if (embedType === 'inline') {
    return (
      <Card className={`my-4 border-l-4 border-l-primary ${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{story.title}</CardTitle>
            <Badge variant="secondary">{story.storyType}</Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {story.readTime}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {story.likes}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-3">{story.excerpt}</p>
          <div className="flex flex-wrap gap-1">
            {story.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full embed
  return (
    <Card className={`my-6 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{story.title}</CardTitle>
          <Badge variant="secondary">{story.storyType}</Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>By {story.author}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {story.readTime}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            {story.likes}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            {story.comments}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none">
          {story.content.split('\n').slice(0, 10).map((paragraph, index) => (
            <p key={index} className="mb-3">{paragraph}</p>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {story.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-sm">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
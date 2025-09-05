import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Heart, MessageSquare } from "lucide-react";
import { RichTextViewer } from "@/components/RichTextViewer";

interface StoryPreviewProps {
  title: string;
  content: string;
  category: string;
  storyType: string;
  tags: string[];
  readTime: string;
  authorName: string;
}

export default function StoryPreview({ 
  title, 
  content, 
  category, 
  storyType, 
  tags, 
  readTime, 
  authorName 
}: StoryPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary">{category}</Badge>
          <Badge variant="outline">{storyType}</Badge>
        </div>
        <CardTitle className="text-3xl">{title}</CardTitle>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>By {authorName}</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {readTime}
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              0
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              0
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <RichTextViewer content={content} />
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-6">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
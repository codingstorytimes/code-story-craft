import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Heart, MessageCircle, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { ICodingStory } from "@/common/types/types";
import { cn } from "@/common/utils";

interface IExcerptCardProps {
  story: ICodingStory;
  className?: string;
}

export function ExcerptCard({ story, className }: IExcerptCardProps) {
  const {
    id,
    title,
    excerpt,
    author,
    category,
    readTime,
    likes,
    comments,
    tags,
  } = story;

  return (
    <Card
      className={cn(
        "group hover:shadow-hover transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-border/50",
        className
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <Badge
              variant="secondary"
              className="mb-2 bg-accent text-accent-foreground"
            >
              {category}
            </Badge>
            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
              {title}
            </h3>
          </div>
          <BookOpen className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {author.name}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {readTime}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-muted-foreground mb-4 line-clamp-3">{excerpt}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1 hover:text-story-purple transition-colors cursor-pointer">
              <Heart className="w-4 h-4" />
              {likes}
            </div>
            <div className="flex items-center gap-1 hover:text-story-blue transition-colors cursor-pointer">
              <MessageCircle className="w-4 h-4" />
              {comments}
            </div>
          </div>

          <Link to={`/story/${id}`}>
            <Button variant="ghost" size="sm" className="group-hover:bg-accent">
              Read Story
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

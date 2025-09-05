import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, BookmarkPlus, Clock, User, ArrowLeft, Edit } from "lucide-react";
import { useStories } from "@/hooks/useStories";
import { useToast } from "@/hooks/use-toast";
import { storyTypeLabels } from "@/data/data";

import {  RichTextViewer } from "@/components/RichTextViewer";

export default function StoryDetail() {
  const { id } = useParams<{ id: string }>();
  const { getStoryById } = useStories();
  const { toast } = useToast();
  
  const story = id ? getStoryById(id) : undefined;

  if (!story) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Story Not Found</h1>
            <p className="text-muted-foreground mb-6">The story you're looking for doesn't exist.</p>
            <Link to="/stories">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Stories
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const handleLike = () => {
    toast({
      title: "Story Liked! ❤️",
      description: "Your appreciation has been noted"
    });
  };

  const handleBookmark = () => {
    toast({
      title: "Story Bookmarked! 🔖",
      description: "Added to your reading list"
    });
  };

  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied! 📋",
      description: "Story link copied to clipboard"
    });
  };




  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/stories">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Stories
            </Button>
          </Link>
        </div>

        {/* Story Header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">{story.category}</Badge>
            <Badge variant="outline">{storyTypeLabels[story.storyType]}</Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            {story.title}
          </h1>

          {/* Author Info */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {story.author.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{story.author}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {story.readTime}
                  </span>
                  <span>{story.createdAt}</span>
                </div>
              </div>
            </div>

             {/* Action Buttons */}
             <div className="flex items-center gap-2">
               <Link to={`/edit/${story.id}`}>
                 <Button variant="outline" size="sm">
                   <Edit className="w-4 h-4 mr-1" />
                   Edit
                 </Button>
               </Link>
               <Button variant="ghost" size="sm" onClick={handleLike}>
                 <Heart className="w-4 h-4 mr-1" />
                 {story.likes}
               </Button>
               <Button variant="ghost" size="sm" onClick={handleShare}>
                 <Share2 className="w-4 h-4" />
               </Button>
               <Button variant="ghost" size="sm" onClick={handleBookmark}>
                 <BookmarkPlus className="w-4 h-4" />
               </Button>
             </div>
          </div>
        </div>

        {/* Story Content */}
        <Card className="mb-8">
          <div className="p-8">
            <RichTextViewer content={story.content} className="prose prose-lg max-w-none" />
          </div>
        </Card>

        {/* Tags */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {story.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-sm">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Engagement Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button 
                  className="flex items-center gap-2 text-muted-foreground hover:text-story-purple transition-colors"
                  onClick={handleLike}
                >
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">{story.likes} likes</span>
                </button>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">{story.comments} comments</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm" onClick={handleBookmark}>
                  <BookmarkPlus className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Placeholder */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Comments ({story.comments})</h3>
            <div className="text-center text-muted-foreground py-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Comments feature coming soon!</p>
              <p className="text-sm">Join the discussion and share your thoughts.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
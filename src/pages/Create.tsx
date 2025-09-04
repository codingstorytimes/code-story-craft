import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PenTool, BookOpen, Lightbulb, Users, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RichTextEditor from "@/components/RichTextEditor";
import { storyTypes ,categories} from "@/data/data";


export default function Create() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [storyType, setStoryType] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const { toast } = useToast();

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content || !category || !storyType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically submit to an API
    toast({
      title: "Story Published! 🎉",
      description: "Your story has been shared with the community",
    });

    // Reset form
    setTitle("");
    setContent("");
    setCategory("");
    setStoryType("");
    setTags([]);
  };

  return (
    <Layout>
      <div className="bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <PenTool className="w-16 h-16 text-white mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Share Your Story
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Help fellow developers learn through the power of storytelling
            </p>
          </div>
        </div>
      </div>


      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Story Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>What type of story are you sharing?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {storyTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div
                      key={type.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-card ${
                        storyType === type.id
                          ? "border-primary bg-accent"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setStoryType(type.id)}
                    >
                      <Icon className="w-8 h-8 text-primary mb-3" />
                      <h3 className="font-semibold mb-2">{type.title}</h3>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Story Details */}
          <Card>
            <CardHeader>
              <CardTitle>Story Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Title *
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your story a compelling title..."
                  className="text-lg"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                >
                  <option value="">Select a category...</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium mb-2">
                  Your Story *
                </label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Tell your story... Be creative, be helpful, be memorable!"
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Tip: Use the formatting tools above for better readability
                </p>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium mb-2">
                  Tags
                </label>
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add tags (press Enter to add)..."
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          {title && content && (
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {category && (
                      <Badge variant="secondary">{category}</Badge>
                    )}
                    {storyType && (
                      <Badge variant="outline">
                        {storyTypes.find(t => t.id === storyType)?.title}
                      </Badge>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold">{title}</h2>
                  <div className="prose max-w-none">
                    <p className="text-muted-foreground">
                      {content.slice(0, 200)}...
                    </p>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline">
              Save Draft
            </Button>
            <Button type="submit" variant="hero" size="lg">
              Publish Story
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PenTool, Edit, Eye, Hash, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import SlateEditor from "@/components/Editor/SlateEditor";
import { StoryPreview } from "@/components/Editor/StoryPreview";
import { storyTypes, categories } from "@/data/data";
import { useStories } from "@/hooks/useStories";
import { EnumStoryType } from "@/common/types/types";

export default function Create() {
  const { id } = useParams();
  const { getStoryById } = useStories();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [storyType, setStoryType] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const { toast } = useToast();
  const isEditing = Boolean(id);

  // 🔒 Hardcoded or retrieved from auth context in production app
  const userId = "codingstorytime";

  // Load existing story if editing
  useEffect(() => {
    if (id) {
      const story = getStoryById(id);
      if (story) {
        setTitle(story.title);
        setContent(story.content);
        setCategory(story.category);
        setStoryType(story.storyType);
        setTags(story.tags);
      }
    }
  }, [id, getStoryById]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (
      e.key === "Enter" &&
      tagInput.trim() &&
      !tags.includes(tagInput.trim())
    ) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content || !category || !storyType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Normally you’d call an API here
    toast({
      title: isEditing ? "Story Updated! ✨" : "Story Published! 🎉",
      description: isEditing
        ? "Your story has been updated successfully"
        : "Your story has been shared with the community",
    });

    // Reset form
    setTitle("");
    setContent("");
    setCategory("");
    setStoryType("");
    setTags([]);
    setTagInput("");
    setActiveTab("write");
  };

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            {isEditing ? (
              <Edit className="w-16 h-16 text-white mx-auto mb-4" />
            ) : (
              <PenTool className="w-16 h-16 text-white mx-auto mb-4" />
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {isEditing ? "Edit Your Story" : "Share Your Story"}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {isEditing
                ? "Update your story to share new insights with the community"
                : "Help fellow developers learn through the power of storytelling"}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
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
                      <p className="text-sm text-muted-foreground">
                        {type.description}
                      </p>
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
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium mb-2"
                >
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

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium mb-2"
                >
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
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              {/* Tags */}
              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium mb-2"
                >
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

              {/* Content Tabs */}
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium mb-2"
                >
                  Your Story *
                </label>
                <Tabs
                  value={activeTab}
                  onValueChange={(value) =>
                    setActiveTab(value as "write" | "preview")
                  }
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger
                      value="write"
                      className="flex items-center gap-2"
                    >
                      <Hash className="w-4 h-4" /> Write
                    </TabsTrigger>
                    <TabsTrigger
                      value="preview"
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" /> Preview
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="write" className="mt-0">
                    <SlateEditor
                      story={isEditing ? { 
                        id: id!, 
                        title, 
                        content, 
                        category, 
                        storyType: storyType as EnumStoryType,
                        tags,
                        excerpt: "",
                        author: { id: userId, name: "You" },
                        readTime: "5 min read",
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        isEmbeddable: false,
                        likes: 0,
                        comments: 0
                      } : undefined}
                      onChange={setContent}
                      userId={userId}
                    />
                  </TabsContent>

                  <TabsContent value="preview" className="mt-0">
                    <div className="p-4 border rounded-md">
                      {title || category || storyType || tags.length > 0 ? (
                        <StoryPreview
                          story={{
                            id: "preview-temp",
                            title: title || "Untitled Story",
                            content: content,
                            excerpt: "",
                            author: { id: "preview-author", name: "You" },
                            category: category || "Uncategorized",
                            storyType: storyType as EnumStoryType,
                            tags: tags || [],
                            readTime: "5 min read",
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            isEmbeddable: false,
                            likes: 0,
                            comments: 0,
                          }}
                        />
                      ) : (
                        <div className="text-center text-muted-foreground py-12">
                          <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>Add a title and content to see the preview</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
                <p className="text-sm text-muted-foreground mt-2">
                  Tip: Use the formatting tools above for better readability
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline">
              Save Draft
            </Button>
            <Button type="submit" variant="hero" size="lg">
              {isEditing ? "Update Story" : "Publish Story"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

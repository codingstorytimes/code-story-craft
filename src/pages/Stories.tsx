import { useState } from "react";
import Layout from "@/components/Layout";
import StoryCard from "@/components/StoryCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, TrendingUp, Clock, Heart } from "lucide-react";
import { useStories } from "@/hooks/useStories";

import { categories} from "@/data/data";

export default function Stories() {
  const { stories, searchStories } = useStories();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("latest");

  const filteredStories = searchStories(
    searchTerm, 
    selectedCategory === "All" ? undefined : selectedCategory
  );

  return (
    <Layout>
      <div className="bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Developer Stories
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Discover programming concepts through the art of storytelling
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search stories, concepts, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
              >
                <option value="latest">Latest</option>
                <option value="popular">Most Popular</option>
                <option value="trending">Trending</option>
              </select>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer transition-colors hover:bg-accent"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-muted/30 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-story-purple/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-story-purple" />
              </div>
              <div>
                <div className="font-semibold">{filteredStories.length} Stories</div>
                <div className="text-sm text-muted-foreground">Available to read</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-story-blue/10 rounded-lg">
                <Clock className="w-5 h-5 text-story-blue" />
              </div>
              <div>
                <div className="font-semibold">~30 min</div>
                <div className="text-sm text-muted-foreground">Total reading time</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-story-warm/10 rounded-lg">
                <Heart className="w-5 h-5 text-story-green" />
              </div>
              <div>
                <div className="font-semibold">650+ Likes</div>
                <div className="text-sm text-muted-foreground">From the community</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <StoryCard key={story.id} {...story} />
          ))}
        </div>

        {filteredStories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No stories found matching your criteria.</p>
            <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
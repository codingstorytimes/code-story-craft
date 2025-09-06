import { ICodingStory } from "@/common/types/types";
import { useState } from "react";
import { sampleStories } from "@/data/stories";

export function useStories() {
  const [stories, setStories] = useState<ICodingStory[]>(sampleStories);

  const getStoryById = (id: string): ICodingStory | undefined => {
    return stories.find((story) => story.id === id);
  };

  const searchStories = (query: string, category?: string): ICodingStory[] => {
    return stories.filter((story) => {
      const matchesQuery =
        !query ||
        story.title.toLowerCase().includes(query.toLowerCase()) ||
        story.content.toLowerCase().includes(query.toLowerCase()) ||
        story.tags.some((tag) =>
          tag.toLowerCase().includes(query.toLowerCase())
        );

      const matchesCategory = !category || story.category === category;

      return matchesQuery && matchesCategory;
    });
  };

  const getFeaturedStories = (): ICodingStory[] => {
    return [...stories].sort((a, b) => b.likes - a.likes).slice(0, 3); // top 3
  };

  return {
    stories,
    getFeaturedStories,
    getStoryById,
    searchStories,
    setStories,
  };
}

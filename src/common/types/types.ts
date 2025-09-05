import { EnumStoryType } from "./story";

export interface Story {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    author: string;
    category: string;
    storyType: EnumStoryType;
    readTime: string;
    likes: number;
    comments: number;
    tags: string[];
    createdAt: string;
  }

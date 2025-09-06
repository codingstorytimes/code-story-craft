export enum EnumStoryType {
  Tutorial = "Tutorial", // step-by-step teaching
  Analogy = "Analogy", // concept explained via comparison
  Mnemonic = "Mnemonic", // memory aid
  Story = "Story", // narrative: anecdote, satire, memoir, fictional
}

export interface IAttribution {
  originalAuthor?: string;
  originalUrl?: string;
  licenseType?: string;
  details?: string;
}

export interface IEmbeddedStory {
  storyId: string;
  embedType: "mini" | "inline" | "full";
}

export interface IAuthor {
  id: string;
  name: string;
}

export interface ICodingStory {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: IAuthor;
  tags: string[];
  category: string;
  storyType: EnumStoryType;
  readTime: string;
  createdAt: string;
  updatedAt?: string;
  isEmbeddable: boolean;
  embedUrl?: string;
  attribution?: IAttribution;
  embeddedStories?: IEmbeddedStory[];
  likes: number;
  comments: number;
}

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
  attribution?: IAttribution;
  author: IAuthor;
  category: string;
  comments: number;
  content: string;
  createdAt: string;
  embeddedStories?: IEmbeddedStory[];
  embedUrl?: string;
  excerpt: string;
  isEmbeddable: boolean;
  lastSaved?: string;
  likes: number;
  readTime: string;
  storyType: EnumStoryType;
  tags: string[];
  title: string;
  updatedAt?: string;
}

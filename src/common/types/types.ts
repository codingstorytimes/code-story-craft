export enum EnumStoryType {
  Tutorial = "Tutorial", // step-by-step teaching
  Analogy = "Analogy", // real-world analogy
  Mnemonic = "Mnemonic", //Clever mnemonics: Simple tricks and memory aids to understand complex ideas.
  Anecdotes = "Anecdotes", //Real-life programming experiences,memoir about challenges and successes.
  Story = "Story", // narrative: satire,  imaginative tales: fictional stories that bring abstract coding concepts to life.
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
  content: string; //markdown
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

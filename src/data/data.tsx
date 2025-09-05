import { BookOpen, Lightbulb, Users, GraduationCap } from "lucide-react";

export const storyTypeLabels = {
  Tutorial: "Tutorial",
  Analogy: "Analogy",
  Mnemonic: "Mnemonic",
  Story: "Story"
};

export const categories = [
  "All", "Algorithms", "Data Structures", "Design Patterns", "JavaScript", "Python",
  "Java", "Database", "APIs", "Frontend", "Backend", "DevOps", "Testing"
];

export const storyTypes = [
  {
    id: "Tutorial",
    title: "Tutorial",
    description: "Step-by-step teaching guide",
    icon: GraduationCap,
  },
  {
    id: "Analogy",
    title: "Analogy",
    description: "Explain concepts through comparisons",
    icon: Lightbulb,
  },
  {
    id: "Mnemonic",
    title: "Mnemonic",
    description: "Memory aids, acronyms, and tricks",
    icon: Users,
  },
  {
    id: "Story",
    title: "Story",
    description: "Narrative: anecdote, satire, memoir, fictional",
    icon: BookOpen,
  },
];



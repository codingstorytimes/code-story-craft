import {  BookOpen, Lightbulb, Users } from "lucide-react";

export const storyTypeLabels = {
  anecdote: "Real-Life Anecdote",
  fictional: "Fictional Story", 
  mnemonic: "Mnemonic/Acronym"
};

export  const categories  = [
    "All", "Algorithms", "Data Structures", "Design Patterns", "JavaScript", "Python",
    "Java", "Database", "APIs", "Frontend", "Backend", "DevOps", "Testing"
  ];
  
  export const storyTypes = [
    { 
      id: "anecdote", 
      title: "Real-Life Anecdote", 
      description: "Share a true story from your coding experience",
      icon: Users
    },
    { 
      id: "fictional", 
      title: "Fictional Story", 
      description: "Create an imaginative tale to explain concepts",
      icon: BookOpen
    },
    { 
      id: "mnemonic", 
      title: "Mnemonic/Acronym", 
      description: "Help others remember with clever memory aids",
      icon: Lightbulb
    }
  ];



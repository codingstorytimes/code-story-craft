import React, { useState } from "react";
import SlateEditorCore from "@/components/Editor/SlateEditorCore";
import { ComponentType } from "@/components/Editor/slate";
import { Descendant } from "slate";

export default function SimpleExample() {
  const [content, setContent] = useState<Descendant[]>([
    {
      type: ComponentType.Paragraph,
      children: [{ text: "Start writing your story..." }],
    },
  ]);

  const handleContentChange = (newContent: Descendant[]) => {
    setContent(newContent);
  };

  const handleSave = async () => {
    console.log("Saving content:", content);
    alert("Content saved!");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Simple Slate Editor Example</h1>
      <div className="border rounded-lg">
        <SlateEditorCore
          value={content}
          onChange={handleContentChange}
          userId="demo-user"
        />
      </div>
    </div>
  );
}
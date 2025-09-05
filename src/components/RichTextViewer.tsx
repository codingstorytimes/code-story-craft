import { cn } from "@/common/utils"
import React from "react"

interface RichTextViewerProps {
  content: string;
  className?: string;
}

export const RichTextViewer = ({ content, className }: RichTextViewerProps) => {
  return (
    <div className={cn("prose prose-slate max-w-none", className)}>
      {content.split('\n').map((paragraph, index) => (
        <p key={index} className="mb-4 leading-relaxed">
          {paragraph}
        </p>
      ))}
    </div>
  );
};


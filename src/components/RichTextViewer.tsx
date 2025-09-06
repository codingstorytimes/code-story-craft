import { cn } from "@/common/utils"
import React from "react"

interface RichTextViewerProps {
  content: string;
  className?: string;
}

export const RichTextViewer = ({ content, className }: RichTextViewerProps) => {
  // Simple markdown to JSX conversion for basic elements
  const renderMarkdown = (text: string) => {
    if (!text) return null;
    
    // Split by lines and process each
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let codeBlockLang = '';
    
    lines.forEach((line, index) => {
      // Code block handling
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End of code block
          elements.push(
            <pre key={`code-${index}`} className="bg-muted p-4 rounded-md overflow-x-auto">
              <code className={codeBlockLang ? `language-${codeBlockLang}` : ''}>
                {codeBlockContent.join('\n')}
              </code>
            </pre>
          );
          inCodeBlock = false;
          codeBlockContent = [];
          codeBlockLang = '';
        } else {
          // Start of code block
          codeBlockLang = line.replace('```', '');
          inCodeBlock = true;
        }
        return;
      }
      
      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }
      
      // Skip empty lines
      if (!line.trim()) {
        elements.push(<br key={`br-${index}`} />);
        return;
      }
      
      // Headers
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={index} className="text-3xl font-bold mb-4 mt-6">
            {line.replace('# ', '')}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="text-2xl font-semibold mb-3 mt-5">
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-xl font-semibold mb-2 mt-4">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('> ')) {
        // Blockquote
        elements.push(
          <blockquote key={index} className="border-l-4 border-border pl-4 italic my-4">
            {formatInlineMarkdown(line.replace('> ', ''))}
          </blockquote>
        );
      } else if (line.match(/^\d+\.\s/)) {
        // Numbered list item
        const content = line.replace(/^\d+\.\s/, '');
        elements.push(
          <ol key={index} className="list-decimal list-inside mb-2">
            <li>{formatInlineMarkdown(content)}</li>
          </ol>
        );
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        // Bullet list item
        const content = line.replace(/^[-*]\s/, '');
        elements.push(
          <ul key={index} className="list-disc list-inside mb-2">
            <li>{formatInlineMarkdown(content)}</li>
          </ul>
        );
      } else {
        // Regular paragraph
        elements.push(
          <p key={index} className="mb-4 leading-relaxed">
            {formatInlineMarkdown(line)}
          </p>
        );
      }
    });
    
    return elements;
  };
  
  // Handle inline markdown formatting
  const formatInlineMarkdown = (text: string): React.ReactNode => {
    if (!text) return text;
    
    // Handle embedded stories
    const embeddedStoryRegex = /<embedded-story id="([^"]+)"(?: embedType="([^"]+)")?\s*\/?>/g;
    const parts = text.split(embeddedStoryRegex);
    
    const result: React.ReactNode[] = [];
    for (let i = 0; i < parts.length; i += 3) {
      let part = parts[i];
      if (!part) continue;
      
      // Apply text formatting
      part = part
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
        .replace(/<u>([^<]+)<\/u>/g, '<u>$1</u>');
      
      result.push(
        <span 
          key={i} 
          dangerouslySetInnerHTML={{ __html: part }}
        />
      );
      
      // Handle embedded story placeholder
      const storyId = parts[i + 1];
      const embedType = parts[i + 2];
      if (storyId) {
        result.push(
          <div key={`embed-${i}`} className="my-4 p-4 border border-dashed border-border rounded-lg text-center text-muted-foreground">
            📖 Embedded Story: {storyId} ({embedType || 'inline'})
          </div>
        );
      }
    }
    
    return result.length > 1 ? result : result[0] || text;
  };

  return (
    <div className={cn("prose prose-slate max-w-none dark:prose-invert", className)}>
      {renderMarkdown(content)}
    </div>
  );
};


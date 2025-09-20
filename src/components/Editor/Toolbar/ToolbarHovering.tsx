import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";

import { Editor, Range } from "slate";
import { ReactEditor, useSlate } from "slate-react";

import { Bold, Italic, Underline, Code, Strikethrough } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isMarkActive, toggleMark } from "../editorUtils";

const Portal = ({ children }: { children: React.ReactNode }) => {
  return ReactDOM.createPortal(children, document.body);
};

/**
 * A hovering toolbar that appears over selected text.
 */
interface HoveringToolbarProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export default function HoveringToolbar({
  children,
  className = "",
  ...props
}: HoveringToolbarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const editor = useSlate();

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) return;

    if (
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ""
    ) {
      if (el) el.removeAttribute("style");
      return;
    }

    const domSelection = window.getSelection();
    if (!domSelection || domSelection.rangeCount === 0) return;

    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();

    if (el) {
      el.style.opacity = "1";
      el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight - 4}px`;
      el.style.left = `${
        rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2
      }px`;
    }
  });

  return (
    <Portal>
      <div
        ref={ref}
        className={`
          absolute z-10 
          top-[-10000px] left-[-10000px] 
          opacity-0 
          bg-gray-200 
          rounded 
          px-2 py-1 
          transition-opacity duration-700 
          flex gap-1
          ${className}
        `}
        {...props}
      >
        {!children && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={isMarkActive(editor, "bold") ? "bg-accent" : ""}
              onClick={(e) => {
                e.preventDefault();
                toggleMark(editor, "bold");
              }}
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={isMarkActive(editor, "italic") ? "bg-accent" : ""}
              onClick={(e) => {
                e.preventDefault();
                toggleMark(editor, "italic");
              }}
            >
              <Italic className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={isMarkActive(editor, "underline") ? "bg-accent" : ""}
              onClick={(e) => {
                e.preventDefault();
                toggleMark(editor, "underline");
              }}
            >
              <Underline className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={isMarkActive(editor, "code") ? "bg-accent" : ""}
              onClick={(e) => {
                e.preventDefault();
                toggleMark(editor, "code");
              }}
            >
              <Code className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={
                isMarkActive(editor, "strikethrough") ? "bg-accent" : ""
              }
              onClick={(e) => {
                e.preventDefault();
                toggleMark(editor, "strikethrough");
              }}
            >
              <Strikethrough className="w-4 h-4" />
            </Button>
          </>
        )}
        {children}
      </div>
    </Portal>
  );
}

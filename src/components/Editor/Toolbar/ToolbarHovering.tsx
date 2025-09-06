import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";

import { Editor, Range } from "slate";
import { ReactEditor, useSlate } from "slate-react";

import BoldButton from "../Buttons/BoldButton";
import ItalicButton from "../Buttons/ItalicButton";
import UnderlinedButton from "../Buttons/UnderlinedButton";
import StrikethroughButton from "../Buttons/StrikethroughButton";
import CodeButton from "../Buttons/CodeButton";
import { Bold, Italic, UnderlineIcon, Code } from "lucide-react";
import MarkButton from "./MarkButtons";
import { Button } from "@/components/ui/button";
import { isMarkActive, toggleMark } from "../editorUtils";

const Portal = ({ children }) => {
  return ReactDOM.createPortal(children, document.body);
};

/**
 * A hovering toolbar that appears over selected text.
 */
export default function HoveringToolbar({
  children,
  className = "",
  ...props
}) {
  const ref = useRef();
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
      el.removeAttribute("style");
      return;
    }

    const domSelection = window.getSelection();
    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();

    el.style.opacity = 1;
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight - 4}px`;
    el.style.left = `${
      rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2
    }px`;
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
              onMouseDown={(e) => {
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
              onMouseDown={(e) => {
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
              onMouseDown={(e) => {
                e.preventDefault();
                toggleMark(editor, "underline");
              }}
            >
              <UnderlineIcon className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={isMarkActive(editor, "code") ? "bg-accent" : ""}
              onMouseDown={(e) => {
                e.preventDefault();
                toggleMark(editor, "code");
              }}
            >
              <Code className="w-4 h-4" />
            </Button>

            <StrikethroughButton />
          </>
        )}
        {children}
      </div>
    </Portal>
  );
}

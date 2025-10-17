// -----------------------------
// DialogInsertLink (self-contained)

import { ComponentType, CustomEditor } from "@/components/Editor/slate";
import { useState, useRef, useEffect } from "react";
import {
  Editor,
  Transforms,
  Range,
  Path,
  Node,
  Element as SlateElement,
} from "slate";

import { ReactEditor } from "slate-react";
import { LinkElement, LinkEvents } from "./LinkElement";

// -----------------------------
// Slate helpers
// -----------------------------
export const isLinkActive = (editor: CustomEditor) => {
  try {
    const matches = Array.from(
      Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          (n as any).type === ComponentType.Link,
      })
    );
    return matches.length > 0;
  } catch (err) {
    return false;
  }
};

export const setLink = (
  editor: CustomEditor,
  node: LinkElement | null,
  url: string,
  text: string,
  path?: Path
) => {
  const link: LinkElement = {
    type: ComponentType.Link,
    url,
    children: [{ text }],
  };
  if (node && (node as any).type === ComponentType.Link) {
    const nodePath = path || ReactEditor.findPath(editor, node);
    Transforms.setNodes(editor, { url }, { at: nodePath });
    Transforms.insertText(editor, text, { at: nodePath });
  } else {
    if (editor.selection && Range.isExpanded(editor.selection)) {
      Transforms.wrapNodes(editor, link, { split: true });
      Transforms.collapse(editor, { edge: "end" });
    } else {
      Transforms.insertNodes(editor, link);
    }
  }
};

export const unwrapLink = (editor: CustomEditor) => {
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      (n as any).type === ComponentType.Link,
  });
};

// -----------------------------
interface DialogInsertLinkProps {
  editor: CustomEditor;
}
export const DialogInsertLink: React.FC<DialogInsertLinkProps> = ({
  editor,
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogData, setDialogData] = useState<{
    text: string;
    url: string;
    node: LinkElement | null;
    path: Path | null;
  }>({
    text: "",
    url: "",
    node: null,
    path: null,
  });
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOpenEvent = (e: Event) => {
      const ev = e as CustomEvent;
      const node = ev.detail?.node || null;

      let newData;
      if (node) {
        const path = ReactEditor.findPath(editor, node as any);
        newData = {
          text: Editor.string(editor, path) || "",
          url: (node as any).url || "",
          node: node as LinkElement,
          path,
        };
      } else {
        const selection = editor.selection;
        const selectedText =
          selection && Range.isExpanded(selection)
            ? Editor.string(editor, selection)
            : "";
        newData = { text: selectedText, url: "", node: null, path: null };
      }

      setDialogData(newData);
      setShowDialog(true);
    };

    window.addEventListener(LinkEvents.OPEN, handleOpenEvent);
    return () => window.removeEventListener(LinkEvents.OPEN, handleOpenEvent);
  }, [editor]);

  // close on outside click or ESC
  useEffect(() => {
    const onDown = (ev: MouseEvent | Event) => {
      const e = ev as MouseEvent;
      if (
        dialogRef.current &&
        "target" in e &&
        !dialogRef.current.contains(e.target as Node)
      ) {
        setShowDialog(false);
      }
    };
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") setShowDialog(false);
    };
    if (showDialog) {
      document.addEventListener("mousedown", onDown as any);
      document.addEventListener("keydown", onKey);
    }
    return () => {
      document.removeEventListener("mousedown", onDown as any);
      document.removeEventListener("keydown", onKey);
    };
  }, [showDialog]);

  const handleSave = () => {
    const { text, url, node, path } = dialogData;
    if (!url) return;
    // if text empty but selection exists, preserve selection text
    let finalText = text;
    if (!finalText && editor.selection && Range.isExpanded(editor.selection)) {
      finalText = Editor.string(editor, editor.selection as any);
    }
    if (!finalText) finalText = url;
    setLink(editor, node, url, finalText, path || undefined);
    setDialogData({ text: "", url: "", node: null, path: null });
    setShowDialog(false);
  };

  const handleRemove = () => {
    const { node, path } = dialogData;
    if (node && path) {
      Transforms.select(editor, path);
      unwrapLink(editor);
    }
    setDialogData({ text: "", url: "", node: null, path: null });
    setShowDialog(false);
  };

  if (!showDialog) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal
        className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-96 max-w-[90vw]"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Add / Edit Link</h3>
          <button
            onClick={() => setShowDialog(false)}
            aria-label="Close dialog"
            className="p-1 rounded hover:bg-gray-100"
          >
            ×
          </button>
        </div>

        <label className="block text-sm text-gray-600">Text</label>
        <input
          value={dialogData.text}
          onChange={(e) =>
            setDialogData((p) => ({ ...p, text: e.target.value }))
          }
          className="w-full border rounded px-3 py-2 mb-3"
          placeholder="Text to display"
        />

        <label className="block text-sm text-gray-600">URL</label>
        <input
          value={dialogData.url}
          onChange={(e) =>
            setDialogData((p) => ({ ...p, url: e.target.value }))
          }
          className="w-full border rounded px-3 py-2 mb-3"
          placeholder="https://example.com"
        />

        <div className="flex justify-end gap-2">
          {dialogData.node && (
            <button onClick={handleRemove} className="text-red-600">
              Remove
            </button>
          )}
          <button
            onClick={() => setShowDialog(false)}
            className="px-3 py-1 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

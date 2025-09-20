import { useState, useEffect } from "react";
import {
  Transforms,
  Editor,
  Element as SlateElement,
  Range,
  Node,
  Descendant,
} from "slate";

import { createPortal } from "react-dom";
import { ComponentType, CustomEditor } from "../slate";
import { ToolbarButton } from "../Toolbar/ToolbarButton";
import { Link } from "lucide-react";

export type LinkElement = {
  type: ComponentType.Link;
  url: string;
  children: Descendant[];
};

// --- Helpers ---
const isLinkActive = (editor) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      n.type === ComponentType.Link,
  });
  return !!match;
};

const unwrapLink = (editor) => {
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      n.type === ComponentType.Link,
  });
};

const wrapLink = (editor, url, text) => {
  if (isLinkActive(editor)) unwrapLink(editor);
  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link: LinkElement = {
    type: ComponentType.Link,
    url,
    children: isCollapsed ? [{ text: text || url }] : [{ text: text || "" }],
  };
  if (isCollapsed) {
    Transforms.insertNodes(editor, link, {
      select: true,
    });
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }
};

const updateLink = (editor, url, text) => {
  // Find the current link node
  const [linkNodeEntry] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      n.type === ComponentType.Link,
  });

  if (!linkNodeEntry) return;

  const [linkNode, linkPath] = linkNodeEntry;

  // Update the URL of the link node
  Transforms.setNodes(editor, { url }, { at: linkPath });

  // Update the text content of the link
  if (text !== undefined) {
    // Get the path to the text node inside the link node
    const textNodePath = linkPath.concat([0]);
    const oldText = Node.string(linkNode);

    // Delete the old text and insert the new text
    Transforms.delete(editor, {
      at: textNodePath,
      unit: "character",
      distance: oldText.length,
    });
    Transforms.insertText(editor, text, { at: textNodePath });
  }
};

// --- Link Modal Component ---
const DialogLink = ({ editor, isOpen, onClose }) => {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const [match] = Editor.nodes(editor, {
        match: (n: SlateElement) =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          n.type === ComponentType.Link,
      });

      if (match) {
        const [node] = match;
        setUrl((node as LinkElement).url);
        setText(Node.string(node));
        setIsEditMode(true);
      } else {
        setUrl("");
        const { selection } = editor;
        if (selection && !Range.isCollapsed(selection)) {
          const selectedText = Editor.string(editor, selection);
          setText(selectedText);
        } else {
          setText("");
        }
        setIsEditMode(false);
      }
    }
  }, [isOpen, editor]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!url) {
      return;
    }

    if (isEditMode) {
      updateLink(editor, url, text);
    } else {
      wrapLink(editor, url, text);
    }

    onClose();
  };

  const handleRemove = () => {
    unwrapLink(editor);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm"
        onKeyDown={handleKeyDown}
      >
        <h3 className="text-xl font-bold mb-4">
          {isEditMode ? "Edit Link" : "Add Link"}
        </h3>
        <div className="mb-4">
          <label
            htmlFor="link-url"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            URL
          </label>
          <input
            id="link-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="link-text"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Link Text
          </label>
          <input
            id="link-text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Optional: Enter display text"
          />
        </div>
        <div className="flex justify-end space-x-2">
          {isEditMode && (
            <button
              onClick={handleRemove}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Remove
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            disabled={!url}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Toolbar Button with Link Modal ---
export const LinkToolbarButton = ({ editor }: { editor: CustomEditor }) => {
  const active = isLinkActive(editor);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleClick = () => {
    setModalOpen(true);
  };

  useEffect(() => {
    if (active) {
      setModalOpen(true);
    }
  }, [active]);

  return (
    <>
      <ToolbarButton
        onAction={handleClick}
        isActive={active}
        tooltip="Link"
        icon={Link}
        editor={editor}
      />
      {isModalOpen &&
        createPortal(
          <DialogLink
            editor={editor}
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
          />,
          document.body
        )}
    </>
  );
};

// --- Element Renderers ---
export const RenderLinkElement = ({ attributes, children, element }) => {
  const link = element;
  return (
    <a
      {...attributes}
      href={link.url}
      className="text-blue-500 underline hover:text-blue-700 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
};

// Define which elements are inline
export const withLink = (editor) => {
  const { isInline } = editor;
  editor.isInline = (element) =>
    element.type === ComponentType.Link || isInline(element);

  return editor;
};

//============================
//============================
//============================
//============================

// --- Main App ---
/*
const renderElement = (props) => {
  switch (props.element.type) {
    case ComponentType.Link:
      return <RenderLinkElement {...props} />;
    default:
      return <p {...props.attributes}>{props.children}</p>;
  }
};


const initialValue = [
  {
    type: ComponentType.Paragraph,
    children: [{ text: "Start typing or use the toolbar..." }],
  },
  {
    type: ComponentType.Paragraph,
    children: [{ text: "Select text and click Link to add or edit." }],
  },
  {
    type: ComponentType.Paragraph,
    children: [
      { text: "Try clicking on the " },
      {
        text: "Example Link",
        url: "https://www.google.com",
        type: ComponentType.Link,
      },
      { text: "." },
    ],
  },
];

export const EditorApp = () => {
  const editor = useMemo(() => withLink(withReact(createEditor())), []);
  const [value, setValue] = useState(initialValue);

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg p-6">
        <Slate
          editor={editor}
          initialValue={value}
          onChange={(newValue) => setValue(newValue)}
        >
          <div className="p-2 border-b-2 border-gray-200 mb-4 flex space-x-2">
            <LinkToolbarButton />
          </div>
          <div className="relative border border-gray-300 rounded-md p-4 min-h-[300px]">
            <Editable
              renderElement={renderElement}
              placeholder="Start typing or select text to add a link..."
              className="outline-none"
            />
          </div>
        </Slate>
      </div>
    </div>
  );
};

export default EditorApp;
*/

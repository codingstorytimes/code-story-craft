import { useState } from "react";
import { Descendant, Transforms, Range, Element as SlateElement } from "slate";
import { Link } from "lucide-react";
import { EditorButton as ToolbarButton } from "../Toolbar/EditorButton";
import { ComponentType, CustomEditor } from "../slate";

export type LinkElement = {
  type: ComponentType.Link;
  url: string;
  children: Descendant[];
};

export const LinkModal = ({
  isOpen,
  onClose,
  onInsert,
}: {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (url: string) => void;
}) => {
  const [url, setUrl] = useState("");

  if (!isOpen) return null;

  const handleInsert = () => {
    if (url) {
      onInsert(url);
      setUrl("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4 text-white">Insert Link</h2>
        <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 mb-4 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleInsert}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Insert
          </button>
        </div>
      </div>
    </div>
  );
};

export const isLinkActive = (editor: CustomEditor) => {
  const [link] = Array.from(
    editor.nodes(editor, {
      match: (n) =>
        !editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n.type === ComponentType.Link,
    })
  );
  return !!link;
};

export const insertLink = (editor: CustomEditor, url: string) => {
  if (editor.selection) {
    wrapLink(editor, url);
  }
};

const wrapLink = (editor: CustomEditor, url: string) => {
  if (isLinkActive(editor)) {
    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !CustomEditor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n.type === ComponentType.Link,
    });
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);

  const link: LinkElement = {
    type: ComponentType.Link,
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }
};

export const LinkToolbarButton = ({ editor }: { editor: CustomEditor }) => {
  const [showLinkModal, setShowLinkModal] = useState(false);
  return (
    <>
      <ToolbarButton
        icon={<Link className="w-5 h-5" />}
        onAction={() => setShowLinkModal(true)}
        isActive={isLinkActive(editor)}
      />
      <LinkModal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        onInsert={(url) => insertLink(editor, url)}
      />
    </>
  );
};

export const LinkElementComponent = ({
  attributes,
  children,
  element,
}: {
  attributes: any;
  children: React.ReactNode;
  element: LinkElement;
}) => (
  <a
    {...attributes}
    href={element.url}
    className="text-indigo-400 hover:underline transition-colors"
    rel="noopener noreferrer"
    target="_blank"
  >
    {children}
  </a>
);

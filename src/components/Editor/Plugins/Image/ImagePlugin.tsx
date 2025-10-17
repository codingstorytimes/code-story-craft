import { Editor, Element as SlateElement, Transforms, Range } from "slate";
import { CustomEditor, ComponentType } from "../../slate";
import { RenderImageElement } from "../../Elements/Image/ImageElement";

export async function deleteImageBackend(imageUrl: string) {
  try {
    const imagePath = imageUrl.replace(
      `${window.location.origin}/storage/`,
      ""
    );

    await fetch("/api/destroyimage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageupload_path: imagePath }),
    });
  } catch (err) {
    console.error("Error deleting image:", err);
  }
}

export const withImage = (editor: CustomEditor) => {
  const { isVoid, onKeyDown } = editor;
  editor.isVoid = (element: SlateElement) => {
    return element.type === ComponentType.Image ? true : isVoid(element);
  };

  editor.registerElement({
    type: ComponentType.Image,
    render: ({ attributes, element }) => {
      return <RenderImageElement attributes={attributes} element={element} />;
    },
  });

  editor.onKeyDown = (event) => {
    const { selection } = editor;
    if (!selection) return;

    // Handle Backspace/Delete near image
    if (
      (event.key === "Backspace" || event.key === "Delete") &&
      Range.isCollapsed(selection)
    ) {
      const point =
        event.key === "Backspace"
          ? Editor.before(editor, selection)
          : Editor.after(editor, selection);
      if (point) {
        const nodeEntry = Editor.nodes(editor, {
          at: point,
          match: (n) =>
            SlateElement.isElement(n) && n.type === ComponentType.Image,
        }).next().value;

        if (nodeEntry) {
          event.preventDefault();
          Transforms.removeNodes(editor, { at: nodeEntry[1] });
          return;
        }
      }
    }
    if (onKeyDown) onKeyDown(event);
  };

  return editor;
};

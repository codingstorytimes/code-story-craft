import { Editor } from "slate";
import { RenderElementProps } from "slate-react";
import { CustomEditor, EditorElementPlugin } from "./slate";

/**
 * A Map to store the registered element renderers.
 * The key is the element `type`, and the value is the render function.
 */
const elementRenderers = new Map<string, EditorElementPlugin["render"]>();

/**
 * A higher-order function that enhances the Slate editor with plugin capabilities.
 * It adds `registerElement` and `renderElement` methods to the editor.
 *
 * @param editor The base Slate editor instance.
 * @returns The editor instance augmented with plugin functionality.
 */
export const withPluginEditor = <T extends Editor>(
  editor: T
): T & CustomEditor => {
  const e = editor as T & CustomEditor;

  // `registerElement` adds a new element renderer to our map.
  e.registerElement = (plugin) => {
    elementRenderers.set(plugin.type, plugin.render);
  };

  // `renderElement` looks up and calls the appropriate renderer from the map.
  e.renderElement = (props: RenderElementProps) =>
    elementRenderers.get(props.element.type)?.({ ...props, editor: e });

  return e;
};

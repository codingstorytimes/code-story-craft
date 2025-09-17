import { Editor } from "slate";
import { RenderElementProps } from "slate-react";
import { CustomEditor, RenderSlateElementProps } from "../slate";
import { IToolbarButton } from "../Toolbar/GroupedToolbar";

export type EditorElementPlugin = {
  type: string;
  render: (
    props: RenderSlateElementProps & { editor: CustomEditor }
  ) => JSX.Element;
};

export interface PluginEditor {
  renderElement: (props: RenderSlateElementProps) => JSX.Element | undefined;
  registerElement: (plugin: EditorElementPlugin) => void;
}

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
export const withPlugin = <T extends Editor>(editor: T): T & CustomEditor => {
  // `registerElement` adds a new element renderer to our map.
  editor.registerElement = (plugin: EditorElementPlugin) => {
    elementRenderers.set(plugin.type, plugin.render);
  };

  // `renderElement` looks up and calls the appropriate renderer from the map.
  editor.renderElement = (props: RenderElementProps) => {
    return elementRenderers.get(props.element.type)?.({
      ...props,
      editor: editor,
    });
  };

  return editor;
};

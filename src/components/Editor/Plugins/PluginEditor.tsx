import { Editor } from "slate";
import { RenderElementProps, RenderLeafProps } from "slate-react";
import { CustomEditor, RenderSlateElementProps } from "../slate";

export interface PluginEditor {
  plugins: {
    elementRenderers: Map<string, EditorElementPlugin["render"]>;
    leafRenderers?: Map<string, EditorLeafPlugin["render"]>;
  };
  renderElement: (props: RenderSlateElementProps) => JSX.Element | undefined;
  renderLeaf?: (props: RenderLeafProps) => JSX.Element | undefined;
  registerElement: (plugin: EditorElementPlugin) => void;
  unregisterElement?: (type: string) => void;
  registerLeaf?: (plugin: EditorLeafPlugin) => void;
  unregisterLeaf?: (type: string) => void;
}

/**
 * A Map to store the registered element renderers.
 * The key is the element `type`, and the value is the render function.
 */
const elementRenderers = new Map<string, EditorElementPlugin["render"]>();
const leafRenderers = new Map<string, EditorLeafPlugin["render"]>();

export type EditorElementPlugin = {
  type: string;
  render: (
    props: RenderSlateElementProps & { editor: CustomEditor }
  ) => JSX.Element;
};

export type EditorLeafPlugin = {
  type: string;
  render: (props: RenderLeafProps & { editor: CustomEditor }) => JSX.Element;
};

/**
 * A higher-order function that enhances the Slate editor with plugin capabilities.
 * It adds `registerElement`, `unregisterElement`, `renderElement`, and optionally `renderLeaf` methods.
 *
 * @param editor The base Slate editor instance.
 * @returns The editor instance augmented with plugin functionality.
 */
export const withPlugin = <T extends Editor>(editor: T): T & CustomEditor => {
  // Register an element renderer
  editor.registerElement = (plugin: EditorElementPlugin) => {
    elementRenderers.set(plugin.type, plugin.render);
  };

  // Unregister an element renderer
  editor.unregisterElement = (type: string) => {
    elementRenderers.delete(type);
  };

  // Register a leaf renderer (optional)
  editor.registerLeaf = (plugin: EditorLeafPlugin) => {
    leafRenderers.set(plugin.type, plugin.render);
  };

  // Unregister a leaf renderer (optional)
  editor.unregisterLeaf = (type: string) => {
    leafRenderers.delete(type);
  };

  // Render an element
  editor.renderElement = (props: RenderElementProps) => {
    return elementRenderers.get(props.element.type)?.({
      ...props,
      editor: editor,
    });
  };

  // Render a leaf (for text marks)
  editor.renderLeaf = (props: RenderLeafProps) => {
    return leafRenderers.get((props.leaf as any).type)?.({
      ...props,
      editor: editor,
    });
  };

  editor.plugins = {
    elementRenderers,
    leafRenderers,
  };

  return editor;
};

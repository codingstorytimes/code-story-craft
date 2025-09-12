import React, { JSX, useState, useEffect, useCallback } from "react";
import {
  Editor,
  Range,
  Transforms,
  Descendant,
  Element as SlateElement,
  NodeEntry,
  Node,
} from "slate";
import {
  ReactEditor,
  RenderElementProps as SlateRenderElementProps,
} from "slate-react";
import { EventEmitter } from "events";
import { CustomEditor, CustomElement } from "../../slate";
import { HistoryEditor } from "slate-history";
import { TableContextMenu } from "./TableContextMenu";

// --- Props for element renderer ---
export interface RenderSlateElementProps
  extends Omit<SlateRenderElementProps, "element"> {
  element: CustomElement;
  editor: CustomEditor;
  viewMode?: "editor" | "read";
}

// -----------------------------
// Constants for element types
// -----------------------------
export enum ComponentType {
  Paragraph = "paragraph",
  TableCell = "table-cell",
  TableRow = "table-row",
  Table = "table",
}

// -----------------------------
// Types
// -----------------------------
export type TableCellElement = {
  type: ComponentType.TableCell;
  children: Descendant[];
};

export type TableRowElement = {
  type: ComponentType.TableRow;
  children: TableCellElement[];
};

export type TableElement = {
  type: ComponentType.Table;
  children: TableRowElement[];
};

// -----------------------------
// Define the extension interface
// -----------------------------
export interface TableUtils {
  addTable: () => void;
  addRow: () => void;
  deleteRow: () => void;
  addColumn: () => void;
  deleteColumn: () => void;
  deleteTable: () => void;
}

// -----------------------------
// Generic element plugin typing
// -----------------------------

export interface TableEditor extends CustomEditor {
  table: { tableUtils: TableUtils };
  __prevSelection: Range | null;
  selectionEvents?: EventEmitter;
  onKeyDown?: (event: React.KeyboardEvent) => void;
}

// -----------------------------
// Table/Cell Selection helper (reactive)
// -----------------------------
export function useSelected<T extends TableEditor>({
  element,
  editor,
  mode,
  surrounds = false,
}: {
  element: SlateElement;
  editor: T;
  mode?: "collapsed" | "expanded";
  surrounds?: boolean;
}): boolean {
  const checkSelection = useCallback(() => {
    if (!element || !editor) return false;
    const sel = editor.selection;
    if (!sel || !Range.isRange(sel)) return false;

    try {
      const path = ReactEditor.findPath(editor, element);
      const range = Editor.range(editor, path);
      const target =
        surrounds && Range.isExpanded(sel)
          ? Range.includes(sel, range)
          : !!Range.intersection(range, sel);

      if (mode === "collapsed") return target && Range.isCollapsed(sel);
      if (mode === "expanded") return target && Range.isExpanded(sel);
      return target;
    } catch {
      return false;
    }
  }, [element, editor, mode, surrounds]);

  const [selected, setSelected] = useState(() => checkSelection());

  useEffect(() => {
    setSelected(checkSelection());
    const handler = () => {
      setSelected((prev) => {
        const next = checkSelection();
        return prev === next ? prev : next;
      });
    };
    editor.selectionEvents?.on("change", handler);
    return () => {
      if (editor.selectionEvents) {
        editor.selectionEvents.off("change", handler);
      }
    };
  }, [editor, element, checkSelection]);

  return selected;
}

const TableCellWithSelection = (
  props: RenderSlateElementProps & { editor: TableEditor }
) => {
  const { attributes, children, element, editor } = props;
  const selected = useSelected({ element, editor });
  return (
    <td
      {...attributes}
      className={`border border-gray-300 p-3 min-w-[100px] bg-white hover:bg-gray-50 focus-within:bg-blue-50 transition-colors ${
        selected ? "bg-blue-100" : ""
      }`}
    >
      {children}
    </td>
  );
};
// -----------------------------
// Extend a base editor with table utilities
// -----------------------------
export const withTable = <T extends CustomEditor>(
  editor: T
): T & TableEditor => {
  const tableEditor = editor as T & TableEditor;

  const origOnChange = editor.onChange?.bind(editor);
  const origOnKeyDown = (editor as any).onKeyDown as
    | ((event: React.KeyboardEvent) => void)
    | undefined;

  tableEditor.table = { tableUtils: {} as TableUtils };
  tableEditor.selectionEvents =
    tableEditor.selectionEvents || new EventEmitter();
  tableEditor.__prevSelection = tableEditor.__prevSelection || null;

  tableEditor.registerElement({
    type: ComponentType.Table,
    render: ({ attributes, children, element, editor }) => (
      <TableContextMenu editor={editor as TableEditor} element={element}>
        <div {...attributes} className="my-4 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
            <tbody>{children}</tbody>
          </table>
        </div>
      </TableContextMenu>
    ),
  });
  tableEditor.registerElement({
    type: ComponentType.TableRow,
    render: ({ attributes, children }) => <tr {...attributes}>{children}</tr>,
  });
  tableEditor.registerElement({
    type: ComponentType.TableCell,
    render: (props) => (
      <TableCellWithSelection {...props} editor={props.editor as TableEditor} />
    ),
  });

  // =============================================================
  // Context Menu Buttons & Toolbar Buttons Helpers
  // =============================================================
  tableEditor.table.tableUtils = {
    addTable: () => {
      try {
        const table: TableElement = {
          type: ComponentType.Table,
          children: [
            {
              type: ComponentType.TableRow,
              children: [
                {
                  type: ComponentType.TableCell,
                  children: [
                    { type: ComponentType.Paragraph, children: [{ text: "" }] },
                  ],
                },
              ],
            },
          ],
        };
        Transforms.insertNodes(editor, table);
      } catch (err) {
        console.error(err);
      }
    },
    addRow: () => {
      try {
        const tableEntry = Editor.nodes(editor, {
          match: (n: Node): n is TableElement =>
            SlateElement.isElement(n) && n.type === ComponentType.Table,
        }).next().value as NodeEntry<TableElement> | undefined;
        if (!tableEntry) return;
        const [tableNode, tablePath] = tableEntry;
        const cols =
          (tableNode.children?.[0] as TableRowElement)?.children?.length || 1;
        const newRow: TableRowElement = {
          type: ComponentType.TableRow,
          children: Array.from({ length: cols }).map(() => ({
            type: ComponentType.TableCell,
            children: [
              { type: ComponentType.Paragraph, children: [{ text: "" }] },
            ],
          })),
        };
        Transforms.insertNodes(editor, newRow, {
          at: [...tablePath, tableNode.children.length],
        });
      } catch (err) {
        console.error(err);
      }
    },
    deleteRow: () => {
      try {
        const currentRowEntry = Editor.nodes(editor, {
          match: (n: Node): n is TableRowElement =>
            SlateElement.isElement(n) && n.type === ComponentType.TableRow,
        }).next().value as NodeEntry<TableRowElement> | undefined;
        if (!currentRowEntry) return;
        const [, currentRowPath] = currentRowEntry;
        Transforms.removeNodes(editor, { at: currentRowPath });
      } catch (err) {
        console.error(err);
      }
    },
    addColumn: () => {
      try {
        const tableEntry = Editor.nodes(editor, {
          match: (n: Node): n is TableElement =>
            SlateElement.isElement(n) && n.type === ComponentType.Table,
        }).next().value as NodeEntry<TableElement> | undefined;
        if (!tableEntry) return;
        const [tableNode, tablePath] = tableEntry;
        const rowCount = tableNode.children.length;
        for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
          const row = tableNode.children[rowIndex] as TableRowElement;
          const rowCellCount = row?.children?.length || 0;
          const cell: TableCellElement = {
            type: ComponentType.TableCell,
            children: [
              { type: ComponentType.Paragraph, children: [{ text: "" }] },
            ],
          };
          Transforms.insertNodes(editor, cell, {
            at: [...tablePath, rowIndex, rowCellCount],
          });
        }
      } catch (err) {
        console.error(err);
      }
    },
    deleteColumn: () => {
      try {
        const currentCellEntry = Editor.nodes(editor, {
          match: (n: Node): n is TableCellElement =>
            SlateElement.isElement(n) && n.type === ComponentType.TableCell,
        }).next().value as NodeEntry<TableCellElement> | undefined;
        if (!currentCellEntry) return;
        const [, currentCellPath] = currentCellEntry;
        const cellIndex = currentCellPath[currentCellPath.length - 1];
        const tableEntry = Editor.nodes(editor, {
          match: (n: Node): n is TableElement =>
            SlateElement.isElement(n) && n.type === ComponentType.Table,
        }).next().value as NodeEntry<TableElement> | undefined;
        if (!tableEntry) return;
        const [tableNode, tablePath] = tableEntry;
        const rowCount = tableNode.children.length;
        for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
          Transforms.removeNodes(editor, {
            at: [...tablePath, rowIndex, cellIndex],
          });
        }
      } catch (err) {
        console.error(err);
      }
    },
    deleteTable: () => {
      try {
        const tableEntry = Editor.nodes(editor, {
          match: (n: Node): n is TableElement =>
            SlateElement.isElement(n) && n.type === ComponentType.Table,
        }).next().value as NodeEntry<TableElement> | undefined;
        if (!tableEntry) return;
        const [, tablePath] = tableEntry;
        Transforms.removeNodes(editor, { at: tablePath });
      } catch (err) {
        console.error(err);
      }
    },
  };

  tableEditor.onChange = (...args: any[]) => {
    origOnChange?.(...args);
    const prev = tableEditor.__prevSelection;
    const cur = tableEditor.selection;
    const changed =
      (!prev && cur) ||
      (prev && !cur) ||
      (prev &&
        cur &&
        Range.isRange(prev) &&
        Range.isRange(cur) &&
        !Range.equals(prev, cur));
    tableEditor.__prevSelection = cur;
    if (changed) tableEditor.selectionEvents?.emit("change", { prev, cur });
  };

  tableEditor.onKeyDown = (event: React.KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "a") {
      const sel = tableEditor.selection;
      if (sel && Range.isRange(sel)) {
        const tableEntry = Editor.above(editor, {
          match: (n: Node): n is TableElement =>
            SlateElement.isElement(n) && n.type === ComponentType.Table,
        });
        if (tableEntry) {
          event.preventDefault();
          const [, tablePath] = tableEntry;
          const range = Editor.range(editor, tablePath);
          Transforms.select(editor, range);
          tableEditor.selectionEvents?.emit("change", {
            prev: tableEditor.__prevSelection,
            cur: range,
          });
          return;
        }
      }
    }
    origOnKeyDown?.(event);
  };

  return tableEditor;
};

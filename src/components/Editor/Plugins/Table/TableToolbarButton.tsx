import { Table, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  ComponentType,
  TableCellElement,
  TableEditor,
  TableElement,
  TableRowElement,
} from "./TablePlugin";
import { useState } from "react";
import { Transforms } from "slate";
import { useSlate } from "slate-react";
import { ToolbarGroupId } from "../../slate";

export const TableGridModal = ({ onClose }) => {
  const editor = useSlate();
  const [hoveredCell, setHoveredCell] = useState({ row: 0, col: 0 });

  const createTableCell = (text = ""): TableCellElement => ({
    type: ComponentType.TableCell,
    children: [{ text }],
  });

  const createTableRow = (cellCount): TableRowElement => ({
    type: ComponentType.TableRow,
    children: Array.from({ length: cellCount }, () => createTableCell()),
  });

  const createTable = (rows, cols): TableElement => ({
    type: ComponentType.Table,
    children: Array.from({ length: rows }, () => createTableRow(cols)),
  });

  const handleCellHover = (row, col) => {
    setHoveredCell({ row, col });
  };

  const handleCellClick = (rows, cols) => {
    const table = createTable(rows + 1, cols + 1);
    Transforms.insertNodes(editor, table);
    onClose();
  };

  const renderGrid = () => {
    const grid = [];
    for (let row = 0; row < 8; row++) {
      const rowCells = [];
      for (let col = 0; col < 10; col++) {
        const isHighlighted = row <= hoveredCell.row && col <= hoveredCell.col;
        rowCells.push(
          <div
            key={`${row}-${col}`}
            className={`w-6 h-6 border border-gray-300 cursor-pointer transition-colors ${
              isHighlighted ? "bg-blue-500" : "bg-white hover:bg-gray-100"
            }`}
            onMouseEnter={() => handleCellHover(row, col)}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleCellClick(row, col)}
          />
        );
      }
      grid.push(
        <div key={row} className="flex">
          {rowCells}
        </div>
      );
    }
    return grid;
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 shadow-2xl w-auto animate-in fade-in-0 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Insert Table</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="mb-4">
          <div className="flex flex-col gap-1">{renderGrid()}</div>
          <p className="text-sm text-gray-600 mt-3 text-center">
            {hoveredCell.row + 1} × {hoveredCell.col + 1} table
          </p>
        </div>
      </div>
    </div>
  );
};

export function TableToolbarButton({ editor }: { editor: TableEditor }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onMouseDown={(e) => {
        e.preventDefault();
        editor.table.tableUtils.addTable();
      }}
    >
      <Table className="w-4 h-4" />
    </Button>
  );
}

export const TableToolCfg = {
  id: ComponentType.Table,
  ToolBarButton: TableToolbarButton,
  category: "modal",
  group: ToolbarGroupId.Inserts,
  ModalComponent: TableGridModal,
};

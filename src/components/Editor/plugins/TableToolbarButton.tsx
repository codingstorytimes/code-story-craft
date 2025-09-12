import { Table } from "lucide-react";
import { TableEditor } from "./TablePlugin";
import { Button } from "@/components/ui/button";

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

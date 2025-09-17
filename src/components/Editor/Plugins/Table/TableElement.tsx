import { Descendant } from "slate";
import { ComponentType } from "../../slate";

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

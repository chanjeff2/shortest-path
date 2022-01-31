import { Cell } from "./Cell";

export interface CellType {
    onClick(cell: Cell): void
}
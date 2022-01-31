import { Cell } from "./Cell";
import { CellType } from "./CellType";
import { Wall } from "./Wall";

export class Normal implements CellType {
    onClick(cell: Cell): void {
        cell.type = new Wall();
    }
}

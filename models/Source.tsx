import { Cell } from "./Cell";
import { CellType } from "./CellType";
import { Normal } from "./Normal";

export class Source implements CellType {
    onClick(cell: Cell): void {
        cell.type = new Normal();
    }
}

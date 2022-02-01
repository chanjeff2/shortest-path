import { Cell } from "../Cell";
import { CellType } from ".";
import { Wall } from "./Wall";

export class Basic implements CellType {
    onClick(cell: Cell): void {
        cell.type = new Wall();
    }
}

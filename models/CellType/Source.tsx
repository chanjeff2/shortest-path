import { Cell } from "../Cell";
import { CellType } from ".";
import { Basic } from "./Basic";

export class Source implements CellType {
    onClick(cell: Cell): void {
        cell.type = new Basic();
    }
}

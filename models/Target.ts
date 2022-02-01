import { Cell } from "./Cell"
import { CellType } from "./CellType"
import { Basic } from "./Basic"

export class Target implements CellType {
    onClick(cell: Cell): void {
        cell.type = new Basic()
    }
}
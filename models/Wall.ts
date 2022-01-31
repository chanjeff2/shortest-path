import { Cell } from "./Cell"
import { CellType } from "./CellType"
import { Target } from "./Target"

export class Wall implements CellType {
    onClick(cell: Cell): void {
        cell.type = new Target()
    }
}
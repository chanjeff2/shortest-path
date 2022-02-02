import { CellTerrain } from ".";
import { Cell } from "../Cell";
import { Mountain } from "./Mountain";

export class Ground implements CellTerrain {
    travelCost: number = 1

    onClick(cell: Cell): void {
        cell.terrain = new Mountain()
    }
}
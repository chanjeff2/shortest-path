import { CellTerrain } from ".";
import { Cell } from "../Cell";
import { Mountain } from "./Mountain";

export class Forest implements CellTerrain {
    travelCost: number = 3

    onClick(cell: Cell): void {
        cell.terrain = new Mountain()
    }
}
import { CellTerrain } from ".";
import { Cell } from "../Cell";
import { Ground } from "./Ground";

export class Mountain implements CellTerrain {
    travelCost: number = 3

    onClick(cell: Cell): void {
        cell.terrain = new Ground()
    }
}
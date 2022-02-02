import { CellTerrain } from ".";
import { Cell } from "../Cell";
import { Rainy } from "./Rainy";

export class Ground implements CellTerrain {
    travelCost: number = 1

    onClick(cell: Cell): void {
        cell.terrain = new Rainy()
    }
}
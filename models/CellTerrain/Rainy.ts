import { CellTerrain } from ".";
import { Cell } from "../Cell";
import { Forest } from "./Forest";

export class Rainy implements CellTerrain {
    travelCost: number = 2

    onClick(cell: Cell): void {
        cell.terrain = new Forest()
    }
}
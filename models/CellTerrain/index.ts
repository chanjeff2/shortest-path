import { Cell } from "../Cell";

export interface CellTerrain {
    travelCost: number
    onClick(cell: Cell): void
}
import { Cell } from "../models/Cell";


export interface MoveStrategy {
    name: string;
    getNeighbors(cell: Cell, board: Cell[][]): Cell[];
    calculateHeuristics(source: Cell, target: Cell): number;
}

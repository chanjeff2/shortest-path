import { Cell } from "../models/Cell";
import { MoveStrategy } from "./MoveStrategy";

export class RLTBMove implements MoveStrategy {
    name: string = "right-left-top-bottom move";
    getNeighbors(cell: Cell, board: Cell[][]): Cell[] {
        let neighbors: Cell[] = [];
        let pos = cell.location;
        for (let rowOffset = -1; rowOffset < 2; rowOffset++) {
            for (let colOffset = -1; colOffset < 2; colOffset++) {
                if (Math.abs(rowOffset) + Math.abs(colOffset) > 1) {
                    continue;
                }
                let foo: Cell | undefined = board[pos.row + rowOffset]?.[pos.col + colOffset];
                if (foo != undefined) {
                    neighbors.push(foo);
                }
            }
        }
        return neighbors;
    }
    calculateHeuristics(source: Cell, target: Cell): number {
        return Math.abs(source.location.row - target.location.row) + Math.abs(source.location.col - target.location.col);
    }
}

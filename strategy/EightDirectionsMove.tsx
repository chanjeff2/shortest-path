import { Cell } from "../models/Cell";
import { MoveStrategy } from "./MoveStrategy";

export class EightDirectionsMove implements MoveStrategy {
    name: string = "eight directions move";
    getNeighbors(cell: Cell, board: Cell[][]): Cell[] {
        let neighbors: Cell[] = [];
        let pos = cell.location;
        for (let rowOffset = -1; rowOffset < 2; rowOffset++) {
            for (let colOffset = -1; colOffset < 2; colOffset++) {
                let foo: Cell | undefined = board[pos.row + rowOffset]?.[pos.col + colOffset];
                if (foo != undefined) {
                    neighbors.push(foo);
                }
            }
        }
        return neighbors;
    }

    calculateHeuristics(source: Cell, target: Cell): number {
        let dx = Math.abs(source.location.col - target.location.col);
        let dy = Math.abs(source.location.row - target.location.row);

        return (dx + dy) + (Math.sqrt(2) - 2) * Math.min(dx, dy);
    }
}

import { Cell } from "../models/Cell";
import { Path } from "../models/CellType/Path";
import { Basic } from "../models/CellType/Basic";
import { Wall } from "../models/CellType/Wall";
import { PathBlockedException, ShortestPathAlgorithm } from "./ShortestPathAlgorithm";
import { delay } from "../util";

export class BFS extends ShortestPathAlgorithm {
    name: string = "BFS";

    async execute(board: Cell[][], source: Cell, target: Cell, setState: (callback: () => void) => void): Promise<Cell[]> {
        let parent = await this.helper(board, source, target, setState);
        let path: Cell[] = [];
        let cell: Cell = parent[target.location.row][target.location.col];
        while (cell !== source) {
            if (cell.type instanceof Basic) {
                setState(() => {
                    cell.type = new Path();
                });
                await delay(this.interval);
            }
            path.unshift(cell);
            cell = parent[cell.location.row][cell.location.col];
        }
        return path;
    }

    async helper(board: Cell[][], source: Cell, target: Cell, setState: (callback: () => void) => void): Promise<Cell[][]> {
        let processed: Set<Cell> = new Set();
        let pending: Cell[] = [source];
        let parent: Cell[][] = Array(board.length).fill(null).map(_ => Array(board[0].length).fill(null));
        while (pending.length > 0) {
            let cell: Cell = pending.shift()!;
            processed.add(cell);
            setState(() => {
                cell.markProcessed();
            });
            await delay(this.interval);
            let neighbors = this.getNeighbors(cell, board);
            for (let neighbor of neighbors) {
                if (processed.has(neighbor) || pending.find(e => e == neighbor)) {
                    continue;
                }
                if (cell.type instanceof Wall) {
                    processed.add(cell);
                    setState(() => {
                        cell.markProcessed();
                    });
                    continue;
                }
                setState(() => {
                    neighbor.markPending();
                });
                parent[neighbor.location.row][neighbor.location.col] = cell;
                if (neighbor === target) {
                    return parent;
                }
                pending.push(neighbor);
                await delay(this.interval);
            }

        }
        throw new PathBlockedException();
    }
}

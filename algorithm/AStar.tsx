import { Cell } from "../models/Cell";
import { Path } from "../models/Path";
import { Normal } from "../models/Normal";
import { Wall } from "../models/Wall";
import { ShortestPathAlgorithm } from "../algorithm/ShortestPathAlgorithm";
import { delay, interval } from "../util";

export class AStar extends ShortestPathAlgorithm {
    name: string = "A*";

    calculateHeuristics(source: Cell, target: Cell): number {
        return this.moveStrategy!.calculateHeuristics(source, target);
    }

    async execute(board: Cell[][], source: Cell, target: Cell, setState: (callback: () => void) => void): Promise<Cell[]> {
        let parent = await this.helper(board, source, target, setState);
        let path: Cell[] = [];
        let cell: Cell = parent[target.location.row][target.location.col];
        while (cell !== source) {
            if (cell.type instanceof Normal) {
                setState(() => {
                    cell.type = new Path();
                });
                await delay(interval);
            }
            path.unshift(cell);
            cell = parent[cell.location.row][cell.location.col];
        }
        return path;
    }

    getScore(source: Cell, target: Cell, cost: number[][]): number {
        return cost[source.location.row][source.location.col] + this.calculateHeuristics(source, target);
    }

    async helper(board: Cell[][], source: Cell, target: Cell, setState: (callback: () => void) => void): Promise<Cell[][]> {
        let processed: Set<Cell> = new Set();
        let pending: Cell[] = [source];
        let cost: number[][] = Array(board.length).fill(null).map(_ => Array(board[0].length).fill(Number.MAX_VALUE));
        let parent: Cell[][] = Array(board.length).fill(null).map(_ => Array(board[0].length).fill(null));
        cost[source.location.row][source.location.col] = 0;
        while (pending.length > 0) {
            let cell: Cell = pending.reduce((a, b) => {
                if (this.getScore(a, target, cost) < this.getScore(b, target, cost)) {
                    return a;
                } else {
                    return b;
                }
            });
            pending.splice(pending.indexOf(cell), 1);
            if (processed.has(cell)) {
                continue;
            }
            processed.add(cell);
            setState(() => {
                cell.markProcessed();
            });
            await delay(interval);
            let neighbors = this.getNeighbors(cell, board);
            for (let neighbor of neighbors) {
                if (processed.has(neighbor) /*|| pending.find(e => e == neighbor)*/) {
                    continue;
                }
                if (cell.type instanceof Wall) {
                    processed.add(cell);
                    setState(() => {
                        cell.markProcessed();
                    });
                    continue;
                }
                let newCost = cost[cell.location.row][cell.location.col] + this.calculateHeuristics(cell, neighbor);
                if (cost[neighbor.location.row][neighbor.location.col] < newCost) {
                    console.log("update");
                    continue;
                }
                cost[neighbor.location.row][neighbor.location.col] = newCost;
                setState(() => {
                    neighbor.markPending();
                });
                parent[neighbor.location.row][neighbor.location.col] = cell;
                if (neighbor === target) {
                    return parent;
                }
                pending.push(neighbor);
                await delay(interval);
            }

        }
        throw Error("cannot reach target");
    }
}

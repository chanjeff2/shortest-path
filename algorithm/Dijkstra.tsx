import { Cell } from "../models/Cell";
import { Path } from "../models/CellType/Path";
import { Basic } from "../models/CellType/Basic";
import { Wall } from "../models/CellType/Wall";
import { PathBlockedException, ShortestPathAlgorithm } from "../algorithm/ShortestPathAlgorithm";
import { delay } from "../util";

export class Dijkstra extends ShortestPathAlgorithm {
    name: string = "Dijkstra";

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

    getCost(cell: Cell, cost: number[][]): number {
        return cost[cell.location.row][cell.location.col]
    }

    async helper(board: Cell[][], source: Cell, target: Cell, setState: (callback: () => void) => void): Promise<Cell[][]> {
        let processed: Set<Cell> = new Set();
        let pending: Cell[] = [source];
        let cost: number[][] = Array(board.length).fill(null).map(_ => Array(board[0].length).fill(Number.MAX_VALUE));
        let parent: Cell[][] = Array(board.length).fill(null).map(_ => Array(board[0].length).fill(null));
        cost[source.location.row][source.location.col] = 0;
        while (pending.length > 0) {
            let cell: Cell = pending.reduce((a, b) => {
                if (this.getCost(a, cost) < this.getCost(b, cost)) {
                    return a;
                } else {
                    return b;
                }
            });
            pending.splice(pending.indexOf(cell), 1);
            processed.add(cell);
            setState(() => {
                cell.markProcessing();
            });
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
                let newCost = cost[cell.location.row][cell.location.col] + neighbor.travelCost();
                if (cost[neighbor.location.row][neighbor.location.col] < newCost) {
                    continue;
                }
                cost[neighbor.location.row][neighbor.location.col] = newCost;
                setState(() => {
                    neighbor.markPending();
                });
                parent[neighbor.location.row][neighbor.location.col] = cell;
                if (neighbor === target) {
                    setState(() => {
                        cell.markProcessed();
                    });
                    return parent;
                }
                pending.push(neighbor);
                await delay(this.interval);
            }
            setState(() => {
                cell.markProcessed();
            });
            await delay(this.interval);
        }
        throw new PathBlockedException();
    }
}

import { Cell } from "../models/Cell";
import { MoveStrategy } from "../strategy/MoveStrategy";

export abstract class ShortestPathAlgorithm {
    moveStrategy: MoveStrategy | null = null;
    interval: number = 100
    abstract name: string;

    setStrategy(moveStrategy: MoveStrategy) {
        this.moveStrategy = moveStrategy;
    }

    setInterval(interval: number) {
        this.interval = interval
    }

    getNeighbors(cell: Cell, board: Cell[][]): Cell[] {
        return this.moveStrategy!.getNeighbors(cell, board);
    }

    abstract execute(board: Cell[][], source: Cell, target: Cell, setState: (callback: () => void) => void): Promise<Cell[]>;
}

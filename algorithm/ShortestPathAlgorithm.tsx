import { Cell } from "../models/Cell";
import { MoveStrategy } from "../strategy/MoveStrategy";

export abstract class ShortestPathAlgorithm {
    moveStrategy: MoveStrategy | null = null;

    setStrategy(moveStrategy: MoveStrategy) {
        this.moveStrategy = moveStrategy;
    }

    getNeighbors(cell: Cell, board: Cell[][]): Cell[] {
        return this.moveStrategy!.getNeighbors(cell, board);
    }
    abstract name: string;
    abstract execute(board: Cell[][], source: Cell, target: Cell, setState: (callback: () => void) => void): Promise<Cell[]>;
}

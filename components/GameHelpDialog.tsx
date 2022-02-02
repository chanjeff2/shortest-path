import { Dialog, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Cell, CustomCell } from "../models/Cell";
import { Basic } from "../models/CellType/Basic";
import { Path } from "../models/CellType/Path";
import { Pending } from "../models/CellState/Pending";
import { Processed } from "../models/CellState/Processed";
import { Source } from "../models/CellType/Source";
import { Target } from "../models/CellType/Target";
import { UnProcessed } from "../models/CellState/UnProcessed";
import { Wall } from "../models/CellType/Wall";
import { Tile } from "./Tile";

export interface GameHelpDialogProps {
    open: boolean;
    onClose: (value: string) => void;
}

class CellRow {
    cell: Cell
    name: string
    description: string
    howToPlace: string

    constructor(cell: Cell, name: string, description: string, howToPlace: string) {
        this.cell = cell
        this.name = name
        this.description = description
        this.howToPlace = howToPlace
    }
}

export function GameHelpDialog({ open, onClose }: GameHelpDialogProps) {
    const source: Cell = new CustomCell(new Source())
    const target: Cell = new CustomCell(new Target())
    const wall: Cell = new CustomCell(new Wall())
    const path: Cell = new CustomCell(new Path())
    const unprocessed: Cell = new CustomCell()
    const pending: Cell = new CustomCell(new Basic(), new Pending())
    const processed: Cell = new CustomCell(new Basic(), new Processed())

    const cellRows = [
        new CellRow(unprocessed, "Basic (unprocessed)", "Basic tile", "Default tile"),
        new CellRow(source, "Source", "The starting point of the path", "Long Press on any tile (max 1)"),
        new CellRow(wall, "Wall", "Impassable tile", "Single Click on Basic Tile"),
        new CellRow(target, "Target", "The destination of the path", "Single Click on Wall Tile (max 1)"),
        new CellRow(path, "Path", "The path found by algorithm", "-"),
        new CellRow(pending, "Pending", "tile waiting to be processed", "-"),
        new CellRow(processed, "Processed", "Processed tile", "-"),
    ]

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Help</DialogTitle>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>Icon</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>How to place</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cellRows.map(({ cell, name, description, howToPlace }) => (
                        <TableRow>
                            <TableCell><Tile cell={cell}></Tile></TableCell>
                            <TableCell>{name}</TableCell>
                            <TableCell>{description}</TableCell>
                            <TableCell>{howToPlace}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Dialog>
    )
}
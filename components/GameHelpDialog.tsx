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
import { Rainy } from "../models/CellTerrain/Rainy";
import { Forest } from "../models/CellTerrain/Forest";
import { Mountain } from "../models/CellTerrain/Mountain";

export interface GameHelpDialogProps {
    open: boolean;
    onClose: (value: string) => void;
}

class CellRow {
    cell: Cell
    name: string
    description: string
    howToPlace: string
    showTravelCost: boolean

    constructor(cell: Cell, name: string, description: string, howToPlace: string, showTravelCost: boolean = true) {
        this.cell = cell
        this.name = name
        this.description = description
        this.howToPlace = howToPlace
        this.showTravelCost = showTravelCost
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
    const rainy: Cell = new CustomCell(new Basic(), new UnProcessed(), new Rainy())
    const forest: Cell = new CustomCell(new Basic(), new UnProcessed(), new Forest())
    const mountain: Cell = new CustomCell(new Basic(), new UnProcessed(), new Mountain())


    const cellRows = [
        new CellRow(unprocessed, "Basic (unprocessed) (Ground)", "Basic tile, Ground Terrain", "Default tile"),
        new CellRow(source, "Source", "The starting point of the path", "Press and hold LMB on any tile (max 1)", false),
        new CellRow(wall, "Wall", "Impassable tile", "Left click on Basic Tile", false),
        new CellRow(target, "Target", "The destination of the path", "Press and hold RMB on any tile (max 1)", false),
        new CellRow(rainy, "Rainy", "Rainy terrain", "Right click on Ground Tile"),
        new CellRow(forest, "Forest", "Forest terrain", "Right click on Rainy Tile"),
        new CellRow(mountain, "Mountain", "Mountain terrain", "Right click on Forest Tile"),
        new CellRow(path, "Path", "The path found by algorithm", "-", false),
        new CellRow(pending, "Pending", "tile waiting to be processed", "-", false),
        new CellRow(processed, "Processed", "Processed tile", "-", false),
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
                        <TableCell>Travel Cost</TableCell>
                        <TableCell>How to place</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cellRows.map(({ cell, name, description, howToPlace, showTravelCost }) => (
                        <TableRow>
                            <TableCell><Tile cell={cell}></Tile></TableCell>
                            <TableCell>{name}</TableCell>
                            <TableCell>{description}</TableCell>
                            <TableCell>{showTravelCost ? cell.travelCost() : "-"}</TableCell>
                            <TableCell>{howToPlace}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Dialog>
    )
}
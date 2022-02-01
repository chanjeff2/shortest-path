import styles from "./Tile.module.css"
import { useLongPress } from 'use-long-press';
import { Cell } from "../models/Cell";
import cn from 'classnames'
import { Wall } from "../models/CellType/Wall";
import { Basic } from "../models/CellType/Basic";
import { Path } from "../models/CellType/Path";
import { Source } from "../models/CellType/Source";
import { Target } from "../models/CellType/Target";
import { Processed } from "../models/CellState/Processed";
import { UnProcessed } from "../models/CellState/UnProcessed";
import { Pending } from "../models/CellState/Pending";

export interface TileProps {
    cell: Cell,
    onClick: (cell: Cell) => void,
    onLongTap: (cell: Cell) => void
}

export function Tile(props: TileProps): JSX.Element {
    const bind = useLongPress(() => props.onLongTap(props.cell), {
        onCancel: (e) => props.onClick(props.cell),
        threshold: 200
    })
    return (<div className={`${styles.tile} ${cn({
        [styles.basic]: props.cell.type instanceof Basic,
        [styles.wall]: props.cell.type instanceof Wall,
        [styles.path]: props.cell.type instanceof Path,
        [styles.source]: props.cell.type instanceof Source,
        [styles.target]: props.cell.type instanceof Target,
        [styles.unprocessed]: props.cell.state instanceof UnProcessed,
        [styles.pending]: props.cell.state instanceof Pending,
        [styles.processed]: props.cell.state instanceof Processed,
    })}`} {...bind} ></div>)
}
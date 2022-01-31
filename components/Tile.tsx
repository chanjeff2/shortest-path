import styles from "./Tile.module.css"
import { useLongPress } from 'use-long-press';
import { Cell } from "../models/Cell";
import cn from 'classnames'
import { Wall } from "../models/Wall";
import { Normal } from "../models/Normal";
import { Path } from "../models/Path";
import { Source } from "../models/Source";
import { Target } from "../models/Target";
import { Processed } from "../models/Processed";
import { UnProcessed } from "../models/UnProcessed";
import { Pending } from "../models/Pending";

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
        [styles.normal]: props.cell.type instanceof Normal,
        [styles.wall]: props.cell.type instanceof Wall,
        [styles.path]: props.cell.type instanceof Path,
        [styles.source]: props.cell.type instanceof Source,
        [styles.target]: props.cell.type instanceof Target,
        [styles.unprocessed]: props.cell.state instanceof UnProcessed,
        [styles.pending]: props.cell.state instanceof Pending,
        [styles.processed]: props.cell.state instanceof Processed,
    })}`} {...bind} ></div>)
}
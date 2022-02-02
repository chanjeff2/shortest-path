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
import { Mountain } from "../models/CellTerrain/Mountain";
import Image from "next/image"
import rain from "../public/rain-no-bg.gif"
import forest from "../public/tree.gif"
import mountain from "../public/mountain-no-bg-crop.gif"
import chest from "../public/chest-no-bg-crop.gif"
import { Rainy } from "../models/CellTerrain/Rainy";
import { Forest } from "../models/CellTerrain/Forest";

export interface TileProps {
    cell: Cell,
    onLeftClick?: (cell: Cell) => void,
    onMiddleClick?: (cell: Cell) => void,
    onRightClick?: (cell: Cell) => void,
    onAnyClick?: (cell: Cell) => void,
    onAnyLongTap?: (cell: Cell) => void
    onLongLeftPressed?: (cell: Cell) => void,
    onLongMiddlePressed?: (cell: Cell) => void,
    onLongRightPressed?: (cell: Cell) => void,
}

export function Tile(props: TileProps): JSX.Element {
    const handleClick = (e: MouseEvent) => {
        props.onAnyClick?.(props.cell)
        switch (e.button) {
            case 0:
                props.onLeftClick?.(props.cell)
                break;
            case 1:
                props.onMiddleClick?.(props.cell)
                break;
            case 2:
                props.onRightClick?.(props.cell)
                break;
            default:
                ;
        }
    }

    const handleTouch = (e: TouchEvent) => {
        // touch screen trigger touch event on touch, and on click on lifting up
        // so probably won't support touch device
    }

    const handleLongPress = (e: MouseEvent) => {
        props.onAnyLongTap?.(props.cell)
        switch (e.button) {
            case 0:
                props.onLongLeftPressed?.(props.cell)
                break;
            case 1:
                props.onLongMiddlePressed?.(props.cell)
                break;
            case 2:
                props.onLongRightPressed?.(props.cell)
                break;
            default:
                ;
        }
    }

    const bind = useLongPress((e) => {
        if (e?.nativeEvent instanceof TouchEvent) {

        } else if (e?.nativeEvent instanceof MouseEvent) {
            handleLongPress(e.nativeEvent)
        }
    }, {
        captureEvent: true,
        onCancel: e => {
            if (e?.nativeEvent instanceof TouchEvent) {
                handleTouch(e.nativeEvent)
            } else if (e?.nativeEvent instanceof MouseEvent) {
                handleClick(e.nativeEvent)
            }
        },
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
    })}`} {...bind} onContextMenu={(e) => e.preventDefault()} >
        <CellImage cell={props.cell} />
    </div>)
}

function CellImage({ cell }: { cell: Cell }): JSX.Element | null {
    const { type, terrain } = cell
    if (type instanceof Target) {
        return <Image src={chest} layout="fill" />
    }
    if (terrain instanceof Rainy) {
        return <Image src={rain} layout="fill" />
    }
    if (terrain instanceof Forest) {
        return <Image src={forest} layout="fill" />
    }
    if (terrain instanceof Mountain) {
        return <Image src={mountain} layout="fill" />
    }
    return null
}
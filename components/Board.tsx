import { Normal } from "../models/Normal";
import { Tile } from "./Tile";
import styles from "./Board.module.css"
import { useLongPress } from "use-long-press";
import { Cell } from "../models/Cell";

export interface BoardProps {
    board: Cell[][],
    onClick: (cell: Cell) => void,
    onLongTap: (cell: Cell) => void
}

export function Board(props: BoardProps): JSX.Element {
    let rows: Array<JSX.Element> = [];
    let id: number = 0;
    for (let row of props.board) {
        let _row: Array<JSX.Element> = [];
        for (let cell of row) {
            const bind = useLongPress(() => props.onLongTap(cell), {
                onCancel: (e) => props.onClick(cell),
                threshold: 200
            })
            _row.push(<Tile key={id++} cell={cell} bind={bind} />)
        }
        rows.push(<div className={styles.row}>{_row}</div>);
    }
    return (<div>{rows}</div>)
}
import { Tile } from "./Tile";
import styles from "./Board.module.css"
import { Cell } from "../models/Cell";

export interface BoardProps {
    board: Cell[][],
    onLeftClick: (cell: Cell) => void,
    onRightClick: (cell: Cell) => void,
    onLongLeftPressed: (cell: Cell) => void,
    onLongRightPressed: (cell: Cell) => void,
}

export function Board(props: BoardProps): JSX.Element {
    let rows: Array<JSX.Element> = [];
    let id: number = 0;
    for (let row of props.board) {
        let _row: Array<JSX.Element> = [];
        for (let cell of row) {
            _row.push(<Tile
                key={id++}
                cell={cell}
                onLeftClick={props.onLeftClick}
                onRightClick={props.onRightClick}
                onLongLeftPressed={props.onLongLeftPressed}
                onLongRightPressed={props.onLongRightPressed}
            />)
        }
        rows.push(<div key={id++} className={styles.row}>{_row}</div>);
    }
    return (<div>{rows}</div>)
}
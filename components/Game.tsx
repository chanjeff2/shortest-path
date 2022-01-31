import React from "react";
import { Board } from "./Board";
import styles from "./Game.module.css"
import { Location } from "../models/Location"
import { Cell } from "../models/Cell";
import { Path } from "../models/Path";
import { Normal } from "../models/Normal";
import { Source } from "../models/Source";
import { UnProcessed } from "../models/UnProcessed";
import { Target } from "../models/Target";
import { FormControl, IconButton, InputLabel, MenuItem, Select } from "@mui/material";
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';
import { ShortestPathAlgorithm } from "../algorithm/ShortestPathAlgorithm";
import { BFS } from "../algorithm/BFS";
import { AStar } from "../algorithm/AStar";
import { RLTBMove } from "../strategy/RLTBMove";
import { EightDirectionsMove } from "../strategy/EightDirectionsMove";

export interface GameProps {
    rows: number,
    cols: number
}

interface GameState {
    board: Cell[][],
    source: Cell | null,
    target: Cell | null,
    algorithm: ShortestPathAlgorithm
}

export class Game extends React.Component<GameProps, GameState> {

    constructor(props: GameProps) {
        super(props)

        let algorithm = new BFS()
        algorithm.setStrategy(new RLTBMove())

        this.state = {
            board: this.setUpBoard(),
            source: null,
            target: null,
            algorithm: algorithm
        }
    }

    setUpBoard(): Cell[][] {
        let board: Cell[][] = []
        for (let row = 0; row < this.props.rows; row++) {
            let _row: Array<Cell> = []
            for (let col = 0; col < this.props.cols; col++) {
                _row.push(new Cell(new Location(row, col)))
            }
            board.push(_row)
        }
        return board
    }

    click(cell: Cell): void {
        if (cell.type instanceof Source) {
            this.setState({ source: null })
        }
        if (cell.type instanceof Target) {
            this.setState({ target: null })
        }
        cell.onClick()
        if (cell.type instanceof Target) {
            this.state.target?.onClick()
            this.setState({ target: cell })
        }
        this.setState({ board: this.state.board.slice() })
    }

    longTap(cell: Cell): void {
        this.state.source?.onClick()
        cell.onLongTap()
        this.setState({ source: cell, board: this.state.board.slice() })
    }

    run: () => void = () => {
        if (this.state.source && this.state.target) {
            console.log("Hello World")
            this.state.algorithm.execute(this.state.board, this.state.source, this.state.target, this.updateUI.bind(this))
        }
    }

    reset: () => void = () => {
        for (let row of this.state.board) {
            for (let cell of row) {
                cell.state = new UnProcessed()
                if (cell.type instanceof Path) {
                    cell.type = new Normal()
                }
            }
        }
        this.setState({})
    }

    clear: () => void = () => {
        this.setState({
            board: this.setUpBoard(),
            source: null,
            target: null,
        })
    }

    updateUI(callback: () => void): void {
        callback()
        this.setState({})
    }

    render(): React.ReactNode {
        return (<div className={styles.game}>
            <div className={styles.toolbar}>
                <IconButton onClick={this.run} color="inherit"><PlayArrowRoundedIcon fontSize="large" /></IconButton>
                <IconButton onClick={this.reset} color="inherit"><StopRoundedIcon fontSize="large" /></IconButton>
                <IconButton onClick={this.clear} color="inherit"><RestartAltRoundedIcon fontSize="large" /></IconButton>
                <FormControl>
                    <InputLabel id="algorithm--select-label">Algorithm</InputLabel>
                    <Select
                        labelId="algorithm-select-label"
                        id="algorithm-select"
                        value={this.state.algorithm.name}
                        label="Algorithm"
                        onChange={(event) => {
                            this.reset()
                            let strategy = this.state.algorithm.moveStrategy!
                            let algorithm: ShortestPathAlgorithm
                            switch (event.target.value) {
                                case new BFS().name:
                                    algorithm = new BFS()
                                    break;
                                case new AStar().name:
                                    algorithm = new AStar()
                                    break;
                                default:
                                    return;
                            }
                            algorithm.setStrategy(strategy)
                            this.setState({ algorithm: algorithm })
                        }}
                    >
                        <MenuItem value={new BFS().name}>{new BFS().name}</MenuItem>
                        <MenuItem value={new AStar().name}>{new AStar().name}</MenuItem>
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel id="strategy--select-label">Move Strategy</InputLabel>
                    <Select
                        labelId="strategy-select-label"
                        id="strategy-select"
                        value={this.state.algorithm.moveStrategy!.name}
                        label="Move Strategy"
                        onChange={(event) => {
                            this.reset()
                            switch (event.target.value) {
                                case new RLTBMove().name:
                                    this.state.algorithm.setStrategy(new RLTBMove())
                                    break;
                                case new EightDirectionsMove().name:
                                    this.state.algorithm.setStrategy(new EightDirectionsMove())
                                    break;
                                default:
                                    return;
                            }
                            this.setState({ algorithm: this.state.algorithm })
                        }}
                    >
                        <MenuItem value={new RLTBMove().name}>{new RLTBMove().name}</MenuItem>
                        <MenuItem value={new EightDirectionsMove().name}>{new EightDirectionsMove().name}</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <Board board={this.state.board} onClick={this.click.bind(this)} onLongTap={this.longTap.bind(this)} />
        </div>)
    }
}



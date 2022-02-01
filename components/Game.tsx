import React from "react";
import { Board } from "./Board";
import styles from "./Game.module.css"
import { Location } from "../models/Location"
import { Cell } from "../models/Cell";
import { Path } from "../models/CellType/Path";
import { Basic } from "../models/CellType/Basic";
import { Source } from "../models/CellType/Source";
import { UnProcessed } from "../models/CellState/UnProcessed";
import { Target } from "../models/CellType/Target";
import { FormControl, IconButton, InputLabel, MenuItem, Select } from "@mui/material";
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { PathBlockedException, ShortestPathAlgorithm } from "../algorithm/ShortestPathAlgorithm";
import { BFS } from "../algorithm/BFS";
import { AStar } from "../algorithm/AStar";
import { RLTBMove } from "../strategy/RLTBMove";
import { EightDirectionsMove } from "../strategy/EightDirectionsMove";
import { GameHelpDialog } from "./GameHelpDialog";

class StopInterruptException extends Error {
    constructor(message?: string) {
        super(message)
    }
}

export interface GameProps {
    rows: number,
    cols: number
}

interface GameState {
    board: Cell[][],
    source: Cell | null,
    target: Cell | null,
    algorithm: ShortestPathAlgorithm,
    isRunning: boolean,
    stop: boolean,
    isHelpOpened: boolean
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
            algorithm: algorithm,
            isRunning: false,
            stop: false,
            isHelpOpened: false
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
        if (cell.type instanceof Target) {
            this.setState({ target: null })
        }
        this.state.source?.onClick()
        cell.onLongTap()
        this.setState({ source: cell, board: this.state.board.slice() })
    }

    run: () => void = async () => {
        if (!this.state.source || !this.state.target) {
            return
        }
        this.reset()
        this.setState({ isRunning: true })
        try {
            await this.state.algorithm.execute(this.state.board, this.state.source, this.state.target, this.updateUI.bind(this))
        } catch (e) {
            if (!(e instanceof Error)) throw e
            switch (e.constructor) {
                case StopInterruptException:
                    this.setState({ stop: false });
                    break;
                case PathBlockedException:
                    alert(e.message)
                    break;
                default:
                    throw e;
            }
        }
        this.setState({ isRunning: false })
    }

    stop: () => void = () => {
        if (this.state.isRunning) {
            this.setState({ stop: true })
        } else {
            this.reset()
        }
    }

    reset: () => void = () => {
        for (let row of this.state.board) {
            for (let cell of row) {
                cell.state = new UnProcessed()
                if (cell.type instanceof Path) {
                    cell.type = new Basic()
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

    showHelpDialog: () => void = () => {
        this.setState({
            isHelpOpened: true
        })
    }

    hideHelpDialog: () => void = () => {
        this.setState({
            isHelpOpened: false
        })
    }

    updateUI(callback: () => void): void {
        if (this.state.stop) {
            throw new StopInterruptException()
        }
        callback()
        this.setState({})
    }

    render(): React.ReactNode {
        return (<div className={styles.game}>
            <div className={styles.toolbar}>
                <FormControl disabled={this.state.isRunning}>
                    <InputLabel id="algorithm--select-label">Algorithm</InputLabel>
                    <Select
                        labelId="algorithm-select-label"
                        id="algorithm-select"
                        value={this.state.algorithm.name}
                        label="Algorithm"
                        onChange={(event) => {
                            this.reset()
                            let strategy = this.state.algorithm.moveStrategy!
                            let interval = this.state.algorithm.interval
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
                            algorithm.setInterval(interval)
                            this.setState({ algorithm: algorithm })
                        }}
                    >
                        <MenuItem value={new BFS().name}>{new BFS().name}</MenuItem>
                        <MenuItem value={new AStar().name}>{new AStar().name}</MenuItem>
                    </Select>
                </FormControl>
                <FormControl disabled={this.state.isRunning}>
                    <InputLabel id="strategy-select-label">Move Strategy</InputLabel>
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
                <FormControl>
                    <InputLabel id="interval-select-label">Interval</InputLabel>
                    <Select
                        labelId="interval-select-label"
                        id="interval-select"
                        value={this.state.algorithm.interval}
                        label="Interval"
                        onChange={(event) => {
                            let input: number = Number(event.target.value)
                            this.state.algorithm.setInterval(input)
                            this.setState({ algorithm: this.state.algorithm })
                        }}
                    >
                        <MenuItem value="0">0</MenuItem>
                        <MenuItem value="10">10</MenuItem>
                        <MenuItem value="50">50</MenuItem>
                        <MenuItem value="100">100</MenuItem>
                        <MenuItem value="200">200</MenuItem>
                    </Select>
                </FormControl>
                <IconButton onClick={this.run} disabled={this.state.isRunning} color="inherit"><PlayArrowRoundedIcon fontSize="large" /></IconButton>
                <IconButton onClick={this.stop} color="inherit"><StopRoundedIcon fontSize="large" /></IconButton>
                <IconButton onClick={this.clear} disabled={this.state.isRunning} color="inherit"><RestartAltRoundedIcon fontSize="large" /></IconButton>
                <IconButton onClick={this.showHelpDialog} color="inherit"><HelpOutlineRoundedIcon fontSize="large" /></IconButton>
            </div>
            <GameHelpDialog open={this.state.isHelpOpened} onClose={this.hideHelpDialog} />
            <Board board={this.state.board} onClick={this.click.bind(this)} onLongTap={this.longTap.bind(this)} />
        </div>)
    }
}



import { CellState } from "./CellState"
import { CellType } from "./CellType"
import { Location } from "../models/Location"
import { Basic } from "./Basic"
import { Pending } from "./Pending"
import { Processed } from "./Processed"
import { Source } from "./Source"
import { UnProcessed } from "./UnProcessed"

export class Cell {
    type: CellType = new Basic()
    state: CellState = new UnProcessed()
    location: Location
    constructor(location: Location) {
        this.location = location
    }
    onClick(): void {
        this.type.onClick(this)
    }
    onLongTap(): void {
        this.type = new Source()
    }
    markProcessed(): void {
        this.state = new Processed()
    }
    markPending(): void {
        this.state = new Pending()
    }
}

export class CustomCell extends Cell {
    type: CellType
    state: CellState
    constructor(type?: CellType, state?: CellState) {
        super(new Location(0, 0))
        this.type = type ?? new Basic()
        this.state = state ?? new UnProcessed()
    }
}
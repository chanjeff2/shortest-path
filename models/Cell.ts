import { CellState } from "./CellState"
import { CellType } from "./CellType"
import { Location } from "../models/Location"
import { Basic } from "./CellType/Basic"
import { Pending } from "./CellState/Pending"
import { Processed } from "./CellState/Processed"
import { Source } from "./CellType/Source"
import { UnProcessed } from "./CellState/UnProcessed"
import { CellTerrain } from "./CellTerrain"
import { Ground } from "./CellTerrain/Ground"

export class Cell {
    type: CellType = new Basic()
    state: CellState = new UnProcessed()
    terrain: CellTerrain = new Ground()
    location: Location
    constructor(location: Location) {
        this.location = location
    }
    travelCost(): number {
        return this.terrain.travelCost
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
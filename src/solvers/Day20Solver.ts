import {PuzzleSolver} from './PuzzleSolver';
import {Point} from "../utility/Point";

type Shortcut = {
    wallPoint: Point
    timeSaved: number
}
export default class Day20Solver extends PuzzleSolver {
    walls!: Array<Point>

    solvePart2(): string | number {
        return "Default solution to part 2";
    }
    racetrack!: Array<Point>

    solvePart1(): string | number {
        const raceTrackPositionMap: Map<Point, number> = new Map<Point, number>()
        for (let index = 0; index < this.racetrack.length; index++) {
            raceTrackPositionMap.set(this.racetrack[index], index)
        }

        const shortcuts: Array<Shortcut> = []
        for (let i = 0; i < this.walls.length; i++) {
            const wallPoint = this.walls[i]
            const adjacentRaceTrackPoints = wallPoint.directlyAdjacent().filter(adj => raceTrackPositionMap.has(adj))
            if (adjacentRaceTrackPoints.length == 2) {
                const first = raceTrackPositionMap.get(adjacentRaceTrackPoints[0]);
                const second = raceTrackPositionMap.get(adjacentRaceTrackPoints[1]);
                if (first == undefined || second == undefined) throw new Error("racetrack points not in map")
                const timeSaved = Math.abs(first - second) - 2
                shortcuts.push({wallPoint, timeSaved})
            }

        }
        const shortcutMap: Map<number, number> =
            shortcuts.reduce((map, shortcut) => {
                const prevValue = map.get(shortcut.timeSaved) || 0
                map.set(shortcut.timeSaved, prevValue + 1)
                return map
            }, new Map<number, number>)

        return shortcuts.filter(shortcut => shortcut.timeSaved >= 100).length




    }

    processInput(input: string): void {
        const walls: Array<Point> = [];
        const raceTrackPoints: Set<Point> = new Set<Point>();
        let start: Point | undefined = undefined;
        let end: Point | undefined = undefined;

        const gridParser = (character: string, point: Point) => {
            switch (character) {
                case "#":
                    walls.push(point);
                    break;
                case ".":
                    raceTrackPoints.add(point);
                    break;
                case "S":
                    start = point;
                    break;
                //end doesn't actually need to be saved because there are no forks
                case "E":
                    end = point;
                    raceTrackPoints.add(point);
                    break;
                default:
                    throw new Error(
                        "Unknown input at point " + point.toString() + ": " + character
                    );
            }
        };
        super.parseCharacterGrid(input, gridParser);
        if (!start || !end) throw new Error("start or end not defined");
        this.walls = walls;
        this.racetrack = this.orderRaceTrack(raceTrackPoints, start, end)
    }

    private orderRaceTrack(raceTrackPoints: Set<Point>, start: Point, end: Point) {
        const racetrack: Array<Point> = [start];
        while (raceTrackPoints.size) {
            const current = racetrack[racetrack.length - 1]
            racetrack.push(<Point>current.directlyAdjacent().find(raceTrackPoints.delete.bind(raceTrackPoints)))

        }
        return racetrack;
    }
}

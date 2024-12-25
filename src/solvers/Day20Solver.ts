import {PuzzleSolver} from "./PuzzleSolver";
import {Point} from "../utility/Point";

type Shortcut = {
    wallPoint: Point;
    timeSaved: number;
};

const SHORTCUT_THRESHOLD = 100;
export default class Day20Solver extends PuzzleSolver {
    walls!: Array<Point>;
    racetrack!: Array<Point>;

    solvePart1(): string | number {
        const raceTrackPositionMap: Map<Point, number> = this.racetrack.reduce(
            (map, point, index) => {
                map.set(point, index);
                return map;
            },
            new Map<Point, number>()
        );

        // Process walls and calculate shortcuts directly
        let numValidShortcuts = 0;
        for (const wallPoint of this.walls) {
            const adjacentTrackPoints = wallPoint
                .directlyAdjacent()
                .filter((point) => raceTrackPositionMap.has(point));

            if (adjacentTrackPoints.length === 2) {
                const [first, second] = adjacentTrackPoints.map(
                    (point) => raceTrackPositionMap.get(point)!
                );
                const timeSaved = Math.abs(first - second) - 2;
                if (timeSaved >= SHORTCUT_THRESHOLD) {
                    numValidShortcuts++;
                }
            }
        }
        return numValidShortcuts;
    }

    solvePart2(): string | number {
        return "Default solution to part 2";
    }

    processInput(input: string): void {
        const walls: Array<Point> = [];
        const raceTrackPoints: Set<Point> = new Set();
        let start: Point | undefined;

        const gridParser = (character: string, point: Point) => {
            switch (character) {
                case "#":
                    walls.push(point);
                    break;
                case "S":
                    start = point;
                    break;
                case ".":
                case "E":
                    raceTrackPoints.add(point);
                    break;
                default:
                    throw new Error(`Unknown input at ${point}: ${character}`);
            }
        };

        super.parseCharacterGrid(input, gridParser);

        if (!start) throw new Error("Start not defined");

        this.walls = walls;
        this.racetrack = this.orderRaceTrack(raceTrackPoints, start);
    }

    private orderRaceTrack(raceTrackPoints: Set<Point>, start: Point) {
        const racetrack: Array<Point> = [start];
        while (raceTrackPoints.size) {
            const current = racetrack[racetrack.length - 1];
            racetrack.push(
                <Point>(
                    current.directlyAdjacent().find((adj) => raceTrackPoints.delete(adj))
                )
            );
        }
        return racetrack;
    }
}

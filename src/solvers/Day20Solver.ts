import {PuzzleSolver} from "./PuzzleSolver";
import {Point} from "../utility/Point";

type Shortcut = {
    wallPoint: Point;
    timeSaved: number;
};

export default class Day20Solver extends PuzzleSolver {
    walls!: Array<Point>;
    racetrack!: Array<Point>;
    raceTrackIndexMap!: Map<Point, number>;

    solvePart1(): string | number {
        // Precompute race track indices
        this.raceTrackIndexMap = new Map<Point, number>();
        this.racetrack.forEach((point, index) =>
            this.raceTrackIndexMap.set(point, index)
        );

        // Precompute shortcuts
        const shortcuts: Array<Shortcut> = this.findShortcuts();

        // Count shortcuts with significant time savings
        return shortcuts.filter((shortcut) => shortcut.timeSaved >= 100).length;
    }

    solvePart2(): string | number {
        return "Default solution to part 2";
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
                    raceTrackPoints.add(point);
                    break;
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
        this.racetrack = this.orderRaceTrack(raceTrackPoints, start, end);
    }

    private orderRaceTrack(
        raceTrackPoints: Set<Point>,
        start: Point,
        end: Point
    ): Array<Point> {
        const racetrack: Array<Point> = [start];

        while (raceTrackPoints.size) {
            const current = racetrack[racetrack.length - 1];
            const next = current
                .directlyAdjacent()
                .find((adj) => raceTrackPoints.has(adj));
            if (!next) throw new Error("Race track is disconnected!");
            raceTrackPoints.delete(next);
            racetrack.push(next);
        }

        return racetrack;
    }

    private findShortcuts(): Array<Shortcut> {
        const shortcuts: Array<Shortcut> = [];

        for (const wallPoint of this.walls) {
            // Get race track points adjacent to the wall
            const adjacentRaceTrackPoints = wallPoint
                .directlyAdjacent()
                .filter((point) => this.raceTrackIndexMap.has(point));

            // Only consider walls with exactly two adjacent race track points
            if (adjacentRaceTrackPoints.length === 2) {
                const [first, second] = adjacentRaceTrackPoints;
                const firstIndex = this.raceTrackIndexMap.get(first)!;
                const secondIndex = this.raceTrackIndexMap.get(second)!;

                const timeSaved = Math.abs(firstIndex - secondIndex) - 2;
                if (timeSaved > 0) {
                    shortcuts.push({wallPoint, timeSaved});
                }
            }
        }

        return shortcuts;
    }
}

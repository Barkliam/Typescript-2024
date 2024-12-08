import {PuzzleSolver} from "./PuzzleSolver";
import {Point} from "../utility/Point";


export default class Day06Solver extends PuzzleSolver {
    initialPosition!: Point;
    initialDirection: Point = Point.get(0, -1);
    obstacles!: Array<Point>;
    maxX!: number;
    maxY!: number;

    solvePart1(): number {
        const visited: Set<Point> = new Set();
        this.runGuardWalk(visited, this.initialPosition, this.initialDirection, this.obstacles);
        return visited.size;
    }

    solvePart2(): number {
        const visited: Set<Point> = new Set();
        this.runGuardWalk(visited, this.initialPosition, this.initialDirection, this.obstacles);
        visited.delete(this.initialPosition);
        return Array.from(visited).filter((visitedPoint: Point) => this.runGuardWalk(new Set<Point>(), this.initialPosition, this.initialDirection, [...this.obstacles, visitedPoint])).length;
    }

    processInput(input: string): void {
        this.obstacles = [];
        let y = 0;
        for (const row of input.split("\n")) {
            for (let x = 0; x < row.length; x++) {
                switch (row.charAt(x)) {
                    case "^":
                        this.initialPosition = Point.get(x, y);
                        break;
                    case "#":
                        this.obstacles.push(Point.get(x, y));
                        break;
                    case ".":
                        break;
                    default:
                        throw new Error("Unrecognized character: " + row.charAt(x));
                }
                this.maxX = x;
            }
            this.maxY = y;
            y++;
        }
    }

    //Returns true if repeating loop
    private runGuardWalk(visited: Set<Point>, position: Point, direction: Point, obstacles: Array<Point>): boolean {
        const visitedCorners: Set<string> = new Set<string>();

        while (this.isGuardInBounds(position)) {
            visited.add(position);
            let nextPosition = position.add(direction);
            while (obstacles.includes(nextPosition)) {
                direction = direction.rotateRight();
                nextPosition = position.add(direction);
                const visitedCornersKey = position.toString() + direction.toString();
                if (visitedCorners.has(visitedCornersKey)) {
                    return true;
                }
                visitedCorners.add(visitedCornersKey);
            }
            position = nextPosition;
        }
        return false;
    }

    private isGuardInBounds(point: Point): boolean {
        const x = point.x;
        const y = point.y;
        return x >= 0 && x <= this.maxX && y >= 0 && y <= this.maxY;
    }
}

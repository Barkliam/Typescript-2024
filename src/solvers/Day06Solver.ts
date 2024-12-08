import { PuzzleSolver } from "./PuzzleSolver";

class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    rotateRight(): Point {
        return new Point(-this.y, this.x);
    }

    add(other: Point): Point {
        return new Point(this.x + other.x, this.y + other.y);
    }
    toString(): string {
        return "(" + this.x + "," + this.y + ")";
    }
    clone(): Point {
        return new Point(this.x, this.y);
    }
}

export default class Day06Solver extends PuzzleSolver {
    initialPosition!: Point;
    initialDirection: Point = new Point(0, -1);
    obstacles!: Array<string>;
    maxX!: number;
    maxY!: number;

    solvePart1(): number {
        const visited: Set<string> = new Set();
        this.runGuardWalk(
            visited,
            this.initialPosition.clone(),
            this.initialDirection.clone(),
            this.obstacles
        );
        return visited.size;
    }

    //returns true if repeating loop
    private runGuardWalk(
        visited: Set<string>,
        position: Point,
        direction: Point,
        obstacles: Array<string>
    ): boolean {
        const turns: Set<string> = new Set<string>();

        while (this.isGuardInBounds(position)) {
            visited.add(position.toString());
            let nextPosition = position.add(direction);
            while (obstacles.includes(nextPosition.toString())) {
                direction = direction.rotateRight();
                nextPosition = position.add(direction);
                const positionDirectionString =
                    position.toString() + direction.toString();
                if (turns.has(positionDirectionString)) {
                    return true;
                }
                turns.add(positionDirectionString);
            }
            position = nextPosition;
        }
        return false;
    }

    solvePart2(): number {
        const visited: Set<string> = new Set();
        this.runGuardWalk(
            visited,
            this.initialPosition.clone(),
            this.initialDirection.clone(),
            this.obstacles
        );
        visited.delete(this.initialPosition.toString());
        return Array.from(visited).filter((visitedPoint: string) =>
            this.runGuardWalk(
                new Set<string>(),
                this.initialPosition,
                this.initialDirection,
                [...this.obstacles, visitedPoint.toString()]
            )
        ).length;
    }

    processInput(input: string): void {
        this.obstacles = [];
        let y: number = 0;
        for (const row of input.split("\n")) {
            for (let x = 0; x < row.length; x++) {
                switch (row.charAt(x)) {
                    case "^":
                        this.initialPosition = new Point(x, y);
                        break;
                    case "#":
                        this.obstacles.push(new Point(x, y).toString());
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

    private isGuardInBounds(point: Point): boolean {
        const x = point.x;
        const y = point.y;
        return x >= 0 && x <= this.maxX && y >= 0 && y <= this.maxY;
    }
}

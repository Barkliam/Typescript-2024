import {PuzzleSolver} from './PuzzleSolver';
import {Point} from "../utility/Point";

enum Direction {
    LEFT = 0, UP, DOWN, RIGHT
}

const directionVectors = Point.unitVectors.filter(point => !(point.x * point.y))

const push = function (point: Point, direction: Direction): Point {
    return point.add(directionVectors[direction.valueOf()])
}
export default class Day15Solver extends PuzzleSolver {
    boxes!: Set<Point>;
    walls!: Set<Point>;
    robotPosition!: Point
    moves!: Direction[]

    solvePart1(): string | number {
        this.printGrid()
        //at the beginning and every time, a obstacle moves, check whether it has two (non-opposite) adjacent walls. If it does, add the total and convert to a wall
        for (const direction of this.moves) {
            const newRobotPosition = push(this.robotPosition, direction);

            if (this.walls.has(newRobotPosition)) {
                continue;
            } else if (this.boxes.has(newRobotPosition)) {
                let nextEmptySpace = push(newRobotPosition, direction)
                while (this.boxes.has(nextEmptySpace)) {
                    nextEmptySpace = push(nextEmptySpace, direction)
                }
                if (this.walls.has(nextEmptySpace)) {
                    continue;
                }
                this.boxes.delete(newRobotPosition)
                this.boxes.add(nextEmptySpace)


            }

            this.robotPosition = newRobotPosition


        }
        this.printGrid()
        return Array.from(this.boxes).map(box => box.x + box.y * 100).reduce(super.sum)
    }

    solvePart2(): string | number {
        return "Default solution to part 2";
    }

    processInput(input: string): void {


        const [map, moves] = input.split("\n\n")
        this.parseMap(map);
        this.parseMoves(moves)
    }

    private parseMap(gridInput: string) {
        this.boxes = new Set<Point>();
        this.walls = new Set<Point>();

        const gridParser = (character: string, point: Point) => {
            switch (character) {
                case "#":
                    this.walls.add(point)
                    break;
                case "O":
                    this.boxes.add(point);
                    break;
                case "@":
                    this.robotPosition = point;
                    break;
                case ".":
                    break;
                default:
                    throw new Error("Unknown input at point " + point.toString() + ": " + character)
            }
        }
        super.parseCharacterGrid(gridInput, gridParser);


    }


    private parseMoves(movesInput: string) {
        const parseDirection = function (character: string): Direction {
            switch (character) {
                case "^":
                    return Direction.UP;
                case ">":
                    return Direction.RIGHT;
                case "v":
                    return Direction.DOWN
                case "<":
                    return Direction.LEFT
            }
            throw new Error("Unknown input direction: " + character);

        }

        this.moves = movesInput.replace(/\n/g, "").split("").map(parseDirection);

    }


    private printGrid() {

        const maxPoint = Array.from(this.walls).reduce((acc, curr) => Point.get(Math.max(acc.x, curr.x), Math.max(acc.y, curr.y)), Point.get(0, 0))
        let gridString = "";
        for (let y = 0; y <= maxPoint.y; y++) {
            for (let x = 0; x <= maxPoint.x; x++) {
                const currentPoint = Point.get(x, y)
                gridString += this.walls.has(currentPoint) ? "#" : this.boxes.has((currentPoint)) ? "O" : this.robotPosition === currentPoint ? "@" : "."
            }
            gridString += "\n";
        }
        console.log(gridString);
    }
}

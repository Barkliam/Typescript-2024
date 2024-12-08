import {PuzzleSolver} from "./PuzzleSolver";
import {Point} from "../utility/Point";

export default class Day04Solver extends PuzzleSolver {
    letterGrid!: Map<Point, string>;
    xmas = [{letter: "X", position: 0}, {letter: "M", position: 1}, {
        letter: "A", position: 2,
    }, {letter: "S", position: 3},];

    solvePart1(): string | number {
        let count = 0;
        for (const [point, char] of this.letterGrid.entries()) {
            if (char !== 'X') {
                continue;
            }
            for (const direction of Point.unitVectors) {
                if (this.xmas.every(({
                                         letter,
                                         position
                                     }) => letter === this.letterGrid.get(point.add(direction.multiply(position))))) {
                    count++;
                }
            }
        }

        return count;
    }

    solvePart2(): number {
        let count: number = 0;

        for (const [point, char] of this.letterGrid.entries()) {
            if (char !== 'A') {
                continue;
            }
            const diagonals = Point.unitVectors.filter(vector => vector.x * vector.y !== 0);
            diagonals.map(vector => this.letterGrid.get(point.add(vector)))

        }
        return count;
    }

    processInput(input: string): void {
        this.letterGrid = new Map();
        let y: number = 0;
        for (const row of input.split("\n")) {
            for (let x: number = 0; x < row.length; x++) {
                this.letterGrid.set(Point.get(x, y), row.charAt(x));
            }
            y++;
        }
    }
}

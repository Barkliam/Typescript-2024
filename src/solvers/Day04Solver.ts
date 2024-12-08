import {PuzzleSolver} from "./PuzzleSolver";
import {Point} from "../utility/Point";

export default class Day04Solver extends PuzzleSolver {
    letterGrid!: Map<Point, "X" | "M" | "A" | "S">;
    xmas = ["X", "M", "A", "S"];
    diagonalVectors = Point.unitVectors.filter(vector => vector.x * vector.y !== 0);

    solvePart1(): string | number {
        let count = 0;
        for (const [point, char] of this.letterGrid.entries()) {
            if (char !== "X") {
                continue;
            }
            for (const direction of Point.unitVectors) {
                if (this.xmas.every((letter, index) => {
                    let testPoint = point.add(direction.multiply(index));
                    return letter === this.letterGrid.get(testPoint);
                })) {
                    count++;
                }
            }
        }

        return count;
    }

    solvePart2(): number {
        let count: number = 0;

        for (const [point, char] of this.letterGrid.entries()) {
            if (char !== "A") {
                continue;
            }
            const diagonalLetters = this.diagonalVectors
                .map((vector) => this.letterGrid.get(point.add(vector)) || "#")
                .join("");
            if (["MMSS", "SSMM", "SMSM", "MSMS"].includes(diagonalLetters)) {
                count++;
            }
        }
        return count;
    }

    processInput(input: string): void {
        this.letterGrid = new Map();
        let y: number = 0;
        for (const row of input.split("\n")) {
            for (let x: number = 0; x < row.length; x++) {
                const letter = row.charAt(x);
                this.letterGrid.set(Point.get(x, y), letter as "X" | "M" | "A" | "S");
            }
            y++;
        }
    }
}

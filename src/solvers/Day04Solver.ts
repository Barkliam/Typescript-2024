import {PuzzleSolver} from "./PuzzleSolver";
import {Point} from "../utility/Point";

export default class Day04Solver extends PuzzleSolver {
    letterGrid!: Map<Point, "X" | "M" | "A" | "S">;
    xmas = ["X", "M", "A", "S"];

    solvePart1(): string | number {
        let count = 0;
        for (const [point, char] of this.letterGrid.entries()) {
            if (char !== "X") {
                continue;
            }
            for (const direction of Point.unitVectors) {
                if (
                    this.xmas.every(
                        (letter, index) =>
                            letter ===
                            this.letterGrid.get(point.add(direction.multiply(index)))
                    )
                ) {
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
            const diagonals = Point.unitVectors.filter(
                (vector) => vector.x * vector.y !== 0
            );
            const diagonalLetters = diagonals
                .map((vector) => this.letterGrid.get(point.add(vector)) || "#")
                //  .sort()
                .join("");
            if (
                diagonalLetters === "MMSS" ||
                diagonalLetters === "SSMM" ||
                diagonalLetters === "SMSM" ||
                diagonalLetters === "MSMS"
            ) {
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

import {Point} from "../utility/Point";

type BiConsumer<T, K> = (arg1: T, arg2: K) => void;
export abstract class PuzzleSolver {
    constructor(input: string) {
        this.processInput(input);
    }

    abstract processInput(input: string): void;

    abstract solvePart1(): string | number;

    abstract solvePart2(): string | number;

    sum(a: number, b: number): number {
        return a + b;
    }

    parseCharacterGrid(gridInput: string, consumer: BiConsumer<string, Point>) {
        gridInput.split("\n").forEach((row, y) => {
            [...row].forEach((letter, x) => {
                consumer(letter, Point.get(x, y))
            });
        });
    }
}

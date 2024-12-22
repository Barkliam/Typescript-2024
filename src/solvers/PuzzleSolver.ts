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

    min(a: number, b: number): number {
        return Math.min(a, b);
    }

    parseCharacterGrid(gridInput: string, consumer: BiConsumer<string, Point>) {
        gridInput.split("\n").forEach((row, y) => {
            [...row].forEach((letter, x) => {
                consumer(letter, Point.get(x, y))
            });
        });
    }


    insertIntoSortedArray<T>(array: T[], newItem: T, comparator: (a: T, b: T) => number): void {
        let low = 0;
        let high = array.length;

        // Binary search to find the correct index
        while (low < high) {
            const mid = Math.floor((low + high) / 2);
            if (comparator(array[mid], newItem) < 0) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }

        array.splice(low, 0, newItem);
    }

    newComparator<T>(extractor: (item: T) => number): (a: T, b: T) => number {
        return (a, b) => extractor(a) - extractor(b);
    }
}

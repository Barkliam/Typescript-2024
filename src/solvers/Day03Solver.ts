import {PuzzleSolver} from "./PuzzleSolver";

export default class Day03Solver extends PuzzleSolver {
    input!: string;

    multiplyPair(stringPair: string): number {
        const [a, b] = stringPair.split(",").map(Number);
        return a * b;
    }

    solvePart1(): number {
        return this.sumMultiplicationPairs(this.input);
    }

    sumMultiplicationPairs(input: string): number {
        const multiplicationPairs = input.match(/(?<=mul\()\d+,\d+(?=\))/g) || [];
        return multiplicationPairs.map(this.multiplyPair).reduce(this.sum);
    }

    solvePart2(): number {
        const doPrefixedInput = "do()" + this.input;
        const processedInput = doPrefixedInput
            .split("don't()")
            .flatMap((text) => text.split("do()").slice(1))
            .join();
        return this.sumMultiplicationPairs(processedInput);
    }

    processInput(input: string): void {
        this.input = input;
    }
}

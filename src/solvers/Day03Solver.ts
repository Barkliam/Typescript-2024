import {PuzzleSolver} from "./PuzzleSolver";

export default class Day03Solver extends PuzzleSolver {
    input!: string;

    mutiplyPair(stringPair: string): number {
        const [a, b] = stringPair.split(",").map(Number);
        return a * b;
    }

    solvePart1(): number {
        const multiplicationPairs = this.input.match(/(?<=mul\()\d+,\d+(?=\))/g);
        if (!multiplicationPairs) return -1;
        return multiplicationPairs
            .map(this.mutiplyPair)
            .reduce((acc, curr) => acc + curr);
    }

    //TODO Why doesn't this work???
    solvePart2(): number {
        let doAmendedInput = "do()" + this.input + "do()"
        let onlyDoBlocks = doAmendedInput.split("don't()").filter(text => text.includes("do()")).map(text => text.replace(/^.*?do\(\)/, "")).join()
        const multiplicationPairs = onlyDoBlocks.match(/(?<=mul\()\d+,\d+(?=\))/g);
        if (!multiplicationPairs) return -1;
        return multiplicationPairs
            .map(this.mutiplyPair)
            .reduce((acc, curr) => acc + curr);
    }

    processInput(input: string): void {
        this.input = input;
    }
}

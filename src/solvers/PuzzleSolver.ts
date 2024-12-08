export abstract class PuzzleSolver {
    constructor(input: string) {this.processInput(input);

    }
    abstract processInput(input: string): void;

    abstract solvePart1(): string | number;
    abstract solvePart2(): string | number;
}

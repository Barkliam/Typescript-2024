export abstract class PuzzleSolver {
    protected input: string;

    constructor(input: string) {
        this.input = input;
    }

    abstract solvePart1(): string | number;
    abstract solvePart2(): string | number;
}

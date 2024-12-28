import {PuzzleSolver} from "./PuzzleSolver";

export default class Day09Solver extends PuzzleSolver {
    private freeSpaces!: Array<number>;
    private fileArray!: Array<number>;

    solvePart1(): number {
        while (this.freeSpaces.length) {
            const nextFreeSpace = this.freeSpaces.shift();
            if (!nextFreeSpace) throw new Error("No free spaces left");
            let lastValue = this.fileArray.pop();

            while (!lastValue && this.freeSpaces.length) {
                lastValue = this.fileArray.pop();
                this.freeSpaces.pop();
            }

            //handles case where last elements are empty and there are no more free spaces left
            if (!lastValue) {
                break;
            }
            this.fileArray[nextFreeSpace] = lastValue;
        }
        return this.fileArray.reduce((sum, fileId, fileIndex) => sum + fileId * fileIndex);
    }

    solvePart2(): string | number {
        return "Default solution to part 2";
    }

    processInput(input: string): void {
        let file = true;
        let fileArray: Array<number> = [];
        let freeSpaces: Array<number> = [];
        let fileId = 0;

        input
            .split("")
            .map(Number)
            .forEach((digit) => {
                if (file) {
                    fileArray.push(...Array(digit).fill(fileId));
                    fileId++;
                } else {
                    freeSpaces.push(...this.getRange(fileArray.length, digit));
                    fileArray.push(...Array(digit).fill(NaN));
                }

                file = !file;
            });
        this.freeSpaces = freeSpaces;
        this.fileArray = fileArray;
    }

    private getRange(start: number, length: number): number[] {
        return Array.from({length}, (_, i) => start + i);
    }
}

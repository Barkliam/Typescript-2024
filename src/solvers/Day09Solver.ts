import {PuzzleSolver} from "./PuzzleSolver";

export default class Day09Solver extends PuzzleSolver {
    private freeSpaces!: Array<number>;
    private fileArray!: Array<number>;

    solvePart1(): string | number {
        while (this.freeSpaces.length) {
            const nextFreeSpace: number | undefined = this.freeSpaces.shift();
            if (!nextFreeSpace) throw new Error("no free spaces left");
            let lastValue: number | undefined = this.fileArray.pop();

            while (!lastValue && this.freeSpaces.length) {
                lastValue = this.fileArray.pop();
                this.freeSpaces.pop();
            }

            if (!lastValue) break;

            this.fileArray[nextFreeSpace] = lastValue;
        }
        return this.fileArray.reduce((acc, curr, i) => acc + curr * i);
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

    private getRange(start: number, length: number): Array<number> {
        const returnArray = [];
        for (let i = 0; i < length; i++) {
            returnArray.push(start + i);
        }
        return returnArray;
    }
}

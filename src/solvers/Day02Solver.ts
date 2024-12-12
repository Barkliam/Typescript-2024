import {PuzzleSolver} from './PuzzleSolver';

export default class Day02Solver extends PuzzleSolver {


    line!: string[][];

    solvePart1(): number {

        const len = this.line.filter(line => {
            let lastNum = Number(line.shift());
            let increasing = (Number(line[0]) - lastNum) > 0;
            while (line.length) {
                let current = Number(line.shift());
                let diff = (current - lastNum) * (increasing ? 1 : -1);
                if (diff <= 0 || diff > 3) {
                    return false;
                }
                lastNum = current;
            }
            return true;


        }).length;

        return len || -1;

    }

    solvePart2(): string | number {
        return "Default solution to part 2";
    }
    processInput(input: string): void {
        this.line = input.split("\n")
            .map(line => line.split(" "))
    }

}

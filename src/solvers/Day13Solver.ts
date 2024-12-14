import {PuzzleSolver} from './PuzzleSolver';

type Point = {
    x: bigint;
    y: bigint;
}

class ClawMachine {
    aButton: Point;
    bButton: Point;
    prize: Point;

    constructor(aButton: Point, bButton: Point, prize: Point) {
        this.aButton = aButton;
        this.bButton = bButton;
        this.prize = prize;
    }

    calculatePriceToPrize(): bigint[] {
        const denominator = this.bButton.x * this.aButton.y - this.aButton.x * this.bButton.y;
        const numerator = this.aButton.y * this.prize.x - this.aButton.x * this.prize.y;
        const buttonBTimes = numerator / denominator
        // if (Number.isInteger(buttonBTimes)) {
        const buttonATimes = (this.prize.x - buttonBTimes * this.bButton.x) / this.aButton.x
        return [3n * buttonATimes + buttonBTimes, numerator, denominator]
        // }

//return [];
    }
}

export default class Day13Solver extends PuzzleSolver {
    clawMachines!: Array<ClawMachine>;

    solvePart1(): string | number {
        let sum = 0;
        for (const clawMachine of this.clawMachines) {


            const numerator = Number(clawMachine.aButton.y)
            const prizeX = Number(clawMachine.prize.x)
            const ax = Number(clawMachine.aButton.x)
            const prizeY = Number(clawMachine.prize.y)
            const bx = Number(clawMachine.bButton.x)
            const by = Number(clawMachine.bButton.y)
            const denominator = bx * numerator - ax * by;
            const buttonBTimes = (numerator * prizeX - ax * prizeY) / denominator
            const bigResult = clawMachine.calculatePriceToPrize()
            if (Number.isInteger(buttonBTimes)) {
                const buttonATimes = (prizeX - buttonBTimes * bx) / ax
                sum += 3 * buttonATimes + buttonBTimes
            } else {
                const f = 6;
            }


        }
        return sum
    }

    solvePart2(): string | number {
        let sum = 0;

        return sum
    }

    processInput(input: string): void {

        const regex = /X[+=](\d+), Y[+=](\d+)/
        const extractPoint = (line: string): Point => {

            const coordMatch = line.match(regex)

            if (!coordMatch) {
                throw new Error(`Invalid input line: ${line}`);
            }
            return {x: BigInt(coordMatch[1]), y: BigInt(coordMatch[2])}
        };

        this.clawMachines = input
            .split("\n\n") // Split each claw machine's input block
            .map((inputBlock) => {
                const [aInput, bInput, prizeInput] = inputBlock.split("\n");
                return new ClawMachine(extractPoint(aInput), extractPoint(bInput), extractPoint(prizeInput));
            });
    }
}

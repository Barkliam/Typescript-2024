import {PuzzleSolver} from './PuzzleSolver';
import {Point} from "../utility/Point";

class ClawMachine {
    aButton: Point;
    bButton: Point;
    prize: Point;

    constructor(aButton: Point, bButton: Point, prize: Point) {
        this.aButton = aButton;
        this.bButton = bButton;
        this.prize = prize;
    }
}

export default class Day13Solver extends PuzzleSolver {
    clawMachines!: Array<ClawMachine>;

    solvePart1(): string | number {
        let sum = 0;
        for (const clawMachine of this.clawMachines) {

            const buttonBTimes = (clawMachine.aButton.y * clawMachine.prize.x - clawMachine.aButton.x * clawMachine.prize.y) / (clawMachine.bButton.x * clawMachine.aButton.y - clawMachine.aButton.x * clawMachine.bButton.y)
            if (Number.isInteger(buttonBTimes)) {
                const buttonATimes = (clawMachine.prize.x - buttonBTimes * clawMachine.bButton.x) / clawMachine.aButton.x
                sum += 3 * buttonATimes + buttonBTimes
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
            return Point.get(parseInt(coordMatch[1]), parseInt(coordMatch[2]))
        };

        this.clawMachines = input
            .split("\n\n") // Split each claw machine's input block
            .map((inputBlock) => {
                const [aInput, bInput, prizeInput] = inputBlock.split("\n");
                return new ClawMachine(extractPoint(aInput), extractPoint(bInput), extractPoint(prizeInput));
            });
    }
}

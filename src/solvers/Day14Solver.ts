import {PuzzleSolver} from "./PuzzleSolver";
import {Point} from "../utility/Point";
import {Dictionary, groupBy} from "lodash";

interface Robot {
    position: Point;
    velocity: Point;
}

const boundaries = {height: 103, width: 101};

export default class Day14Solver extends PuzzleSolver {
    robots!: Array<Robot>;

    solvePart1(): string | number {
        const robotPositions = [];
        for (const robot of this.robots) {
            this.moveRobot(robot, 100);
            robotPositions.push(robot.position);
        }
        let product = 1;
        const dictionary: Dictionary<Point[]> =
            this.divideIntoQuadrants(robotPositions);
        for (const group in dictionary) {
            product *= dictionary[group].length;
        }
        return product;
    }

    solvePart2(): string | number {
        return "Default solution to part 2";
    }

    processInput(input: string): void {
        this.robots = [];
        for (const line of input.split("\n")) {
            const [position, velocity] = line
                .split(" v=")
                .map((inputText) => inputText.replace(/[^0-9\-,]+/, ""))
                .map(Point.parseString);
            this.robots.push({position, velocity});
        }
    }

    divideIntoQuadrants(positions: Point[]) {
        const middleWidth = (boundaries.width - 1) / 2;
        const middleHeight = (boundaries.height - 1) / 2;

        const group = (point: Point) => {
            return (point.x < middleWidth ? 0 : 1) + (point.y < middleHeight ? 0 : 2);
        };
        return groupBy(
            positions.filter(
                (point) => point.x !== middleWidth && point.y !== middleHeight
            ),
            group
        );
    }

    private moveRobot(robot: Robot, timeSteps: number) {
        const newPosition = robot.velocity.multiply(timeSteps).add(robot.position);
        robot.position = this.fitPointInBounds(newPosition);
    }

    private fitPointInBounds(point: Point): Point {
        let inBoundX = point.x % boundaries.width;
        if (inBoundX < 0) {
            inBoundX += boundaries.width;
        }

        let inBoundY = point.y % boundaries.height;
        if (inBoundY < 0) {
            inBoundY += boundaries.height;
        }

        return Point.get(inBoundX, inBoundY);
    }
}


// return this.divideIntoQuadrants(robotPositions).map(quadrantList => quadrantList.length).reduce((a,b) => a*b, 1)

// for (let i = 0; i < 4; i++ ) {
//     let toPrint = "";
//     if (!message[i]){
//         console.log("invalid index", message[i], message)
//         continue
//     }
//
//     for (let y = 0; y < boundaries.height; y++) {
//         for (let x = 0; x < boundaries.width; x++) {
//             toPrint += message[i].filter(pos => pos === Point.get(x, y)).length || "."
//         }
//         toPrint += "\n"
//     }
// console.log(toPrint)
// }
//         console.log(robotPositions)
// console.log(toPrint)
//         console.log(-70 % 12, 70%12)
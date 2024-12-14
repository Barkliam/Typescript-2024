import {PuzzleSolver} from "./PuzzleSolver";
import {Point} from "../utility/Point";
import {groupBy} from "lodash";

interface Robot {
    position: Point;
    velocity: Point;
}

const BOUNDARIES = {height: 103, width: 101};

export default class Day14Solver extends PuzzleSolver {
    private robots!: Array<Robot>;

    solvePart1(): string | number {
        this.robots.forEach((robot) => this.moveRobot(robot, 100));
        const quadrants = this.divideIntoQuadrants(
            this.robots.map((robot) => robot.position)
        );
        return Object.values(quadrants)
            .map((quadrant) => quadrant.length)
            .reduce((a, b) => a * b, 1);
    }

    solvePart2(): string | number {
        return "Default solution to part 2";
    }

    processInput(input: string): void {
        this.robots = input.split("\n").map((line) => {
            const [position, velocity] = line
                .split(" v=")
                .map((inputText) => inputText.replace(/[^0-9\-,]+/, ""))
                .map(Point.parseString);
            return {position, velocity};
        });
    }

    private divideIntoQuadrants(positions: Point[]) {
        const midX = (BOUNDARIES.width - 1) / 2;
        const midY = (BOUNDARIES.height - 1) / 2;

        return groupBy(
            positions.filter((point) => point.x !== midX && point.y !== midY),
            (point) => (point.x < midX ? 0 : 1) + (point.y < midY ? 0 : 2)
        );
    }

    private moveRobot(robot: Robot, timeSteps: number) {
        const newPosition = robot.velocity.multiply(timeSteps).add(robot.position);
        robot.position = this.wrapPointWithinBounds(newPosition);
    }

    private wrapPointWithinBounds(point: Point): Point {
        const wrapCoordinate = (originalValue: number, boundary: number) =>
            ((originalValue % boundary) + boundary) % boundary;

        return Point.get(
            wrapCoordinate(point.x, BOUNDARIES.width),
            wrapCoordinate(point.y, BOUNDARIES.height)
        );
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
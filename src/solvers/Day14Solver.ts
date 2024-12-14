import {PuzzleSolver} from "./PuzzleSolver";
import {Point} from "../utility/Point";
import {groupBy} from "lodash";

interface Robot {
    position: Point;
    velocity: Point;
}

const BOUNDARIES = {height: 103, width: 101};

export default class Day14Solver extends PuzzleSolver {
    elapsedTimeSteps = 0;
    private robots!: Array<Robot>;

    solvePart1(): string | number {
        this.moveRobots(100);
        const quadrants = this.divideIntoQuadrants(
            this.robots.map((robot) => robot.position)
        );
        return Object.values(quadrants)
            .map((quadrant) => quadrant.length)
            .reduce((a, b) => a * b, 1);
    }

    solvePart2(): string | number {
        for (let i = 0; i < 10000; i++) {
            this.moveRobots(1);
            if (
                this.numTouchingPoints(this.robots.map((robot) => robot.position)) > 50
            ) {
                this.printGrid();
                return i;
            }
        }
        return -1;
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

    private moveRobots(timeSteps: number) {
        this.elapsedTimeSteps += timeSteps;
        this.robots.forEach((robot) => {
            const newPosition = robot.velocity
                .multiply(timeSteps)
                .add(robot.position);
            robot.position = this.wrapPointWithinBounds(newPosition);
        });
    }

    private wrapPointWithinBounds(point: Point): Point {
        const wrapCoordinate = (originalValue: number, boundary: number) =>
            ((originalValue % boundary) + boundary) % boundary;

        return Point.get(
            wrapCoordinate(point.x, BOUNDARIES.width),
            wrapCoordinate(point.y, BOUNDARIES.height)
        );
    }

    private printGrid() {
        const points = this.robots.map((robot) => robot.position);
        let gridString = "";
        for (let y = 0; y < BOUNDARIES.height; y++) {
            for (let x = 0; x < BOUNDARIES.width; x++) {
                gridString +=
                    points.filter((pos) => pos === Point.get(x, y)).length || ".";
            }
            gridString += "\n";
        }
        console.log(gridString);
    }

    private numTouchingPoints(points: Point[]) {
        const groups = [];
        while (points.length) {
            let toAdd = [points.pop()];
            const currentGroup = [];
            while (toAdd.length) {
                const curr = toAdd.pop()!;
                currentGroup.push(curr);
                for (const adjacent of curr
                    .directlyAdjacent()
                    .filter((da) => points.includes(da))) {
                    toAdd.push(adjacent);
                    const index = points.indexOf(adjacent);
                    points.splice(index, 1);
                }
            }
            groups.push(currentGroup);
        }
        return Math.max(...groups.map((group) => group.length));
    }
}

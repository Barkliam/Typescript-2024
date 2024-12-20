import {PuzzleSolver} from "./PuzzleSolver";
import {Point} from "../utility/Point";
import {groupBy} from "lodash";

interface Robot {
    position: Point;
    velocity: Point;
}

const BOUNDARY = {height: 103, width: 101};

export default class Day14Solver extends PuzzleSolver {
    elapsedTimeSteps = 0;
    private robots!: Array<Robot>;

    solvePart1(): number {
        this.moveRobots(100);
        const quadrants = this.divideIntoQuadrants(this.robotPositions());
        return Object.values(quadrants)
            .map((quadrant) => quadrant.length)
            .reduce((a, b) => a * b, 1);
    }

    robotPositions() {
        return this.robots.map((robot) => robot.position);
    }

    solvePart2(): number {
        const MAX_ITERATIONS = 10000;
        const TIMESTEPS_PER_ITERATION = 1;
        const ADJACENCY_THRESHOLD = 50;

        for (let i = 0; i < MAX_ITERATIONS; i++) {
            this.moveRobots(TIMESTEPS_PER_ITERATION);
            if (
                this.hasNumAdjacentPoints(this.robotPositions(), ADJACENCY_THRESHOLD)
            ) {
                this.printGrid();
                return this.elapsedTimeSteps;
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
        const midX = (BOUNDARY.width - 1) / 2;
        const midY = (BOUNDARY.height - 1) / 2;

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
            wrapCoordinate(point.x, BOUNDARY.width),
            wrapCoordinate(point.y, BOUNDARY.height)
        );
    }

    private printGrid() {
        const points = this.robots.map((robot) => robot.position);
        let gridString = "";
        for (let y = 0; y < BOUNDARY.height; y++) {
            for (let x = 0; x < BOUNDARY.width; x++) {
                gridString +=
                    points.filter((pos) => pos === Point.get(x, y)).length || ".";
            }
            gridString += "\n";
        }
        console.log(gridString);
    }

    private hasNumAdjacentPoints(
        points: Point[],
        adjacencyThreshold: number
    ): boolean {
        const groups = [];
        while (points.length) {
            let toAdd = [points.pop()];
            const currentGroup = [];
            while (toAdd.length) {
                const current = toAdd.pop()!;
                currentGroup.push(current);
                if (currentGroup.length > adjacencyThreshold) return true;
                for (const adjacent of current
                    .directlyAdjacent()
                    .filter(points.includes.bind(points))) {
                    toAdd.push(adjacent);
                    const index = points.indexOf(adjacent);
                    points.splice(index, 1);
                }
            }
            groups.push(currentGroup);
        }
        return false;
    }
}

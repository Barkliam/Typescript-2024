import {PuzzleSolver} from "./PuzzleSolver";
import {Point} from "../utility/Point";

type Area = {
    letter: string;
    points: Array<Point>;
    adjacentPoints: Map<Point, number>;
};

export default class Day12Solver extends PuzzleSolver {
    letterMap!: Map<string, Array<Point>>;

    solvePart1(): string | number {
        let areas: Array<Area> = [];
        // Iterate over each letter group
        this.letterMap.forEach((points, letter) => {
            areas = [...areas, ...this.groupConnectecAreas(points, letter)];
        });

        // Calculate the result
        return areas
            .map(
                (area) =>
                    Array.from(area.adjacentPoints.values()).reduce((a, b) => a + b, 0) *
                    area.points.length
            )
            .reduce((a, b) => a + b, 0);
    }

    solvePart2(): string | number {
        let areas: Array<Area> = [];
        // Iterate over each letter group
        this.letterMap.forEach((points, letter) => {
            areas = [...areas, ...this.groupConnectecAreas(points, letter)];
        });

        let sum = 0;
        for (const area of areas) {
            let subtraction = this.groupConnectecAreas(
                Array.from(area.adjacentPoints.keys()),
                "L"
            )
                .map((i) => i.points.length - 1)
                .reduce((a, b) => a + b);

            let letter = area.letter;
            let singleSides = Array.from(area.adjacentPoints.values()).reduce(
                (a, b) => a + b,
                0
            );
            let groupedSides = singleSides - subtraction;
            let numPoints = area.points.length;
            let price = groupedSides * numPoints;
            sum += price;
        }

        return sum;
    }

    processInput(input: string): void {
        this.letterMap = new Map<string, Array<Point>>();
        let y = 0;

        for (const row of input.split("\n")) {
            for (let x = 0; x < row.length; x++) {
                let letter = row[x];
                let points = this.letterMap.get(letter);
                if (!points) {
                    points = [];
                    this.letterMap.set(letter, points);
                }
                points.push(Point.get(x, y));
            }
            y++;
        }
    }

    private groupConnectecAreas(
        points: Array<Point>,
        letter: string
    ): Array<Area> {
        const areas: Array<Area> = [];

        while (points.length) {
            const nextPoint = points.pop();
            if (!nextPoint) continue; //why is this necessary
            let newAreaPoints = [nextPoint];
            const adjacents = new Map();
            nextPoint.directlyAdjacent().forEach((adj) => adjacents.set(adj, 1));
            let addingPoints = true;
            while (addingPoints) {
                addingPoints = false;
                let toRemove: Array<Point> = [];
                points
                    .filter((point) => adjacents.has(point))
                    .forEach((adjacent) => {
                        newAreaPoints = [...newAreaPoints, adjacent];
                        adjacents.delete(adjacent);
                        adjacent
                            .directlyAdjacent()
                            .filter((adj) => !newAreaPoints.includes(adj))
                            .forEach((adjacentAdjacent) =>
                                adjacents.set(
                                    adjacentAdjacent,
                                    (adjacents.get(adjacentAdjacent) || 0) + 1
                                )
                            );
                        addingPoints = true;
                        toRemove.push(adjacent);
                    });
                points = points.filter((oldPoint) => !toRemove.includes(oldPoint));
            }

            // Add the new area
            areas.push({points: newAreaPoints, adjacentPoints: adjacents, letter});
        }
        return areas;
    }
}

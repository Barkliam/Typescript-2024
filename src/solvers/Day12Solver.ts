import {PuzzleSolver} from "./PuzzleSolver";
import {Point} from "../utility/Point";

type Area = { letter: string, points: Array<Point>; adjacentPoints: Map<Point, number> };

export default class Day12Solver extends PuzzleSolver {
    maxX!: number;
    maxY!: number;
    letterMap!: Map<string, Array<Point>>;

    solvePart1(): string | number {
        const areas: Array<Area> = new Array<Area>();
        this.letterMap.forEach((points, letter) => {
            const sameLetterAreas: Array<Area> = new Array<Area>();
            while (points.length) {
                const nextPoint = points.pop();
                if (!nextPoint) continue; //why is this necessary
                let newAreaPoints = [nextPoint];
                const adjacents = new Map();
                nextPoint.directlyAdjacent().forEach(adj => adjacents.set(adj, 1));
                let addingPoints = true;
                while (addingPoints) {
                    addingPoints = false;
                    let toRemove: Array<Point> = [];
                    points
                        .filter((point) => adjacents.has(point))
                        .forEach((adjacent) => {
                            newAreaPoints = [...newAreaPoints, adjacent];
                            adjacents.delete(adjacent)
                            adjacent.directlyAdjacent().filter(adj => !newAreaPoints.includes(adj)).forEach(adjacentAdjacent => adjacents.set(adjacentAdjacent, (adjacents.get(adjacentAdjacent) || 0) + 1));
                            addingPoints = true;
                            toRemove.push(adjacent)
                        });
                    points = points.filter(oldPoint => !toRemove.includes(oldPoint))
                    //toRemove.forEach(adjacents.delete)
                }
                areas.push({letter, points: newAreaPoints, adjacentPoints: adjacents});
            }
        });

        return areas
            .map(function (area) {
                return Array.from(area.adjacentPoints.values()).reduce((a, b) => a + b) * area.points.length;
            })
            .reduce((a, b) => a + b);
    }

    solvePart2(): string | number {
        return "Default solution to part 2";
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

                this.maxX = x;
            }
            this.maxY = y;
            y++;
        }
    }
}

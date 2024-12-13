import {PuzzleSolver} from "./PuzzleSolver";
import {Point} from "../utility/Point";

type GardenPlot = {
    interiorPoints: Array<Point>;
    borderingPoints: Array<BorderPoint>;
};

type BorderPoint = {
    point: Point;
    closestAreaPoint: Point;
};

export default class Day12Solver extends PuzzleSolver {
    gardenPlots!: Array<GardenPlot>;

    solvePart1(): string | number {
        return this.gardenPlots.map(this.calculateSimplePrice).reduce(super.sum);
    }

    calculateSimplePrice(gardenPlot: GardenPlot): number {
        const perimeter = gardenPlot.borderingPoints.length;
        return perimeter * gardenPlot.interiorPoints.length;
    }

    solvePart2(): string | number {
        let price = 0;

        for (const gardenPlot of this.gardenPlots) {
            price +=
                this.calculateNumberOfSides(gardenPlot) *
                gardenPlot.interiorPoints.length;
        }
        return price;
    }

    calculateNumberOfSides(gardenPlot: GardenPlot): number {
        return this.expandSides([...gardenPlot.borderingPoints]).length;
    }

    expandSides(borderingPoints: Array<BorderPoint>): Array<Array<BorderPoint>> {
        const sides: Array<Array<BorderPoint>> = [];
        while (borderingPoints.length > 0) {
            const newSide: Array<BorderPoint> = [];
            const firstPoint = borderingPoints.pop()!;
            newSide.push(firstPoint);
            const queue: Array<BorderPoint> = [firstPoint];
            while (queue.length > 0) {
                const current = queue.shift();
                if (!current) continue;
                const possibleNextBorders = current.point.directlyAdjacent();
                for (const borderPoint of borderingPoints) {
                    if (
                        !newSide.includes(borderPoint) &&
                        possibleNextBorders.includes(borderPoint.point) &&
                        current.closestAreaPoint.isDirectlyAdjacent(
                            borderPoint.closestAreaPoint
                        )
                    ) {
                        newSide.push(borderPoint);
                        queue.push(borderPoint);
                    }
                }
            }
            sides.push(newSide);
            borderingPoints = borderingPoints.filter((bp) => !newSide.includes(bp));
        }
        return sides;
    }

    processInput(input: string): void {
        const letterMap = new Map<string, Array<Point>>();
        input.split("\n").forEach((row, y) => {
            [...row].forEach((letter, x) => {
                if (!letterMap.has(letter)) {
                    letterMap.set(letter, []);
                }
                letterMap.get(letter)!.push(Point.get(x, y));
            });
        });

        this.gardenPlots = [];
        for (const sameLetterPoints of letterMap.values()) {
            this.gardenPlots.push(...this.findGardenPlots(sameLetterPoints));
        }
    }

    findGardenPlots(allPoints: Array<Point>): Array<GardenPlot> {
        const gardenPlots: Array<GardenPlot> = [];
        while (allPoints.length > 0) {
            const interiorPoints: Array<Point> = [];
            let borderingPoints: Array<BorderPoint> = [];
            const areaPointsToAdd: Array<Point> = [allPoints.pop()!];
            while (areaPointsToAdd.length > 0) {
                const current = areaPointsToAdd.pop()!;
                interiorPoints.push(current);
                current.directlyAdjacent().forEach((adjacentPoint) => {
                    const index = allPoints.indexOf(adjacentPoint);
                    if (index !== -1) {
                        areaPointsToAdd.push(adjacentPoint);
                        allPoints.splice(index, 1);
                    } else if (
                        !interiorPoints.includes(adjacentPoint) &&
                        !areaPointsToAdd.includes(adjacentPoint)
                    ) {
                        borderingPoints.push({
                            point: adjacentPoint,
                            closestAreaPoint: current,
                        });
                    }
                });
            }
            gardenPlots.push({interiorPoints, borderingPoints});
        }
        return gardenPlots;
    }
}

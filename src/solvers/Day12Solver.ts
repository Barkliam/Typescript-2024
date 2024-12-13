import {PuzzleSolver} from "./PuzzleSolver";
import {Point} from "../utility/Point";

type GardenPlot = {
    interiorPoints: Array<Point>;
    borderingPoints: Array<BorderPoint>;
};

type BorderPoint = {
    point: Point;
    closestPlant: Point;
};

export default class Day12Solver extends PuzzleSolver {
    letterMap!: Map<string, Array<Point>>;

    solvePart1(): string | number {
        let gardenPlots = Array.from(this.letterMap.values())
            .map((sameLetterPoints) => [...sameLetterPoints])
            .flatMap(this.findConnectedAreas);

        return gardenPlots.map(this.calculateFencePrice).reduce(super.sum);
    }

    calculateFencePrice(gardenPlot: GardenPlot): number {
        const boundarySum = gardenPlot.borderingPoints.length;
        return boundarySum * gardenPlot.interiorPoints.length;
    }

    solvePart2(): string | number {
        let gardenPlots = Array.from(this.letterMap.values())
            .map((sameLetterPoints) => [...sameLetterPoints])
            .flatMap(this.findConnectedAreas);

        // Calculate the total sum for part 2
        let price = 0;

        for (const area of gardenPlots) {
            let borderingPoints = [...area.borderingPoints];
            let sides = [];
            while (borderingPoints.length) {
                const nextBorderPoint = borderingPoints.pop();
                if (!nextBorderPoint) continue;
                const newSide = [nextBorderPoint];

                let possibleNextBorders = nextBorderPoint.point.directlyAdjacent();
                let precursors = [nextBorderPoint.closestPlant];
                let expanding = true;

                while (expanding) {
                    let toRemove: Array<BorderPoint> = [];

                    expanding = false;
                    borderingPoints
                        .filter((borderPoint) => !newSide.includes(borderPoint))
                        .filter(
                            (borderPoint) =>
                                possibleNextBorders.includes(borderPoint.point) &&
                                precursors.some((precursor) =>
                                    precursor.isDirectlyAdjacent(borderPoint.closestPlant)
                                )
                        )
                        .forEach((borderPointToAdd) => {
                            newSide.push(borderPointToAdd);
                            precursors.push(borderPointToAdd.closestPlant);
                            possibleNextBorders.push(
                                ...borderPointToAdd.point.directlyAdjacent()
                            );
                            expanding = true;
                            toRemove.push(borderPointToAdd);
                        });
                    borderingPoints = borderingPoints.filter(
                        (borderPoint) => !toRemove.includes(borderPoint)
                    );
                }
                sides.push(newSide);
            }
            price += sides.length * area.interiorPoints.length;
        }

        return price;
    }

    processInput(input: string): void {
        this.letterMap = new Map<string, Array<Point>>();
        let y = 0;

        for (const row of input.split("\n")) {
            for (let x = 0; x < row.length; x++) {
                const letter = row[x];
                if (!this.letterMap.has(letter)) {
                    this.letterMap.set(letter, []);
                }
                this.letterMap.get(letter)!.push(Point.get(x, y));
            }
            y++;
        }
    }

    private findConnectedAreas(allPoints: Array<Point>): Array<GardenPlot> {
        const gardenPlots: Array<GardenPlot> = [];

        while (allPoints.length) {
            const nextPoint = allPoints.pop();
            if (!nextPoint) continue;

            const connectedAreaPoints = [nextPoint];
            let borderingPoints: Array<BorderPoint> = [];

            nextPoint.directlyAdjacent().forEach((adj) =>
                borderingPoints.push({
                    point: adj,
                    closestPlant: nextPoint,
                })
            );

            let expanding = true;

            while (expanding) {
                expanding = false;

                const toRemove: Array<Point> = [];
                allPoints
                    .filter((point) =>
                        borderingPoints.map((i) => i.point).includes(point)
                    )
                    .forEach((nextPointToAdd) => {
                        connectedAreaPoints.push(nextPointToAdd);
                        toRemove.push(nextPointToAdd);
                        nextPointToAdd.directlyAdjacent().forEach((newBorderingPoint) =>
                            borderingPoints.push({
                                point: newBorderingPoint,
                                closestPlant: nextPointToAdd,
                            })
                        );

                        expanding = true;
                    });

                borderingPoints = borderingPoints.filter(
                    (oldPoint) => !toRemove.includes(oldPoint.point)
                );
                allPoints = allPoints.filter(
                    (oldPoint) => !toRemove.includes(oldPoint)
                );
            }
            borderingPoints = borderingPoints.filter(
                (oldPoint) => !connectedAreaPoints.includes(oldPoint.point)
            );
            gardenPlots.push({
                interiorPoints: connectedAreaPoints,
                borderingPoints: borderingPoints,
            });
        }

        return gardenPlots;
    }
}

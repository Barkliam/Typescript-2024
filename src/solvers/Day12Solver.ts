import {PuzzleSolver} from "./PuzzleSolver";
import {Point} from "../utility/Point";

type Area = {
    letter: string;
    points: Array<Point>;
    adjacentPoints: Array<BorderPoint>;
};

type BorderPoint = {
    point: Point
    precursor: Point
};


export default class Day12Solver extends PuzzleSolver {
    letterMap!: Map<string, Array<Point>>;

    solvePart1(): string | number {
        // let areas: Array<Area> = [];
        //
        // //TODO turn into a flatMap
        // // Group connected areas for each letter
        // this.letterMap.forEach((points, letter) => {
        //     areas = [...areas, ...this.findConnectedAreas(points, letter)];
        // });
        //
        // // Calculate the result for part 1
        // return areas
        //     .map((area) => this.calculateAreaScore(area))
        //     .reduce((total, score) => total + score, 0);

        return -1
    }

    solvePart2(): string | number {
        let areas: Array<Area> = [];

        // Group connected areas for each letter
        this.letterMap.forEach((points, letter) => {
            areas = [...areas, ...this.findConnectedAreas(points, letter)];
        });

        // Calculate the total sum for part 2
        let price = 0

        for (const area of areas) {
            let borderingPoints = [...area.adjacentPoints]
            let sides = []
            while (borderingPoints.length) {
                const nextBorderPoint = borderingPoints.pop();
                if (!nextBorderPoint) continue;
                const newSide = [nextBorderPoint];

                let possibleNextBorders = nextBorderPoint.point.directlyAdjacent();
                let precursors = [nextBorderPoint.precursor]
                let expanding = true;

                while (expanding) {
                    let toRemove: Array<BorderPoint> = []

                    expanding = false
                    borderingPoints.filter(borderPoint => !newSide.includes(borderPoint)).filter(borderPoint => possibleNextBorders.includes(borderPoint.point) && precursors.some(precursor => precursor.isDirectlyAdjacent(borderPoint.precursor))).forEach(borderPointToAdd => {
                        newSide.push(borderPointToAdd);
                        precursors.push(borderPointToAdd.precursor);
                        possibleNextBorders.push(...borderPointToAdd.point.directlyAdjacent())
                        expanding = true;
                        toRemove.push(borderPointToAdd)


                    })
                    borderingPoints = borderingPoints.filter(borderPoint => !toRemove.includes(borderPoint))
                }
                sides.push(newSide)
            }
            console.log(area.letter, sides.length, area.points.length)
            price += sides.length * area.points.length


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

    private findConnectedAreas(points: Array<Point>, letter: string): Array<Area> {
        const areas: Array<Area> = [];

        while (points.length) {
            const nextPoint = points.pop();
            if (!nextPoint) continue;

            const newAreaPoints = [nextPoint];
            let borderingPoints: Array<BorderPoint> = [];

            nextPoint.directlyAdjacent().forEach((adj) => borderingPoints.push({
                point: adj,
                precursor: nextPoint
            }));

            let expanding = true;

            while (expanding) {
                expanding = false;

                const toRemove: Array<Point> = [];
                points
                    .filter((point) => borderingPoints.map(i => i.point).includes(point))
                    .forEach((nextPointToAdd) => {
                        newAreaPoints.push(nextPointToAdd);
                        toRemove.push(nextPointToAdd);
                        nextPointToAdd
                            .directlyAdjacent()
                            .forEach((newBorderingPoint) =>
                                borderingPoints.push({
                                    point: newBorderingPoint,
                                    precursor: nextPointToAdd
                                })
                            );

                        expanding = true;

                    });

                borderingPoints = borderingPoints.filter((oldPoint) => !toRemove.includes(oldPoint.point));
                points = points.filter((oldPoint) => !toRemove.includes(oldPoint));
            }
            borderingPoints = borderingPoints.filter(oldPoint => !newAreaPoints.includes(oldPoint.point))
            areas.push({points: newAreaPoints, adjacentPoints: borderingPoints, letter});
        }

        return areas;
    }

    private calculateAreaScore(area: Area): number {
        const boundarySum = area.adjacentPoints.length;
        return boundarySum * area.points.length;
    }

    // private calculateBoundarySubtraction(area: Area): number {
    //     const boundaryAreas = this.findConnectedAreas(
    //         Array.from(area.adjacentPoints.keys()),
    //         "L"
    //     );
    //
    //     return boundaryAreas
    //         .map((boundaryArea) => boundaryArea.points.length - 1)
    //         .reduce((a, b) => a + b, 0);
    // }

    // private calculateTotalSides(area: Area): number {
    //     return Array.from(area.adjacentPoints.values()).reduce((a, b) => a + b, 0);
    // }
}

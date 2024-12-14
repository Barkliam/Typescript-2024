export class Point {
    private static pointMap: Map<string, Point> = new Map();
    private static unitVectorCache: Point[] | null = null;

    static get unitVectors(): Point[] {
        if (!Point.unitVectorCache) {
            Point.unitVectorCache = [];
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    if (x !== 0 || y !== 0) {
                        Point.unitVectorCache.push(Point.get(x, y));
                    }
                }
            }
        }
        return Point.unitVectorCache;
    }

    static parseString(stringToParse: string): Point {
        const [x, y] = stringToParse.split(",").map(Number)
        return Point.get(x, y)
    }

    directlyAdjacent(): Point[] {
        return Point.unitVectors.filter(point => !(point.x * point.y)).map(point => this.add(point))
    }

    private constructor(public readonly x: number, public readonly y: number) {
    }

    static get(x: number, y: number): Point {
        const key = `${x},${y}`;
        if (!Point.pointMap.has(key)) {
            Point.pointMap.set(key, new Point(x, y));
        }
        return Point.pointMap.get(key)!;
    }

    rotateRight(): Point {
        return Point.get(-this.y, this.x);
    }

    add(other: Point): Point {
        return Point.get(this.x + other.x, this.y + other.y);
    }

    toString(): string {
        return `(${this.x},${this.y})`;
    }

    multiply(multiplier: number) {
        return Point.get(this.x * multiplier, this.y * multiplier);
    }

    isDirectlyAdjacent(point: Point) {
        return this.directlyAdjacent().includes(point);
    }
}

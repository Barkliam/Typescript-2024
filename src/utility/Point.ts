export class Point {
    private static pointMap: Map<string, Point> = new Map();

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
}

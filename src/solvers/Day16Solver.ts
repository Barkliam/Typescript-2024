import {PuzzleSolver} from "./PuzzleSolver";
import {Direction, getDirectionVector, Point} from "../utility/Point";

const directions = [
    Direction.LEFT,
    Direction.UP,
    Direction.DOWN,
    Direction.RIGHT,
];
const START_DIRECTION = Direction.RIGHT;

class Path {
    visited: Array<MazeNode> = new Array<MazeNode>();
    end: MazeNode;
    precursor: Path | undefined;
    cachedAllNodes: Array<MazeNode> | undefined
    cachedScore: number | undefined;

    constructor(
        visited: Array<MazeNode>,
        end: MazeNode,
        precursor: Path | undefined
    ) {
        this.visited = visited;
        this.end = end;
        this.precursor = precursor;
    }

    possibleNextSteps(): Array<MazeNode> {
        return Array.from(this.visited[0].connected.keys()).filter(
            (node) => !this.hasSeen(node)
        );
    }

    hasSeen(node: MazeNode): boolean {
        return (
            this.visited.includes(node) ||
            (this.precursor ? this.precursor.hasSeen(node) : false)
        );
    }

    continue(): Array<Path> {
        while (this.possibleNextSteps().length === 1) {
            this.visited.unshift(this.possibleNextSteps()[0]);
            if (this.visited[0] === this.end) {
                return [this];
            }
        }

        return this.possibleNextSteps().map(
            (node) => new Path([node], this.end, this)
        );
    }

    isFinsished(): boolean {
        return this.visited[0].point === this.end.point;
    }

    isDeadEnd(): boolean {
        return Array.from(this.visited[0].connected.keys()).every((node) =>
            this.visited.includes(node)
        );
    }

    getAllNodes(): Array<MazeNode> {
        if (!this.cachedAllNodes) {
            const precursorNodes = this.precursor?.getAllNodes() || [];
            this.cachedAllNodes = [...this.visited, ...precursorNodes];
        }
        return this.cachedAllNodes;
    }

    getScore() {
        return this.cachedScore || this.calculateScore();
    }

    calculateScore() {
        let directionChanges: number = 0;
        let direction = START_DIRECTION;
        let lastNode: MazeNode | undefined;
        const allNodes = this.getAllNodes().reverse();

        for (const node of allNodes) {
            let newDirection = lastNode?.connected.get(node) || START_DIRECTION;
            if (newDirection !== direction) {
                directionChanges++;
            }
            lastNode = node;
            direction = newDirection;
        }
        this.cachedScore = allNodes.length + 1000 * directionChanges - 1;
        return this.cachedScore
    }
}

class Maze {
    nodeMap: Map<Point, MazeNode>;
    start: MazeNode;
    end: MazeNode;

    constructor(walkableTiles: Array<Point>, start: Point, end: Point) {
        this.nodeMap = new Map<Point, MazeNode>();
        walkableTiles.forEach((point) =>
            this.nodeMap.set(point, new MazeNode(point))
        );
        let thisStart = this.nodeMap.get(start);
        let thisEnd = this.nodeMap.get(end);
        if (!thisStart || !thisEnd) throw new Error("start or end undefiend");
        this.start = thisStart;
        this.end = thisEnd;
        this.addConnections();
    }

    findPaths() {
        let unfinishedPaths: Array<Path> = [];
        let finishedPaths: Array<Path> = [];
        unfinishedPaths.push(new Path([this.start], this.end, undefined));
        while (unfinishedPaths.length) {


            //instead of pop, use priority queue to get lowest score path
            const currentPath = unfinishedPaths.pop();
            if (!currentPath) throw new Error(" current path undefeinde");
            let continuedPaths: Array<Path> = currentPath.continue();
            continuedPaths.forEach((path) => {
                if (path.isFinsished()) {
                    finishedPaths.push(path);
                } else if (!path.isDeadEnd()) {
                    unfinishedPaths.push(path);
                }
            });
        }

        return finishedPaths;
    }

    private printPath(path: Path | undefined) {
        if (!path) return;
        let printString = "";

        for (let y = 0; y < 15; y++) {
            for (let x = 0; x < 15; x++) {
                const point = Point.get(x, y);
                if (point === this.start.point) {
                    printString += "S";
                } else if (point === this.end.point) {
                    printString += "E";
                } else if (!this.nodeMap.has(point)) {
                    printString += "#";
                } else if (path.visited[0].point === point) {
                    printString += "X";
                } else if (path.visited.map((node) => node.point).includes(point)) {
                    printString += "O";
                } else {
                    printString += ".";
                }
            }
            printString += "\n";
        }

        console.log(printString);
        if (path.precursor) {
            this.printPath(path.precursor);
        }
    }

    private addConnections() {
        for (const [point, node] of this.nodeMap.entries()) {
            directions.forEach((direction) => {
                const adjacentNode = this.nodeMap.get(
                    point.add(getDirectionVector(direction))
                );
                if (adjacentNode) {
                    node.connected.set(adjacentNode, direction);
                }
            });
        }
    }
}

class MazeNode {
    point: Point;
    connected: Map<MazeNode, Direction>;

    constructor(point: Point) {
        this.point = point;
        this.connected = new Map<MazeNode, Direction>();
    }
}

export default class Day16Solver extends PuzzleSolver {
    tileScoreMap: Map<Point, number[]> = new Map<Point, number[]>();
    maze!: Maze;

    solvePart1(): string | number {
        return Math.min(
            ...this.maze.findPaths().map((path) => path.getScore())
        );
    }

    solvePart2(): string | number {
        return "Default solution to part 2";
    }

    processInput(input: string): void {
        //Probably not necessary to save the wall points
        const walls: Set<Point> = new Set();
        const walkableTiles: Array<Point> = [];
        let start: Point | undefined = undefined;
        let end: Point | undefined = undefined;

        const gridParser = (character: string, point: Point) => {
            switch (character) {
                case "#":
                    walls.add(point);
                    break;
                case ".":
                    walkableTiles.push(point);
                    break;
                case "S":
                    start = point;
                    walkableTiles.push(point);
                    break;
                case "E":
                    end = point;
                    walkableTiles.push(point);
                    break;
                default:
                    throw new Error(
                        "Unknown input at point " + point.toString() + ": " + character
                    );
            }
        };
        super.parseCharacterGrid(input, gridParser);
        if (!start || !end) throw new Error("start or end not defined");
        this.maze = new Maze(walkableTiles, start, end);
    }
}

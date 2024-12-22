import {PuzzleSolver} from "./PuzzleSolver";
import {Direction, getDirectionVector, Point} from "../utility/Point";


const directions = [Direction.LEFT, Direction.UP, Direction.DOWN, Direction.RIGHT]
const START_DIRECTION = Direction.RIGHT;

class Path {

    visited: Array<MazeNode> = new Array<MazeNode>()
    currentNode: MazeNode
    end: MazeNode

    constructor(visited: Array<MazeNode>, currentNode: MazeNode, end: MazeNode) {
        this.visited = visited;
        this.currentNode = currentNode;
        this.end = end
    }

    possibleNextSteps(): Array<MazeNode> {
        return Array.from(this.currentNode.connected.keys()).filter(node => !this.visited.includes(node))
    }

//instead of creating all new paths here, keep creating new child paths with reference to parent paths that end at the split.
    continue(): Array<Path> {

        while (this.possibleNextSteps().length === 1) {
            this.visited.push(this.currentNode)
            this.currentNode = this.possibleNextSteps()[0]
            if (this.currentNode === this.end) {
                return [this]
            }
        }
        // if (this.p === 0){
        //     return [this]
        // }
        this.visited.push(this.currentNode)

        return this.possibleNextSteps().map(node => new Path([...this.visited], node, this.end)
        )

    }

    isFinished(): boolean {
        return this.currentNode.point === this.end.point
            || Array.from(this.currentNode.connected.keys()).every(node => this.visited.includes(node))
    }

    calculateScore() {
        this.visited.push(this.currentNode)

        let directionChanges: number = 0;
        let direction = START_DIRECTION;
        let lastNode: MazeNode | undefined = undefined


        for (const node of this.visited) {
            let newDirection = lastNode?.connected.get(node) || START_DIRECTION
            if (newDirection !== direction) {
                directionChanges++;
            }
            lastNode = node;
            direction = newDirection
        }
        return this.visited.length + 1000 * directionChanges - 1;
    }
}

class Maze {
    nodeMap: Map<Point, MazeNode>
    start: MazeNode
    end: MazeNode

    constructor(walkableTiles: Array<Point>, start: Point, end: Point) {
        this.nodeMap = new Map<Point, MazeNode>()
        walkableTiles.forEach(point => this.nodeMap.set(point, new MazeNode(point)))
        let thisStart = this.nodeMap.get(start)
        let thisEnd = this.nodeMap.get(end)
        if (!thisStart || !thisEnd) throw new Error("start or end undefiend")
        this.start = thisStart
        this.end = thisEnd
        this.addConnections()
    }

    findPaths() {
        let unfinishedPaths: Array<Path> = [];
        let finishedPaths: Array<Path> = [];
        unfinishedPaths.push(new Path([], this.start, this.end))

        while (unfinishedPaths.length) {
            const currentPath = unfinishedPaths.pop();
            if (!currentPath) throw new Error(" current path undefeinde")
            let continuedPaths: Array<Path> = currentPath.continue();
            continuedPaths.forEach(path => {
                if (path.isFinished()) {
                    if (path.currentNode === this.end) {
                        finishedPaths.push(path)
                    }
                } else {
                    unfinishedPaths.push(path)
                }
            })
        }
        for (const path of finishedPaths) {
            let printString = "";

            for (let y = 0; y < 15; y++) {
                for (let x = 0; x < 15; x++) {
                    const point = Point.get(x, y)
                    if (point === this.start.point) {
                        printString += "S";
                        continue;
                    } else if (point === this.end.point) {
                        printString += "E";
                        continue;
                    } else if (!this.nodeMap.has(point)) {
                        printString += "#";
                        continue;
                    } else if (path.currentNode.point === point) {
                        printString += "X"
                        continue;
                    } else if (path.visited.map(node => node.point).includes(point)) {
                        printString += "O"
                        continue;
                    } else {
                        printString += "."
                    }
                }
                printString += "\n"
            }

//console.log(printString)


        }


        return finishedPaths;

    }

    private addConnections() {
        for (const [point, node] of this.nodeMap.entries()) {
            directions.forEach(direction => {
                const adjacentNode = this.nodeMap.get(point.add(getDirectionVector(direction)))
                if (adjacentNode) {
                    node.connected.set(adjacentNode, direction)
                }
            })
        }
    }

}

class MazeNode {
    point: Point
    connected: Map<MazeNode, Direction>

    constructor(point: Point) {
        this.point = point
        this.connected = new Map<MazeNode, Direction>()

    }
}

type PointDirection = {
    point: Point;
    direction: Direction;
};

export default class Day16Solver extends PuzzleSolver {
    tileScoreMap: Map<Point, number[]> = new Map<Point, number[]>();
    maze!: Maze;

    solvePart1(): string | number {
//console.log(this.maze.findPaths().map(path => path.visited.map(node => node.point)))
        return Math.min(...this.maze.findPaths().map(path => path.calculateScore()))



    }

    getTileScores(point: Point): number[] {
        return (
            this.tileScoreMap.get(point) || [Infinity, Infinity, Infinity, Infinity]
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
        if (!start || !end) throw new Error("start or end not defined")
        this.maze = new Maze(walkableTiles, start, end)
    }


}

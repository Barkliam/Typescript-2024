import {PuzzleSolver} from "./PuzzleSolver";
import {Direction, getDirectionVector, Point} from "../utility/Point";

const directions = [
    Direction.LEFT,
    Direction.UP,
    Direction.DOWN,
    Direction.RIGHT,
];

type DirectionScore = { score: number, direction: Direction, prevNodes: Array<MazeNode> }



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


    public printPath(nodes: Set<MazeNode>) {
        if (!nodes) return;
        const visitedPoints: Array<Point> = Array.from(nodes).map(node => node.point)
        let printString = "";

        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 20; x++) {
                const point = Point.get(x, y);
                if (point === this.start.point) {
                    printString += "S";
                } else if (point === this.end.point) {
                    printString += "E";
                } else if (!this.nodeMap.has(point)) {
                    printString += "#";
                    // } else if (path.visited[0].point === point) {
                    //     printString += "X";
                } else if (visitedPoints.includes(point)) {
                    printString += "O";
                } else {
                    printString += ".";
                }
                printString += " "
            }
            printString += "\n";
        }

        console.log(printString);
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
    maze!: Maze;

    solvePart1(): string | number {
        const {nodeMap, start, end} = this.maze
        const scoreMap: Map<MazeNode, DirectionScore> = new Map();
        let toVisit = [start]
        while (toVisit.length) {
            const current = toVisit.pop()
            if (!current) throw new Error("didnt find end")
            const {direction, score} = (scoreMap.get(current) || {
                direction: Direction.RIGHT,
                score: 0
            })
            for (const [adjacentNode, nextDirection] of current.connected.entries()) {
                const lastSavedScore = scoreMap.get(adjacentNode)?.score || Infinity
                const newScore = score + 1 + (nextDirection == direction ? 0 : 1000)
                if (newScore < lastSavedScore) {
                    scoreMap.set(adjacentNode, {
                        direction: nextDirection,
                        score: newScore,
                        prevNodes: [current]
                    })
                    toVisit.push(adjacentNode)
                }
            }
        }


        toVisit = [end]
        let visited: Set<MazeNode> = new Set();
        while (toVisit.length) {
            const current = toVisit.pop();
            if (!current) throw new Error("no more toVisit")
            const {direction, score} = (scoreMap.get(current) || {
                direction: Direction.RIGHT,
                score: 0
            })
            visited.add(current)
            for (const [adjacentNode, adjacentDirection] of current.connected.entries()) {
                if (visited.has(adjacentNode)) continue;
                const directionScore = scoreMap.get(adjacentNode)
                if (!directionScore) throw new Error("node not visited" + adjacentNode.point)


                //TODO figure out which directions should match and not match here.

                //Add start to visited


                if ((directionScore.score == score - 1 && direction == directionScore.direction)
                    || (directionScore.score == score - 1001 && direction != directionScore.direction)
                    || (directionScore.score == score + 999 && direction != directionScore.direction)

                ) {
                    //if (directionScore.score == score-1  || directionScore.score == score-1001 || directionScore.score == score + 999){

                    toVisit.push(adjacentNode)
                }

            }


        }


        this.maze.printPath(visited)
        console.log(visited.size)

        return scoreMap.get(end)?.score || -1
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

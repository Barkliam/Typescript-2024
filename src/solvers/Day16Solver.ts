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
        const toVisit = [start]
        while (toVisit.length) {
            const current = toVisit.pop()
            if (!current) throw new Error("didnt find end")
            if (current.point.x == 4 && current.point.y == 7) console.log("47")
            const {direction, score} = (scoreMap.get(current) || {
                direction: Direction.RIGHT,
                score: 0
            })
            for (const [adjacentNode, nextDirection] of current.connected.entries()) {
                const lastSavedScore = scoreMap.get(adjacentNode)?.score || Infinity
                const newScore = score + 1 + (nextDirection == direction ? 0 : 1000)
                if ((newScore === lastSavedScore || Math.abs(newScore - lastSavedScore) === 1000) && !scoreMap.get(adjacentNode)?.prevNodes.includes(current)) console.log(adjacentNode.point)
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

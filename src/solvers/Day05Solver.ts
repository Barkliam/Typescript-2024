import {PuzzleSolver} from "./PuzzleSolver";

export default class Day05Solver extends PuzzleSolver {
    dependentMap!: Record<number, Set<number>>;
    updates!: Array<Array<number>>;

    processInput(input: string): void {
        const [rules, updates] = input
            .split("\n\n")
            .map((section) => section.split("\n"));
        this.updates = updates.map((line) => line.split(",").map(Number));

        this.dependentMap = rules.reduce((acc: Record<number, Set<number>>, curr: string) => {
            const [first, second] = curr.split("|").map(Number);
            if (!acc[first]) {
                acc[first] = new Set<number>();
            }
            acc[first].add(second);
            return acc;
        }, {});
    }

    isValidUpdate(update: Array<number>): boolean {
        for (let i = 0; i < update.length; i++) {
            const dependents: Set<number> = this.dependentMap[update[i]];
            if (dependents && update.slice(0, i).some((page) => dependents.has(page))) {
                return false;
            }
        }
        return true;
    }

    getMiddleValue(update: Array<number>): number {
        return update[Math.floor(update.length / 2)];
    }

    solvePart1(): string | number {
        return this.updates
            .filter(this.isValidUpdate.bind(this))
            .map(this.getMiddleValue)
            .reduce((acc: number, curr: number) => acc + curr);
    }

    solvePart2(): string | number {
        return this.updates.filter(update => !this.isValidUpdate(update)).map(this.fixUpdate.bind(this)).map(this.getMiddleValue).reduce((sum, curr) => sum + curr)
    }

    fixUpdate(update: Array<number>): Array<number> {
        for (let i = 0; i < update.length; i++) {
            const dependents: Set<number> = this.dependentMap[update[i]] || new Set();

            for (let j = 0; j < i; j++) {
                if (dependents.has(update[j])) {
                    update.splice(i + 1, 0, update[j]);
                    update.splice(j, 1)

                    //redo this iteration since indices are now incorrect
                    i = i - 1;
                    break;
                }
            }
        }
        return update;
    }
}

import * as fs from 'fs-extra';
import { PuzzleSolver } from '../src/solvers/PuzzleSolver';

type SolverConstructor<T extends PuzzleSolver> = new (input: string) => T;

export abstract class AbstractDayTest<T extends PuzzleSolver> {
    private SolverClass: SolverConstructor<T>;

    protected constructor(SolverClass: SolverConstructor<T>) {
        this.SolverClass = SolverClass;
    }

    testPart(part: 'Part1' | 'Part2', expected: string | number, testInputNumber: number): void {
        const testFileName = `./tests/testInput/${this.getTestFileName(testInputNumber)}`;
        if (!fs.existsSync(testFileName)) {
            throw new Error(`Test input file not found: ${testFileName}`);
        }

        const input = fs.readFileSync(testFileName, 'utf-8');
        const solver = new this.SolverClass(input);

        const result = part === 'Part1' ? solver.solvePart1() : solver.solvePart2();
        expect(String(result)).toBe(String(expected));
    }

    private getTestFileName(testInputNumber: number): string {
        return `${this.getDayName()}_test_input_${testInputNumber}.txt`;
    }

    abstract getDayName(): string;
}

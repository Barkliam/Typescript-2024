import * as fs from 'fs-extra';
import path from 'path';
import { SolverRegistry } from './SolverRegistry';
import { PuzzleSolver } from '../src/solvers/PuzzleSolver';

type SolverRegistryKeys = keyof typeof SolverRegistry;

export abstract class AbstractDayTest<T extends PuzzleSolver> {
    private SolverClass: new (input: string) => T;
    private dayNumber: SolverRegistryKeys;

    protected constructor(dayNumber: SolverRegistryKeys) {
        this.dayNumber = dayNumber;
        this.SolverClass = SolverRegistry[dayNumber] as new (input: string) => T;

        if (!this.SolverClass) {
            throw new Error(`Solver for Day ${dayNumber} not found in SolverRegistry.`);
        }
    }

    testPart(part: 1 | 2, expected: string | number, testInputNumber: number): void {
        const testFileName = this.getTestFileName(testInputNumber);
        if (!fs.existsSync(testFileName)) {
            throw new Error(`Test input file not found: ${testFileName}`);
        }

        const input = fs.readFileSync(testFileName, 'utf-8');
        const solver = new this.SolverClass(input);

        const result = part === 1 ? solver.solvePart1() : solver.solvePart2();
        expect(String(result)).toBe(String(expected));
    }

    private getTestFileName(testInputNumber: number): string {
        return path.resolve(
            __dirname,
            'testInput',
            `day_${this.dayNumber.toString().padStart(2, '0')}_test_input_${testInputNumber}.txt`
        );
    }
}

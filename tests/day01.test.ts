import { AbstractDayTest } from './AbstractDayTest';
import { Day01Solver } from '../src/solvers/Day01Solver';

class Day01Test extends AbstractDayTest<Day01Solver> {
    constructor() {
        super(Day01Solver);
    }

    getDayName(): string {
        return 'day_01';
    }
}

const dayTest = new Day01Test();

test('Day 1 Part 1 Test Input 1', () => {
    dayTest.testPart('Part1', 'Expected solution for test input 1', 1);
});

test('Day 1 Part 1 Test Input 2', () => {
    dayTest.testPart('Part1', 'Expected solution for test input 2', 2);
});

test('Day 1 Part 2 Test Input 1', () => {
    dayTest.testPart('Part2', 'Expected solution for test input 1', 1);
});

import { AbstractDayTest } from './AbstractDayTest';
import Day05Solver from '../src/solvers/Day05Solver';

class Day05Test extends AbstractDayTest<Day05Solver> {
    constructor() {
        super(Day05Solver);
    }

    getDayName(): string {
        return 'day_05';
    }
}

const dayTest = new Day05Test();

test('Day 5 Part 1 Test Input 1', () => {
    dayTest.testPart('Part1', 'Expected solution for test input 1', 1);
});

test('Day 5 Part 1 Test Input 2', () => {
    dayTest.testPart('Part1', 'Expected solution for test input 2', 2);
});

test('Day 5 Part 2 Test Input 1', () => {
    dayTest.testPart('Part2', 'Expected solution for test input 1', 1);
});

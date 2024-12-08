import { AbstractDayTest } from './AbstractDayTest';

class Day06Test extends AbstractDayTest<any>{
    constructor() {
        super(6);
    }
}

const dayTest = new Day06Test();

test('Day 6 Part 1 Test Input 1', () => {
    dayTest.testPart(1, 41, 1);
});

test('Day 6 Part 2 Test Input 1', () => {
    dayTest.testPart(2, '6', 1);
});

import { AbstractDayTest } from './AbstractDayTest';

class Day05Test extends AbstractDayTest<any>{
    constructor() {
        super(5);
    }
}

const dayTest = new Day05Test();

test('Day 5 Part 1 Test Input 1', () => {
    dayTest.testPart(1, 143, 1);
});

test('Day 5 Part 2 Test Input 1', () => {
    dayTest.testPart(2, '123', 1);
});

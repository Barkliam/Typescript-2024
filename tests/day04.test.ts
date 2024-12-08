import {AbstractDayTest} from './AbstractDayTest';

class Day04Test extends AbstractDayTest<any> {
    constructor() {
        super(4);
    }
}

const dayTest = new Day04Test();

test('Day 4 Part 1 Test Input 1', () => {
    dayTest.testPart(1, 18, 1);
});

test('Day 4 Part 2 Test Input 1', () => {
    dayTest.testPart(2, '6', 1);
});

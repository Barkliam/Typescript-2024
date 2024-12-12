import {AbstractDayTest} from './AbstractDayTest';

class Day09Test extends AbstractDayTest<any> {
    constructor() {
        super(9);
    }
}

const dayTest = new Day09Test();

test('Day 9 Part 1 Test Input 1', () => {
    dayTest.testPart(1, 41, 1);
});

test('Day 9 Part 2 Test Input 1', () => {
    dayTest.testPart(2, '9', 1);
});

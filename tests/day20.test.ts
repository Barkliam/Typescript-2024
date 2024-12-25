import {AbstractDayTest} from './AbstractDayTest';

class Day20Test extends AbstractDayTest<any> {
    constructor() {
        super(20);
    }
}

const dayTest = new Day20Test();

test('Day 20 Part 1 Test Input 1', () => {
    dayTest.testPart(1, 7036, 1);
});
test('Day 20 Part 1 Test Input 2', () => {
    dayTest.testPart(1, 11048, 2);
});

test('Day 20 Part 2 Test Input 1', () => {
    dayTest.testPart(2, '45', 1);
});
test('Day 20 Part 2 Test Input 2', () => {
    dayTest.testPart(2, '64', 2);
});
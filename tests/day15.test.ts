import {AbstractDayTest} from './AbstractDayTest';

class Day15Test extends AbstractDayTest<any> {
    constructor() {
        super(15);
    }
}

const dayTest = new Day15Test();

test('Day 15 Part 1 Test Input 1', () => {
    dayTest.testPart(1, 10092, 1);
});
test('Day 15 Part 1 Test Input 2', () => {
    dayTest.testPart(1, 2028, 2);
});

test('Day 15 Part 2 Test Input 1', () => {
    dayTest.testPart(2, '80', 1);
});
test('Day 15 Part 2 Test Input 2', () => {
    dayTest.testPart(2, '436', 2);
});
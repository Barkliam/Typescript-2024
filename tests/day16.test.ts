import {AbstractDayTest} from './AbstractDayTest';

class Day16Test extends AbstractDayTest<any> {
    constructor() {
        super(16);
    }
}

const dayTest = new Day16Test();

test('Day 16 Part 1 Test Input 1', () => {
    dayTest.testPart(1, 7036, 1);
});
test('Day 16 Part 1 Test Input 2', () => {
    dayTest.testPart(1, 11048, 2);
});

test('Day 16 Part 2 Test Input 1', () => {
    dayTest.testPart(2, '45', 1);
});
test('Day 16 Part 2 Test Input 2', () => {
    dayTest.testPart(2, '64', 2);
});
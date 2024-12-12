import {AbstractDayTest} from './AbstractDayTest';

class Day03Test extends AbstractDayTest<any> {
    constructor() {
        super(3);
    }
}

const dayTest = new Day03Test();

test('Day 3 Part 1 Test Input 1', () => {
    dayTest.testPart(1, 161, 1);
});

test('Day 3 Part 2 Test Input 2', () => {
    dayTest.testPart(2, 48, 2);
});

import {AbstractDayTest} from './AbstractDayTest';

class Day13Test extends AbstractDayTest<any> {
    constructor() {
        super(13);
    }
}

const dayTest = new Day13Test();

test('Day 13 Part 1 Test Input 1', () => {
    dayTest.testPart(1, 480, 1);
});
test('Day 13 Part 1 Test Input 2', () => {
    dayTest.testPart(1, 772, 2);
});
test('Day 13 Part 1 Test Input 3', () => {
    dayTest.testPart(1, 1930, 3);
});

test('Day 13 Part 2 Test Input 1', () => {
    dayTest.testPart(2, '80', 1);
});
test('Day 13 Part 2 Test Input 2', () => {
    dayTest.testPart(2, '436', 2);
});
test('Day 13 Part 2 Test Input 4', () => {
    dayTest.testPart(2, '236', 4);
});
test('Day 13 Part 2 Test Input 5', () => {
    dayTest.testPart(2, '368', 5);
});
test('Day 13 Part 2 Test Input 3', () => {
    dayTest.testPart(2, 1306, 3);
});
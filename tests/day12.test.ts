import {AbstractDayTest} from './AbstractDayTest';

class Day12Test extends AbstractDayTest<any> {
    constructor() {
        super(12);
    }
}

const dayTest = new Day12Test();

test('Day 12 Part 1 Test Input 1', () => {
    dayTest.testPart(1, 140, 1);
});
test('Day 12 Part 1 Test Input 2', () => {
    dayTest.testPart(1, 772, 2);
});
test('Day 12 Part 1 Test Input 3', () => {
    dayTest.testPart(1, 1930, 3);
});

test('Day 12 Part 2 Test Input 1', () => {
    dayTest.testPart(2, '80', 1);
});
test('Day 12 Part 2 Test Input 2', () => {
    dayTest.testPart(2, '436', 2);
});
test('Day 12 Part 2 Test Input 4', () => {
    dayTest.testPart(2, '236', 4);
});
test('Day 12 Part 2 Test Input 5', () => {
    dayTest.testPart(2, '368', 5);
});
test('Day 12 Part 2 Test Input 3', () => {
    dayTest.testPart(2, 1206, 3);
});
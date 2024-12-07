import * as fs from 'fs-extra';
import * as path from 'path';
import {Day01Solver} from './solvers/Day01Solver';
import {Day02Solver} from './solvers/Day02Solver';


function getInput(day: number): string {
    const inputFilePath = path.resolve(
        __dirname,
        '../../resources/2024',
        `day_${day.toString()}.txt`
    );
    if (!fs.existsSync(inputFilePath)) {
        throw new Error(`Input file not found: ${inputFilePath}`);
    }
    return fs.readFileSync(inputFilePath, 'utf-8');
}

function solveDay(day: number): void {
    const input = getInput(day);
    let solver;

    switch (day) {
        case 1:
            solver = new Day01Solver(input);
            break;
        case 2:
            solver = new Day02Solver(input);
            break;
        default:
            throw new Error(`No solver implemented for day ${day}`);
    }

    console.log(`Day ${day} - Part 1: ${solver.solvePart1()}`);
    console.log(`Day ${day} - Part 2: ${solver.solvePart2()}`);
}

// Change this line to solve a specific day:
solveDay(5);

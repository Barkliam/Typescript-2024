import * as fs from 'fs-extra';
import * as path from 'path';


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

async function solveDay(day: number): Promise<void> {
    const input = getInput(day);

    const solverModulePath = path.resolve(__dirname, 'solvers', `Day${day.toString().padStart(2, '0')}Solver`);
    if (!fs.existsSync(`${solverModulePath}.js`) && !fs.existsSync(`${solverModulePath}.ts`)) {
        throw new Error(`No solver implemented for day ${day}`);
    }

    const { default: SolverClass } = await import(solverModulePath);

    if (!SolverClass) {
        throw new Error(`Solver class not found for day ${day}`);
    }

    const solver = new SolverClass(input);
    console.log(`Day ${day} - Part 1: ${solver.solvePart1()}`);
    console.log(`Day ${day} - Part 2: ${solver.solvePart2()}`);
}

// Change this line to solve a specific day:
solveDay(20).catch((error) => console.error(error));

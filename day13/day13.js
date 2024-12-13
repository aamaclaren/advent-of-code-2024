const fs = require("fs");
const input = fs.readFileSync("./input.txt").toString();

const buttonPattern = /^.*X\+(\d+), Y\+(\d+)$/;
const prizePattern = /^.*X=(\d+), Y=(\d+)$/

const claw_machines = input.split('\n\n').map((machineInput) => {
    const [buttonAInput, buttonBInput, prizeInput] = machineInput.split('\n');

    const buttonAMatch = buttonAInput.match(buttonPattern);
    const buttonBMatch = buttonBInput.match(buttonPattern);
    const prizeMatch = prizeInput.match(prizePattern);

    return {
        buttonA: {
            x: parseInt(buttonAMatch[1]),
            y: parseInt(buttonAMatch[2])
        },
        buttonB: {
            x: parseInt(buttonBMatch[1]),
            y: parseInt(buttonBMatch[2])
        },
        prize: {
            x: parseInt(prizeMatch[1]),
            y: parseInt(prizeMatch[2])
        }
    }
});

const isAtPrize = (claw_machine, aMoves, bMoves, prizeCalibration) => 
    (claw_machine.buttonA.x * aMoves) + (claw_machine.buttonB.x * bMoves) === (claw_machine.prize.x + prizeCalibration) &&
    (claw_machine.buttonA.y * aMoves) + (claw_machine.buttonB.y * bMoves) === (claw_machine.prize.y + prizeCalibration)

const getPathsToPrize = (claw_machine, prizeCalibration = 0) => {
    const pathsToPrize = [];

    for(let aMoves = 1; aMoves <= 100; aMoves++){
        for(let bMoves = 1; bMoves <= 100; bMoves++){
            if(isAtPrize(claw_machine, aMoves, bMoves, prizeCalibration)){
                pathsToPrize.push({
                    aMoves,
                    bMoves
                });
            }
        }
    }

    return pathsToPrize;
}

const getTokenCount = ({ aMoves, bMoves }) => (aMoves * 3) + bMoves;

//part 1
console.time('Part 1');

const leastPathTokens = claw_machines.reduce((leastPathTokens, claw_machine) => {
    const pathsToPrize = getPathsToPrize(claw_machine);

    if(pathsToPrize.length === 0){
        return leastPathTokens;
    }

    return [
        ...leastPathTokens,
        pathsToPrize.reduce((pathsMin, path) => Math.min(pathsMin, getTokenCount(path)), Infinity)
    ];

}, []);

const totalLeastPathTokens = leastPathTokens.reduce((sum, tokens) => sum + tokens, 0);

console.log(`Part 1: ${totalLeastPathTokens}`);
console.timeEnd('Part 1');

//part 2
console.time('Part 2');
console.log(`Part 2:`);

console.timeEnd('Part 2');
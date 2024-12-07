const fs = require("fs");
const input = fs.readFileSync("./input.txt").toString();

const equations = input.split('\n').map((line) => {
    const [value, operands] = line.split(':')
    return {
        value: parseInt(value),
        operands: operands.trim().split(' ').map((operand) => parseInt(operand))
    };
});

const equate_p1 = (operands) => {
    if(operands.length === 1){
        return [
            operands[0]
        ];
    }

    return [
        ...equate_p1(operands.slice(1)).map((value) => operands[0] + value),
        ...equate_p1(operands.slice(1)).map((value) => operands[0] * value),
    ];
}

const equate_p2 = (operands) => {
    if(operands.length === 1){
        return [
            operands[0]
        ];
    }

    return [
        ...equate_p2(operands.slice(1)).map((value) => operands[0] + value),
        ...equate_p2(operands.slice(1)).map((value) => operands[0] * value),
        ...equate_p2(operands.slice(1)).map((value) => parseInt(`${value}${operands[0]}`)),
    ];
}

//part 1
const calibrationResult = equations.reduce((sum, equation) => {

    //reverse operands so the equation executes in the correct order with recursion
    const reversedOperands = equation.operands.slice().reverse();
    const possibleValues = equate_p1(reversedOperands);

    if(possibleValues.includes(equation.value)){
        return sum + equation.value;
    }

    return sum;
}, 0)

console.log(`Part 1: ${calibrationResult}`);

//part 2
const calibrationResultWithConcat = equations.reduce((sum, equation) => {

    const reversedOperands = equation.operands.slice().reverse();
    const possibleValues = equate_p2(reversedOperands);

    if(possibleValues.includes(equation.value)){
        return sum + equation.value;
    }

    return sum;
}, 0)

console.log(`Part 2: ${calibrationResultWithConcat}`);
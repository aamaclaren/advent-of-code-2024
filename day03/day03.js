const fs = require("fs");
const input = fs.readFileSync("./input.txt").toString();

//part 1
const instructions_p1 = input.match(/mul\(\d{1,3},\d{1,3}\)/g);

const sum_p1 = instructions_p1.reduce((sum, instruction) => {
    const numbers = instruction.match(/\d{1,3}/g).map((number) => parseInt(number));
    return sum += (numbers[0] * numbers[1])
}, 0);
console.log(`Part 1: ${sum_p1}`);

//part 2
const instructions_p2 = input.match(/(mul\(\d{1,3},\d{1,3}\)|(don\'t)|(do))/g);

let enabled = true;
const sum_p2 = instructions_p2.reduce((sum, instruction) => {
    if(instruction === "don't"){
        enabled = false;
        return sum;
    }

    if(instruction === "do"){
        enabled = true;
        return sum;
    }

    if(!enabled){
        return sum;
    }

    const numbers = instruction.match(/\d{1,3}/g).map((number) => parseInt(number));
    return sum += (numbers[0] * numbers[1])
}, 0)

console.log(`Part 2: ${sum_p2}`);
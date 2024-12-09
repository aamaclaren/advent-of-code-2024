const fs = require("fs");
const input = fs.readFileSync("./input.txt").toString();

const isFreeSpace = (char) => char === '.';
const isFile = (char) => /^[0-9]+$/.test(char)

const getExpandedBlocks = (input) => {
    const expandedBlocks = input.split('').reduce((expansion, char, index) => {
        const value = index % 2 === 0 ? `${index / 2}` : '.';
        const count = parseInt(char);
    
        let segments = [];
        for(let i = 0; i < count; i++){
            segments.push(value);
        }

        return [...expansion, ...segments]
    }, '');

    return expandedBlocks;
}

const getCompactedBlocks = (expandedBlocks) => {
    const copiedExpandedBlocks = [...expandedBlocks];

    let low = 0;
    let high = copiedExpandedBlocks.length - 1;

    while(low < high){
        while(isFile(copiedExpandedBlocks[low])){
            low++;
        }

        while(isFreeSpace(copiedExpandedBlocks[high])){
            high--;
        }

        //if we've incremented/decremented past the mid point, break to avoid swapping
        if(low >= high){
            break;
        }

        //swap positions
        let tmp = copiedExpandedBlocks[low];
        copiedExpandedBlocks[low] = copiedExpandedBlocks[high];
        copiedExpandedBlocks[high] = tmp;
    }

    return copiedExpandedBlocks;
}

//part 1
console.time('Part 1');
const expandedBlocks = getExpandedBlocks(input);
const compactedBlocks = getCompactedBlocks(expandedBlocks);

const compactedSum = compactedBlocks.reduce((sum, value, index) => {
    if(isFile(value)){
        return sum + (index * parseInt(value));
    }

    return sum;
}, 0)

console.log(`Part 1: ${compactedSum}`);
console.timeEnd('Part 1');

//part 2

console.log(`Part 2:`);
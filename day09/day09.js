const fs = require("fs");
const input = fs.readFileSync("./input.txt").toString();

const directions = {
    ASC: 'ASC',
    DSC: 'DSC'
};

const isFreeSpace = (char) => char === '.';
const isFile = (char) => /^[0-9]+$/.test(char);

//get count of identical blocks in a row
const getContinuousBlockValueCount = (blocks, startingIndex, direction) => {
    const iterationVal = direction === directions.ASC ? 1 : -1;
    const startingVal = blocks[startingIndex];
    let count = 1;

    let iterationIndex = startingIndex + iterationVal;
    while(iterationIndex >= 0 && iterationIndex < blocks.length && blocks[iterationIndex] === startingVal){
        count++;
        iterationIndex += iterationVal;
    }

    return count;
}

//returns expanded blocks
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

//returns compressed blocks - right most blocks occupy first available free space on left
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

//returns compacted files - file blocks are shifted left in their entirety as far as they can go
const getCompactedFiles = (expandedBlocks) => {
    const copiedExpandedBlocks = [...expandedBlocks];

    let low = 0;
    let high = copiedExpandedBlocks.length - 1;

    while(low < high){
        while(isFile(copiedExpandedBlocks[low])){
            low++;
        }

        //set high to the highest index of a file block
        while(isFreeSpace(copiedExpandedBlocks[high])){
            high--;
        }

        //search for the first file block that will fit in the available space. Skip over free spaces and files that are too large
        let destinationIndex = low;
        let freeSpaceCount = getContinuousBlockValueCount(copiedExpandedBlocks, destinationIndex, directions.ASC);
        const fileBlockCount = getContinuousBlockValueCount(copiedExpandedBlocks, high, directions.DSC);

        while(destinationIndex < high && freeSpaceCount < fileBlockCount){
            destinationIndex += freeSpaceCount;
            //next block will be a file, skip past it
            while(isFile(copiedExpandedBlocks[destinationIndex])){
                destinationIndex++;
            }
            freeSpaceCount = getContinuousBlockValueCount(copiedExpandedBlocks, destinationIndex, directions.ASC);
        }

        //if we moved past the high point, move high down and reset the loop - this file cannot move
        if(destinationIndex >= high){
            high -= fileBlockCount;
            continue;
        }

        //shift file blocks
        const fileValue = copiedExpandedBlocks[high];
        for(let i = 0; i < fileBlockCount; i++){
            copiedExpandedBlocks[destinationIndex + i] = fileValue;
            copiedExpandedBlocks[high - i] = '.';
        }
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
console.time('Part 2');
const compactedFiles = getCompactedFiles(expandedBlocks);

const compactedFileSum = compactedFiles.reduce((sum, value, index) => {
    if(isFile(value)){
        return sum + (index * parseInt(value));
    }

    return sum;
}, 0)

console.log(`Part 2: ${compactedFileSum}`);
console.timeEnd('Part 2');
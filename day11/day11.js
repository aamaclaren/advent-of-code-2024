const fs = require("fs");
const input = fs.readFileSync("./input.txt").toString();

const stones = input.split(' ').map((stone) => parseInt(stone))

const blink = (stones) => {
    let newStones = [...stones];

    for(let i = 0; i < newStones.length; i++){
        const stone = newStones[i];

        if(isZero(stone)){
            newStones[i] = 1;
            continue;
        }

        if(isEvenDigits(stone)){
            const splitStones = splitStone(stone);
            newStones = [
                ...newStones.slice(0, i),
                ...splitStones,
                ...newStones.slice(i + 1)
            ];
            
            i++;
            continue;
        }

        newStones[i] = multiplyStone(stone);
    }

    return newStones;
};

const get_expanded_stones = (stone, remainingBlinks) => {
    const stoneBlinkMap = {};

    const executeBlinks = (stone, remainingBlinks) => {
        //unique key for storing 
        const stoneBlinkMapKey = `${stone}:${remainingBlinks}`;
        if(stoneBlinkMap[stoneBlinkMapKey]){
            return stoneBlinkMap[stoneBlinkMapKey]
        }

        if(remainingBlinks === 0){
            return 1;
        }

        const newStones = blink([ stone ]);
        const expandedStoneCount = newStones.reduce((sum, newStone) => sum + executeBlinks(newStone, remainingBlinks - 1), 0);

        stoneBlinkMap[stoneBlinkMapKey] = expandedStoneCount;
        return expandedStoneCount;
    }
    
    return executeBlinks(stone, remainingBlinks);
}

const isZero = (stone) => stone === 0;

const isEvenDigits = (stone) => `${stone}`.length % 2 === 0;

const splitStone = (stone) => {
    const splitStone = `${stone}`.split('');
    const firstStone = parseInt(splitStone.slice(0, splitStone.length / 2).join(''));
    const secondStone = parseInt(splitStone.slice(splitStone.length / 2).join(''));
    return [
        firstStone,
        secondStone
    ]
}

const multiplyStone = (stone) => stone * 2024;

//part 1
console.time('Part 1');
const p1_total = stones.reduce((sum, stone) => sum + get_expanded_stones(stone, 25), 0);

console.log(`Part 1: ${p1_total}`);
console.timeEnd('Part 1');

//part 2
console.time('Part 2');
const p2_total = stones.reduce((sum, stone) => sum + get_expanded_stones(stone, 75), 0);

console.log(`Part 1: ${p2_total}`);
console.timeEnd('Part 2');
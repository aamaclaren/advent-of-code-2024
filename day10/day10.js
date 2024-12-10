const fs = require("fs");
const input = fs.readFileSync("./input.txt").toString();

const map = input.split('\n').map((row) => row.split('').map((char) => parseInt(char)));

const getPositionValue = ( map, { y, x } ) => map[y][x];

const getPositionKey = ( { y, x } ) => `${y}:${x}`;

const getPositionFromKey = (key) => {
    const splitKey = key.split(':');
    return {
        y: parseInt(splitKey[0]),
        x: parseInt(splitKey[1])
    };
}

const isTrailHead = (map, position ) => getPositionValue(map, position) === 0;

const isTrailEnd = (map, position ) => getPositionValue(map, position) === 9;

const isInBounds = (map, position) => position.y >= 0 && position.y < map.length && position.x >= 0 && position.x < map[position.y].length;

const getNavigablePositions = (map, position) => {
    const navigablePositions = [];
    const testVelocities = [
        { y: -1, x: 0},
        { y: 1, x: 0},
        { y: 0, x: -1},
        { y: 0, x: 1},
    ]

    testVelocities.forEach((testVelocity) => {
        const testPosition = {
            y: position.y + testVelocity.y,
            x: position.x + testVelocity.x
        }

        if(isInBounds(map, testPosition) === false){
            return;
        }

        if(getPositionValue(map, testPosition) !== getPositionValue(map, position) + 1){
            return;
        }

        navigablePositions.push(testPosition);    
    });

    return navigablePositions;
}

const findPathToTrailEnd = (map, position) => {
    if(isTrailEnd(map, position)){
        return position;
    }

    const navigablePositions = getNavigablePositions(map, position);
    if(navigablePositions.length === 0){
        return undefined;
    }

    return navigablePositions
        .flatMap((navigablePosition) => findPathToTrailEnd(map, navigablePosition))
        .filter((trailEndPosition) => trailEndPosition !== undefined);
}

//part 1
const trailHeads = {};

//search for trail heads and initialize map
for(let y = 0; y < map.length; y++){
    for(let x = 0; x < map[y].length; x++){
        if(isTrailHead(map, { y, x })){
            const trailHeadPositionKey = getPositionKey( { y, x });
            trailHeads[trailHeadPositionKey] = {};
        }
    }
}

//find all trail ends for each trail head
const sumScores = Object.keys(trailHeads).reduce((sum, trailHeadKey) => {
    const trailHeadPosition = getPositionFromKey(trailHeadKey);

    findPathToTrailEnd(map, trailHeadPosition).forEach((trailEndPosition) => {
        const trailEndKey = getPositionKey(trailEndPosition);
        trailHeads[trailHeadKey][trailEndKey] = true;
    });

    return sum + Object.keys(trailHeads[trailHeadKey]).length;
}, 0);

console.log(`Part 1: ${sumScores}`);

//part 2

console.log(`Part 2:`);
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

const findPathsToTrailEnd = (map, position) => {
    const pathsToTrailEnd = [];

    const traversePath = (map, currentPath) => {
        const position = currentPath.at(-1);

        if(isTrailEnd(map, position)){
            pathsToTrailEnd.push(currentPath);
            return;
        }
    
        const navigablePositions = getNavigablePositions(map, position);
    
        navigablePositions.forEach((navigablePosition) => {
            traversePath(map, [...currentPath, navigablePosition]);
        });
    }

    traversePath(map, [ position ]);

    return pathsToTrailEnd;
}

const trailHeads = {};

//search for all trail heads - for each trail head, map the paths to all trail ends
for(let y = 0; y < map.length; y++){
    for(let x = 0; x < map[y].length; x++){
        const position = { y, x };
        if(isTrailHead(map, position)){
            const trailHeadPositionKey = getPositionKey(position);
            trailHeads[trailHeadPositionKey] = findPathsToTrailEnd(map, position);
        }
    }
}

//part 1
console.time('Part 1');
const trailScoreList = Object.values(trailHeads).reduce((scoreList, trailPaths) => {
    trailPaths.forEach((trailPath) => {
        const startPositionKey = getPositionKey(trailPath.at(0));
        const endPositionKey = getPositionKey(trailPath.at(-1));
        
        scoreList[`${startPositionKey}:${endPositionKey}`] = true;
    });

    return scoreList;
}, {});

const sumTrailScore = Object.keys(trailScoreList).length;
console.log(`Part 1: ${sumTrailScore}`);
console.timeEnd('Part 1');


//part 2
console.time('Part 2');
const sumTrailRating = Object.values(trailHeads).reduce((sum, trailPaths) => sum + trailPaths.length, 0)
console.log(`Part 2: ${sumTrailRating}`);
console.timeEnd('Part 2');
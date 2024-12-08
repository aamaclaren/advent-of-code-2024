const fs = require("fs");
const input = fs.readFileSync("./input.txt").toString();

const antennaPattern = /[a-zA-Z0-9]/;
const map = input.split('\r\n').map((row) => row.split(''));

const isPositionInBounds = (map, {x, y}) => y >= 0 && y < map.length && x >= 0 && x < map[y].length;
const getMapValue = (map, {x, y}) => map[y][x];
const getPositionKey = ({x, y}) => `${y}:${x}`;
const getPositionValue = (positionKey) => {
    const values = positionKey.split(':').map((coordinate) => parseInt(coordinate));
    return {
        y: values[0],
        x: values[1]
    }
};

const getPositionDistance = (posA, posB) => ({
    y: posB.y - posA.y,
    x: posB.x - posA.x
});

const getAntinodePositions_pt1 = (map, posA, posB) => {
    const antinodePositions = [];
    const distance = getPositionDistance(posA, posB);

    const antinodeA = {
        y: posA.y - distance.y,
        x: posA.x - distance.x,
    }

    const antinodeB = {
        y: posB.y + distance.y,
        x: posB.x + distance.x,
    }

    if(isPositionInBounds(map, antinodeA)){
        antinodePositions.push(antinodeA)
    }
    
    if(isPositionInBounds(map, antinodeB)){
        antinodePositions.push(antinodeB)
    }

    return antinodePositions;
}

const getAntinodePositions_pt2 = (map, posA, posB) => {
    const antinodePositions = [];
    const distance = getPositionDistance(posA, posB);

    const nextPosA = { ...posA };
    while(isPositionInBounds(map, nextPosA)){
        antinodePositions.push({...nextPosA});
        nextPosA.y -= distance.y;
        nextPosA.x -= distance.x;
    }

    const nextPosB = { ...posB };
    while(isPositionInBounds(map, nextPosB)){
        antinodePositions.push({...nextPosB});
        nextPosB.y += distance.y;
        nextPosB.x += distance.x;
    }

    return antinodePositions;
}

const antennaPositions = {};

//find all antenna positions and group them by frequency
for(let y = 0; y < map.length; y++){
    for(let x = 0; x < map[y].length; x++){
        const value = getMapValue(map, {x, y});
        if(antennaPattern.test(value)){

            if(!antennaPositions[value]){
                antennaPositions[value] = [];
            }

            antennaPositions[value].push(getPositionKey({x, y}));
        }
    }
}


//part 1
const getPart1Antinodes = () => {
    const antinodePositions = {};

    //run through all antenna positions in each frequency to find any antinode positions
    Object.values(antennaPositions).forEach((positions) => {
        for(let i = 0; i < positions.length - 1; i++){
            const a = getPositionValue(positions[i]);
            for(let j = i + 1; j < positions.length; j++){
                const b = getPositionValue(positions[j]);

                const abAntinodePositions = getAntinodePositions_pt1(map, a, b);

                abAntinodePositions.forEach((antinodePosition) => {
                    const antinodePositionKey = getPositionKey(antinodePosition);
                    antinodePositions[`${antinodePositionKey}`] = true;
                });
            }
        }
    });

    return antinodePositions;
}

//part 2
const getPart2Antinodes = () => {
    const antinodePositions = {};

    //run through all antenna positions in each frequency to find any antinode positions
    Object.values(antennaPositions).forEach((positions) => {
        for(let i = 0; i < positions.length - 1; i++){
            const a = getPositionValue(positions[i]);
            for(let j = i + 1; j < positions.length; j++){
                const b = getPositionValue(positions[j]);

                const abAntinodePositions = getAntinodePositions_pt2(map, a, b);

                abAntinodePositions.forEach((antinodePosition) => {
                    const antinodePositionKey = getPositionKey(antinodePosition);
                    antinodePositions[`${antinodePositionKey}`] = true;
                });
            }
        }
    });

    return antinodePositions;
}

console.log(`Part 1: ${Object.keys(getPart1Antinodes()).length}`);
console.log(`Part 2: ${Object.keys(getPart2Antinodes()).length}`);
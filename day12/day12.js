const fs = require("fs");
const input = fs.readFileSync("./input.txt").toString();

const gardenMap = input.split('\n').map((row) => row.split(''));

const getPlantType = (map, { y, x }) => map[y][x];

const isInBounds = (map, { y, x }) => y >= 0 && y < map.length && x >= 0 && x < map[y].length;

const isPlantType = (map, position, expectedPlantType) => isInBounds(map, position) && getPlantType(map, position) === expectedPlantType;

const getCornerCount = (map, position) => {
    const plotPlantType = getPlantType(map, position);
    let count = 0;

    //INSIDE CORNERS

    //top left corner
    if(
        isPlantType(map, getTopPosition(position), plotPlantType) && 
        isPlantType(map, getLeftPosition(position), plotPlantType) &&
        !isPlantType(map, getTopLeftPosition(position), plotPlantType)
    ){
        count++;
    }

    //top right corner
    if(
        isPlantType(map, getTopPosition(position), plotPlantType) && 
        isPlantType(map, getRightPosition(position), plotPlantType) &&
        !isPlantType(map, getTopRightPosition(position), plotPlantType)
    ){
        count++;
    }

    //bottom left corner
    if(
        isPlantType(map, getBottomPosition(position), plotPlantType) && 
        isPlantType(map, getLeftPosition(position), plotPlantType) &&
        !isPlantType(map, getBottomLeftPosition(position), plotPlantType)
    ){
        count++;
    }

    //bottom right corner
    if(
        isPlantType(map, getBottomPosition(position), plotPlantType) && 
        isPlantType(map, getRightPosition(position), plotPlantType) &&
        !isPlantType(map, getBottomRightPosition(position), plotPlantType)
    ){
        count++;
    }

    //OUTSIDE CORNERS

    //top left
    if(
        !isPlantType(map, getTopPosition(position), plotPlantType) && 
        !isPlantType(map, getLeftPosition(position), plotPlantType)
    ){
        count++;
    }

    //top right
    if(
        !isPlantType(map, getTopPosition(position), plotPlantType) && 
        !isPlantType(map, getRightPosition(position), plotPlantType)
    ){
        count++;
    }

    //bottom left
    if(
        !isPlantType(map, getBottomPosition(position), plotPlantType) && 
        !isPlantType(map, getLeftPosition(position), plotPlantType)
    ){
        count++;
    }

    //bottom right
    if(
        !isPlantType(map, getBottomPosition(position), plotPlantType) && 
        !isPlantType(map, getRightPosition(position), plotPlantType)
    ){
        count++;
    }

    return count;
}

const getPositionKey = ({ y, x }) => `${y}:${x}`;

const getTopLeftPosition = ({ y, x }) => ({ y: y - 1, x: x - 1});

const getTopRightPosition = ({ y, x }) => ({ y: y - 1, x: x + 1});

const getBottomLeftPosition = ({ y, x }) => ({ y: y + 1, x: x - 1});

const getBottomRightPosition = ({ y, x }) => ({ y: y + 1, x: x + 1});

const getTopPosition = ({ y, x }) => ({ y: y - 1, x});

const getBottomPosition = ({ y, x }) => ({ y: y + 1, x});

const getLeftPosition = ({ y, x }) => ({ y, x: x - 1});

const getRightPosition = ({ y, x }) => ({ y, x: x + 1});

const getAdjacentPositions = (map, position) => ([
    getTopPosition(position),
    getBottomPosition(position),
    getLeftPosition(position),
    getRightPosition(position),
].filter((adjacentPosition) => isInBounds(map, adjacentPosition)));

const getPlotPositions = (map, startingPosition) => {
    const plotPlantType = getPlantType(map, startingPosition);
    const visited = {};
    const plotPositions = [];

    const traversePlot = (map, position) => {
        const positionKey = getPositionKey(position);

        if(visited[positionKey]){
            return;
        }

        visited[positionKey] = true;

        if(getPlantType(map, position) !== plotPlantType){
            return;
        }

        plotPositions.push(position);

        getAdjacentPositions(map, position).forEach((adjacentPosition) => {
            traversePlot(map, adjacentPosition);
        });
    }

    traversePlot(map, startingPosition);

    return plotPositions;
}

const getPlotPositionWallCount = (map, position) => {
    const plotPlantType = getPlantType(map, position);

    const adjacentPositions = getAdjacentPositions(map, position);

    //
    const exteriorWallCount = 4 - adjacentPositions.length;
    const interiorWallCount = adjacentPositions.reduce((sum, adjacentPosition) => {
        if(getPlantType(map, adjacentPosition) !== plotPlantType){
            return sum + 1;
        }

        return sum;
    }, 0);

    return exteriorWallCount + interiorWallCount;
}

//Find the plots
console.time('Find Plots');
const visited = {};
const plots = []
gardenMap.forEach((row, y) => {
    row.forEach((item, x) => {
        const position = { y, x };
        const positionKey = getPositionKey(position);

        if(visited[positionKey]){
            return;
        }

        const plot = getPlotPositions(gardenMap, position);

        plots.push(plot);

        plot.forEach((position) => {
            visited[getPositionKey(position)] = true;
        });
    });
});
console.timeEnd('Find Plots');

//part 1
console.time('Part 1');
const plotRatingData = plots.map((plot) => ({
    area: plot.length,
    fencePieces: plot.reduce((sum, position) => sum + getPlotPositionWallCount(gardenMap, position), 0)
}));

const totalPrice = plotRatingData.reduce((sum, plotRatingDatum) => sum + (plotRatingDatum.area * plotRatingDatum.fencePieces), 0);

console.log(`Part 1: ${totalPrice}`);
console.timeEnd('Part 1');

//part 2
console.time('Part 2');
const plotBulkRatingData = plots.map((plot) => ({
    plantType: getPlantType(gardenMap, plot[0]),
    area: plot.length,
    fenceEdges: plot.reduce((sum, position) => sum + getCornerCount(gardenMap, position), 0)
}));

const totalBulkPrice = plotBulkRatingData.reduce((sum, plotRatingDatum) => sum + (plotRatingDatum.area * plotRatingDatum.fenceEdges), 0);

console.log(`Part 2: ${totalBulkPrice}`);
console.timeEnd('Part 2');
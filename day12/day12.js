const fs = require("fs");
const input = fs.readFileSync("./input.txt").toString();

const gardenMap = input.split('\n').map((row) => row.split(''));

const getPlantType = (map, { y, x }) => map[y][x];

const isInBounds = (map, { y, x }) => y >= 0 && y < map.length && x >= 0 && x < map[y].length;

const getPositionKey = ({ y, x }) => `${y}:${x}`;

const getAdjacentPositions = (map, { y, x }) => ([
    { y: y + 1, x },
    { y: y - 1, x },
    { y, x: x + 1 },
    { y, x: x - 1 },
].filter((position) => isInBounds(map, position)));

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

//part 1
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

const plotRatingData = plots.map((plot) => ({
    area: plot.length,
    fencePieces: plot.reduce((sum, position) => sum + getPlotPositionWallCount(gardenMap, position), 0)
}));

const totalPrice = plotRatingData.reduce((sum, plotRatingDatum) => sum + (plotRatingDatum.area * plotRatingDatum.fencePieces), 0);

console.log(`Part 1: ${totalPrice}`);

//part 2

console.log(`Part 2:`);
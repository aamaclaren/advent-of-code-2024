const fs = require("fs");
const input = fs.readFileSync("./input.txt").toString();

const map = input.split('\n').map((row) => row.split(''));

const STATUSES = {
    PATROLLING: 'PATROLLING',
    COMPLETE: 'COMPLETE'   
};

const getGuardState = (map) => {
    for(let y = 0; y < map.length; y++){
        for(let x = 0; x < map[y].length; x++){
            const value = map[y][x];

            if(value === '<'){
                return {
                    position: {
                        x,
                        y,
                    },
                    velocity: {
                        x: -1,
                        y: 0
                    }
                }
            }
            
            if(value === '^'){
                return {
                    position: {
                        x,
                        y,
                    },
                    velocity: {
                        x: 0,
                        y: -1
                    }
                }
            }

            if(value === '>'){
                return {
                    position: {
                        x,
                        y,
                    },
                    velocity: {
                        x: 1,
                        y: 0
                    }
                }
            }

            if(value === 'V'){
                return {
                    position: {
                        x,
                        y,
                    },
                    velocity: {
                        x: 0,
                        y: 1
                    }
                }
            }
        }
    }
}

const getRotatedVelocity = (velocity) => {
    //left
    if(velocity.x === -1){
        return {
            x: 0,
            y: -1
        }
    }

    //up
    if(velocity.y === -1){
        return {
            x: 1,
            y: 0
        }
    }

    //right
    if(velocity.x === 1){
        return {
            x: 0,
            y: 1
        }
    }

    //gotta be down
    return {
        x: -1,
        y: 0
    }
}

const isPositionBlocked = (map, position) => map[position.y][position.x] === '#';

const isOutOfBounds = (map, position) => position.y < 0 || position.y >= map.length || position.x < 0 || position.x >= map[position.y].length;

const getPositionKey = (position) => `${position.y}:${position.x}`;

const getGuardStateKey = (guardState) => `${guardState.position.y}:${guardState.position.x}::${guardState.velocity.y}:${guardState.velocity.x}`;

const getNextGuardState = (map, {position, velocity}) => {
    const nextPosition = {
        x: position.x + velocity.x,
        y: position.y + velocity.y
    };

    //did guard leave the map? If so, return complete
    if(isOutOfBounds(map, nextPosition)){
        return {
            status: STATUSES.COMPLETE,
            position,
            velocity
        }
    }

    //is next position blocked? If so, rotate
    if(isPositionBlocked(map, nextPosition)){
        const rotatedVelocity = getRotatedVelocity(velocity);
        return {
            status: STATUSES.PATROLLING,
            position,
            velocity: rotatedVelocity
        }
    }

    //move forward otherwise
    return {
        status: STATUSES.PATROLLING,
        position: {
            x: position.x + velocity.x,
            y: position.y + velocity.y
        },
        velocity
    };
}

const isGuardInLoop = (map, guardState) => {
    const visitedPath = {};

    while(guardState.status !== STATUSES.COMPLETE){
        const guardStateKey = getGuardStateKey(guardState);
        
        //if guard has visited this position with the same velocity, it's a loop
        if(visitedPath[guardStateKey]){
            return true;
        }

        visitedPath[guardStateKey] = true;

        const nextGuardState = getNextGuardState(map, guardState);

        guardState.status = nextGuardState.status;
        guardState.position = nextGuardState.position;
        guardState.velocity = nextGuardState.velocity;
    }
    
    //he escaped - no loop
    return false;
}

//part 1
const execute = () => {
    const { position: startingPosition, velocity: startingVelocity } = getGuardState(map);
    const guardPath = {};
    const loopPositions = {};
    
    const guardState = {
        status: STATUSES.PATROLLING,
        position: startingPosition,
        velocity: startingVelocity
    };
    
    while(guardState.status !== STATUSES.COMPLETE){
        const nextGuardState = getNextGuardState(map, guardState);
        
        const currentPositionKey = getPositionKey(guardState.position);
        const nextPositionKey = getPositionKey(nextGuardState.position);
        
        const isKnownLoopPosition = loopPositions[nextPositionKey] === true;
        const isStartingPosition = nextGuardState.position.x === startingPosition.x && nextGuardState.position.y === startingPosition.y;
        const isObstacle = map[nextGuardState.position.y][nextGuardState.position.x] === '#';
        const willMoveForward = guardState.position.x !== nextGuardState.position.x || guardState.position.y !== nextGuardState.position.y;
        const canPlaceObstacle = isStartingPosition === false && isObstacle === false && willMoveForward === true;

        if(!isKnownLoopPosition && canPlaceObstacle){
            //copy map to edit and add an obstacle
            const testMap = map.map(row => [...row]);
            testMap[nextGuardState.position.y][nextGuardState.position.x] = '#';

            //copy current guardState
            const testGuardState = {
                status: guardState.status,
                position: {
                    x: guardState.position.x,
                    y: guardState.position.y
                },
                velocity: {
                    x: guardState.velocity.x,
                    y: guardState.velocity.y
                }
            };
            
            if(isGuardInLoop(testMap, testGuardState)){
                loopPositions[nextPositionKey] = true;
            }
        }
        
        //mark the position in the guards path
        guardPath[currentPositionKey] = true;

        guardState.status = nextGuardState.status;
        guardState.position = nextGuardState.position;
        guardState.velocity = nextGuardState.velocity;
    }

    return {
        part1: Object.keys(guardPath).length,
        part2: Object.keys(loopPositions).length
    };
}

console.time('timer');
const { part1, part2 } = execute();
console.log(`Part 1: ${part1}`);
console.log(`Part 2: ${part2}`);
console.timeEnd('timer');

//part 2
const getLoopCount = () => {
    const { position, velocity } = getGuardState(map);
    
    const guardState = {
        status: STATUSES.PATROLLING,
        position,
        velocity
    };

    const loopPositions = {};
    while(guardState.status !== STATUSES.COMPLETE){
        //get the next position where the guard would move to
        const nextGuardState = getNextGuardState(map, guardState);

        //if already known to be a loop position, continue on
        if(loopPositions[`${nextGuardState.position.y}:${nextGuardState.position.x}`]){
            guardState.status = nextGuardState.status;
            guardState.position = nextGuardState.position;
            guardState.velocity = nextGuardState.velocity;
            continue;
        }

        //copy map to edit and add an obstacle
        const testMap = map.map(row => [...row]);
        testMap[nextGuardState.position.y][nextGuardState.position.x] = '#'

        //copy current guardState
        const testGuardState = {
            status: guardState.status,
            position: {
                x: guardState.position.x,
                y: guardState.position.y
            },
            velocity: {
                x: guardState.velocity.x,
                y: guardState.velocity.y
            }
        }

        if(isGuardInLoop(testMap, testGuardState)){
            loopPositions[`${nextGuardState.position.y}:${nextGuardState.position.x}`] = true
        }
    
        guardState.status = nextGuardState.status;
        guardState.position = nextGuardState.position;
        guardState.velocity = nextGuardState.velocity;
    }

    return Object.keys(loopPositions).length
}

// console.time('part2');
// console.log(`Part 2: ${getLoopCount()}`);
// console.timeEnd('part2');
const fs = require("fs");
const input = fs.readFileSync("./input.txt").toString();

const [orderingRulesInput, updatesInput] = input.split('\n\n');

const orderingRules = orderingRulesInput.split('\n').reduce((map, rule) => {
    const [a, b] = rule.split('|');
    
    if(!map[a]){
        map[a] = {
            before: [],
            after: []
        }
    }

    if(!map[b]){
        map[b] = {
            before: [],
            after: []
        }
    }

    map[a].before.push(b);
    map[b].after.push(a);

    return map;
}, {});

const updates = updatesInput.split('\n').map((rule) => rule.split(','));

//part 1
const correctlyOrderedUpdatesValue = updates.reduce((sum, update) => {
    for(let i = 0; i < update.length; i++){
        const a = update[i];
        for(let j = 0; j < update.length; j++){
            if(i === j){
                continue;
            }

            const b = update[j];

            //how a relate to b in the update order?
            const orientation = i > j ? 'after' : 'before';

            //check if b rules violate the orientation - this is the inverse check of the a b orientation above
            if(orderingRules[b][orientation].includes(a)){
                //rule violeted - return
                return sum;
            }
        }
    }

    //update is in the correct order - add middle value to sum
    const middleIndex = parseInt(update.length / 2);
    const middleValue = parseInt(update[middleIndex]);
    return sum + middleValue;
}, 0)

console.log(`Part 1: ${correctlyOrderedUpdatesValue}`);

//part 2
const incorrectlyOrderedUpdatesValue = updates.reduce((sum, update) => {
    for(let i = 0; i < update.length; i++){
        const a = update[i];
        for(let j = 0; j < update.length; j++){
            if(i === j){
                continue;
            }

            const b = update[j];

            //how a relate to b in the update order?
            const orientation = i > j ? 'after' : 'before';

            //check if b rules violate the orientation - this is the inverse check of the a b orientation above
            if(orderingRules[b][orientation].includes(a)){
                //sort the update based on the defined ordering rules
                const sortedUpdate = update.toSorted((a, b) => orderingRules[a].after.includes(b) ? -1 : 1);

                //add the middle value of the new sorted update to the sum
                const middleIndex = parseInt(sortedUpdate.length / 2);
                const middleValue = parseInt(sortedUpdate[middleIndex]);
                return sum + middleValue;
            }
        }
    }

    //already in order, return
    return sum;
}, 0)

console.log(`Part 2: ${incorrectlyOrderedUpdatesValue}`);
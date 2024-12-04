const fs = require("fs");
const input = fs.readFileSync("./input.txt").toString();

const list1 = input.split(/\s+/).filter((s, idx) => idx % 2 === 0).map((s) => parseInt(s));
const list2 = input.split(/\s+/).filter((s, idx) => idx % 2 === 1).map((s) => parseInt(s));

//part 1
const sortedList1 = list1.sort((a, b) => a - b);
const sortedList2 = list2.sort((a, b) => a - b);

const diffs = [];
for(let i = 0; i < sortedList1.length; i++){
    diffs.push(Math.abs(sortedList1[i] - sortedList2[i]));
}

const sum = diffs.reduce((sum, item) => sum + item, 0)

console.log(`Part 1: ${sum}`);

//part 2
const similarityScores = [];
for(let i = 0; i < list1.length; i++){
    const list1Item = list1[i];
    const count = list2.filter((list2Item) => list1Item === list2Item).length
    similarityScores.push(list1Item * count);
}

const similarityScoresSum = similarityScores.reduce((sum, item) => sum + item, 0)

console.log(`Part 2: ${similarityScoresSum}`);
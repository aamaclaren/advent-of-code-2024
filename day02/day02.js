const fs = require("fs");
const input = fs.readFileSync("./input.txt").toString();

const reports = input
    .split('\n')
    .map((row) => row.split(/\s+/).map((item) => parseInt(item)))

const isBadLevel = (isAscOrder, a, b) => isBadDiff(a, b) || isBadOrder(isAscOrder, a, b);

const isBadDiff = (a, b) => {
    const diff = Math.abs(Math.abs(a) - Math.abs(b));
    
    if(diff < 1 || diff > 3){
        return true;
    }

    return false;
}

const isBadOrder = (isAscOrder, a, b) => {
    if(isAscOrder && a > b){
        return true;
    }

    if(!isAscOrder && b > a){
        return true
    }

    return false;
}

const isReportSafe = (report) => {
    const isAscOrder = report[0] < report[1];

    for(let i = 0; i < report.length - 1; i++){
        const a = report[i];
        const b = report[i + 1];

        if(isBadLevel(isAscOrder, a, b)){
            return false;
        }
    }

    return true;
}

//part 1

const safeReports = reports.reduce((count, report) => {
    if(isReportSafe(report)){
        return count + 1;
    }

    return count;
}, 0);

console.log(`Part 1: ${safeReports}`);

//part 2

const dampenedSafeReports = reports.reduce((count, report) => {
    //lazily remove each item in the list to see if we find a safe report
    const results = report.map((item, i) => isReportSafe([
        ...report.slice(0, i),
        ...report.slice(i + 1),
    ]));

    //if any results return true, the report is safe
    if(results.some((item) => item)){
        return count + 1;
    }

    return count;
}, 0);

console.log(`Part 2: ${dampenedSafeReports}`);
const fs = require("fs");
const input = fs.readFileSync("./input.txt").toString();

const wordSearch = input.split('\n').map((line) => line.split(''))

const isMatch = ({ wordSearch, pattern, patternIndex = 0, x, y, xOffset, yOffset } ) => {
    if(y < 0 || y >= wordSearch.length){
        return false;
    }

    if(x < 0 || x >= wordSearch[y].length){
        return false
    }

    if(wordSearch[y][x] !== pattern[patternIndex]){
        return false;
    }

    if(patternIndex === pattern.length - 1){
        return true;
    }

    return isMatch({ 
        wordSearch,
        pattern,
        patternIndex: patternIndex + 1,
        x: x + xOffset,
        y: y + yOffset,
        xOffset,
        yOffset
    });
}

//part 1
const xmasPattern = ['X', 'M', 'A', 'S'];
let xmasMatches = 0;

//rows
for(let y = 0; y < wordSearch.length; y++){
    //letters
    for(let x = 0; x < wordSearch[y].length; x++){
        //check each direction for match
        for(let xOffset = -1; xOffset <= 1; xOffset++){
            for(let yOffset = -1; yOffset <= 1; yOffset++){
                if(isMatch({ wordSearch, pattern: xmasPattern, x, y, xOffset, yOffset })){
                    xmasMatches++;
                }
            }
        }
    }
}

console.log(`Part 1: ${xmasMatches}`);

//part 2
const masPattern = ['M', 'A', 'S'];
let masMatches = 0;

//rows
for(let y = 0; y < wordSearch.length; y++){
    //letters
    for(let x = 0; x < wordSearch[y].length; x++){
        //check each direction for match

        for(let xOffset = -1; xOffset <= 1; xOffset += 2){
            for(let yOffset = -1; yOffset <= 1; yOffset += 2){
                if(isMatch({ wordSearch, pattern: masPattern, x, y, xOffset, yOffset })){
                    
                    if(isMatch({
                        wordSearch,
                        pattern: masPattern,
                        x: x + (xOffset * (masPattern.length - 1)),
                        y,
                        xOffset: xOffset * -1,
                        yOffset
                    })){
                        masMatches++;
                    }

                    if(isMatch({
                        wordSearch,
                        pattern: masPattern,
                        x,
                        y: y + (yOffset * (masPattern.length - 1)),
                        xOffset,
                        yOffset: yOffset * -1
                    })){
                        masMatches++;
                    }
                }
            }
        }
    }
}

//matches will be counted twice - one for each 'mas'. Need to divide by 2 to get correct number of pairs
console.log(`Part 2: ${masMatches / 2}`);
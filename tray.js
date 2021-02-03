const readline = require('readline');
let cols, rows, turn, matches;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const initTray = (paramCols, paramRows) => {

    cols = paramCols;
    rows = paramRows;
    turn = 0;
    matches = [
        '   |   ',
        '  |||  ',
        ' ||||| ',
        '|||||||',
    ];

    drawTray();
    nextTurn();
}

const drawTray = () => {

    for(let i = 0; i < rows; i++) {

        let currentRow = '';

        for(let j = 0; j < cols; j++) {

            if(isRow(i) || isColumn(j))
                currentRow += '*';
            else {

                const match = matches[i - 1];
                currentRow += match.charAt(j - 1);
            }
        }

        console.log(currentRow);
    }

    console.log(' ');
    console.log(`${isAITurn() ? 'AI' : 'Your'} turn:`);
}

const nextTurn = async() => {

    const matchesLeft = [...matches].map((line) => (line.match(/\|/g) || []).length).reduce((a, b) => a + b);

    if(matchesLeft === 1) {

        console.log(`${isAITurn() ? 'AI' : 'You'} lose the game!`);
        return;
    }

    let line = await getInput('Line');

    while(!matches[line - 1].includes('|'))
        line = await getInput('Line');

    let match = await getInput('Matches', line);

    while(!matches[line - 1].includes('|'.repeat(match)))
        match = await getInput('Matches', line);

    console.log(`${isAITurn() ? 'AI' : 'You'} removed ${match} match(es) from line ${line}`);

    for(let i = 0; i < match; i++)
        matches[line - 1] = matches[line - 1].replace(/\|([^|]*)$/, '$1 ');

    turn++;

    drawTray();
    await nextTurn();
}

// Add the line for the ai to find a random number
// of matches in the line
const getInput = (input, aiLine) => {

    return new Promise((resolve) => {

        if(isAITurn()) {

            // Wait 1s
            setTimeout(() => {

                // Find a number of matches
                if(aiLine) {

                    const line = matches[aiLine - 1];
                    let match = Math.floor(Math.random() * 2) + 1;

                    while(!line.includes('|'.repeat(match)))
                        match = Math.floor(Math.random() * 2) + 1;

                    resolve(match);

                } else {
                    // Find a line

                    let line = Math.floor(Math.random() * 4);

                    while(!matches[line - 1])
                        line = Math.floor(Math.random() * 4);

                    resolve(line);
                }

                resolve(1);

            }, 1000);

        } else {

            rl.question(`  ${input}: `, (answer) => {

                const line = parseInt(answer);
                resolve(line);
            });
        }
    });
}

const isAITurn = () => turn % 2 !== 0;

const isRow = (x) => [0, rows - 1].includes(x);
const isColumn = (y) => [0, cols - 1].includes(y);

module.exports = initTray;

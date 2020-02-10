
const readline = require('readline');

// process.stdout.write(JSON.stringify({ message: 'hey there' }));

let read = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
read.on('line', (line) => {
    console.log(JSON.stringify({ message: 'got line' }));
});

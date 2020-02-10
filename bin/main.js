#!/usr/bin/env node

// Main binary file for rallf-ce-broker
const runnerMain = require('../main');
const program = require('commander');

program
    .name('pipe')
    .usage('pipe [cmd...]')
    .option('-d, --debug', 'output extra debugging')
    .action(runnerMain.bind(this, process.env))
    .parse(process.argv);


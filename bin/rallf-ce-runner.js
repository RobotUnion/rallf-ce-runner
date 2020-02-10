#!/usr/bin/env node

// Main binary file for rallf-ce-broker
const runnerMain = require('../main');

require('yargs') 
    .command(
        'pipe <cmd> [args..]', 'pipe',
        (yargs) => yargs.positional('cmd', {
            describe: 'command to run',
            required: true,
        }),
        (argv) => runnerMain(process.env, {
            cmd: argv.cmd,
            args: process.argv.slice(4),
        })
    )
    .argv;


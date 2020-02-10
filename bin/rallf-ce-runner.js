#!/usr/bin/env node

// Main binary file for rallf-ce-broker
const runnerMain = require('../main');

require('yargs')
    .command(
        'pipe', 'pipe',
        (yargs) => {
            yargs.options({
                qin: {
                    describe: 'In queue',
                },
                qout: {
                    describe: 'Out queue',
                },
                qerror: {
                    describe: 'Error queue',
                },
                name: {
                    describe: 'name for generating queues, format: {name}:in|out|error',
                },
                cmd: {
                    describe: 'command tu be runned',
                }
            });

            yargs.check(argv => {
                if (!argv.name && [!argv.in | !argv.out | !argv.error]) {
                    throw 'If option --name is not passed [--in, --out, --error] must be passed in';
                }
                return true;
            });
        },
        (argv) => runnerMain(process.env, argv)
    )
    .argv;


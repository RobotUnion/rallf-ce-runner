#!/usr/bin/env node

// Main binary file for rallf-ce-broker
const stdToRabbit = require('../main');
const yargs = require('yargs');

yargs
    .command(
        'pipe',
        'Pipe output and receive input from RabbitMQ',
        (yargs) => {
            yargs
                .option('debug')
                .options({
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
        (argv) => stdToRabbit(argv),
    ).argv;

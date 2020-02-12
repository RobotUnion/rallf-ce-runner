const loggin = require('loggin-js');
const { spawn } = require('child_process');
const { connect, isRpc, createChannel, generateQueueNames, setConsumer, sendMessage } = require('./lib/api');

/**
 * 
 * @param {object} env 
 * @param {object} opts 
 * @param {boolean} opts.debug 
 * @param {boolean} opts.cmd 
 * @param {boolean} opts.name 
 * @param {boolean} opts.in 
 * @param {boolean} opts.out 
 * @param {boolean} opts.error 
 */
function stdToRabbitMQ(env, opts = {}) {
    const logger = loggin.logger('console', {
        channel: 'runner-main',
        color: true,
        formatter: 'detailed',
        level: (opts.debug) ? loggin.severity('DEBUG') : loggin.severity('INFO'),
        user: null,
    });
    logger.debug('Launched rallf-ce-runner', opts);

    const { cmd, qin, qout, qerror, name } = opts;
    const args = cmd.split(' ');
    const command = args.shift();

    let qname = {
        in: qin,
        out: qout,
        error: qerror,
    };

    // If name is passed we generate queue names in format:
    // - {name}:in
    // - {name}:out
    // - {name}:error
    if (name) {
        qname = generateQueueNames(name);
    }

    // Connect to rabbit 
    connect(env.RABBIT_URL || `amqp://0.0.0.0:5672`)
        // generate channels
        .then(
            conn => Promise.all([
                createChannel(conn, qname.in),
                createChannel(conn, qname.out),
                createChannel(conn, qname.error),
            ])
        )
        // run command and pipe to and from queues
        .then(([queue_in, queue_out, queue_error]) => {
            logger.debug('Spawing command: ', [command, ...args]);

            // spawns child command
            const commandProcess = spawn(command, args, { shell: true });

            logger.debug('Spawned command: ', [command, ...args]);


            logger.debug('Map: ');
            logger.debug(qname.in + ' -> stdin');
            logger.debug('stderr -> ' + qname.error);
            logger.debug('stdout -> ' + qname.out);

            logger.info('Waiting...');

            // We setup a consumer (this reads messages from a sepecified queue)
            setConsumer(queue_in, qname.in, async (msg) => {
                logger.info(`${qname.in} received message: ${msg.content.toString()}`);

                // Check if it's a valid RPC object
                isRpc(msg.content.toString(), (err, obj) => {
                    // Send error to "error" queue
                    if (err) {
                        queue_in.nack(msg);
                        return sendMessage(queue_error, qname.error, JSON.stringify({ message: err.message }));
                    }

                    queue_in.ack(msg);

                    // Send the message to subprocess stdin
                    commandProcess.stdin.write(msg.content.toString());
                });
            });

            // handle stdout messages
            commandProcess.stdout.on('data', async (data) => {
                logger.info(`${command} (stdout): ${data}`);

                // Try parsing RPC message
                isRpc(data.toString(), (err, obj) => {
                    // TODO: what to do if error, ignore the message or send it to "error" queue?
                    if (err) { return; }

                    // It it's a valid RPC message, we send it to the output queue
                    sendMessage(queue_out, qname.out, data.toString());
                });
            });

            // handle stdout messages
            commandProcess.stderr.on('data', async (data) => {
                logger.error(`${command} (stderr): ${data}`);
                isRpc(data.toString(), (err, obj) => {
                    // ignore non rpc messages
                    if (err) { return; }

                    sendMessage(queue_error, qname.error, data.toString());
                });
            });

            commandProcess.on('error',
                (err) => logger.error('Failed to start subprocess.', err)
            );
            commandProcess.on('exit',
                (code) => process.exit(code)
            );
        });

}

module.exports = stdToRabbitMQ;
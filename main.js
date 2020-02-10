const loggin = require('loggin-js');
const { spawn } = require('child_process');
const { connect, createChannel, generateQueueNames, setConsumer, sendMessage } = require('./lib/rabbit');

async function runnerMain(env, opts = {}) {
    const logger = loggin.clone({
        channel: 'runner-main',
        color: true,
        formatter: 'detailed',
        level: (env.DEBUG || opts.debug) ? loggin.severity('DEBUG') : loggin.severity('INFO')
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

    if (name) {
        qname = generateQueueNames(name);
    }

    const conn = await connect(env.RABBIT_URL || `amqp://0.0.0.0:5672`);

    const queue_in = await createChannel(conn, qname.in);
    const queue_out = await createChannel(conn, qname.out);
    const queue_error = await createChannel(conn, qname.error);

    const commandProcess = spawn(command, args, { shell: true });

    setConsumer(queue_in, qname.in, async (msg) => {
        logger.debug(`${qname.in} received message: ${msg.content.toString()}`);
        queue_in.ack(msg);
    });

    commandProcess.on('error', (err) =>
        logger.error('Failed to start subprocess.', err)
    );
    commandProcess.stdout.on('data', async (data) => {
        logger.debug(`${command} (stdout): ${data}`)
        await sendMessage(queue_out, qname.out, JSON.stringify(data.toString()))
    });
    commandProcess.stderr.on('data', async (data) => {
        logger.error(`${command} (stderr): ${data}`)
        await sendMessage(queue_error, qname.error, JSON.stringify(data.toString()))
    });
    // commandProcess.stdin.on('data', (data) =>
    //     logger.debug(`${command} (stdin): ${data}`)
    // );
    commandProcess.on('exit', (code) =>
        process.exit(code)
    );
}

module.exports = runnerMain;
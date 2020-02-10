const loggin = require('loggin-js');
const { spawn } = require('child_process');

async function runnerMain(env, opts = {}) {
    const logger = loggin.clone({
        channel: 'runner-main',
        color: true,
        formatter: 'detailed',
        level: (env.DEBUG || opts.debug) ? loggin.severity('DEBUG') : loggin.severity('INFO')
    });
    logger.debug('Launched rallf-ce-runner', opts);

    const { args } = opts;
    const cmd = args.shift();

    const commandProcess = spawn(cmd, args, { shell: true });

    commandProcess.on('error', (err) =>
        logger.error('Failed to start subprocess.', err)
    );
    commandProcess.stdout.on('data', (data) =>
        logger.debug(`${cmd} (stdout): ${data}`)
    );
    commandProcess.stderr.on('data', (data) =>
        logger.error(`${cmd} (stderr): ${data}`)
    );
    commandProcess.stdin.on('data', (data) =>
        logger.debug(`${cmd} (stdin): ${data}`)
    );
    commandProcess.on('exit', (code) =>
        process.exit(code)
    );
}

module.exports = runnerMain;
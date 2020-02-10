const loggin = require('loggin-js');
const { spawn } = require('child_process');

async function runnerMain(env, opts = {}) {
    const logger = loggin.clone({
        channel: 'runner-main',
        color: true,
        level: (env.DEBUG || opts.debug) ? loggin.severity('DEBUG') : loggin.severity('INFO')
    });

    logger.info('they there', opts.args);
    let [pipe, cmd, ...rest] = opts.args;

    const commandProcess = spawn(cmd, rest, { shell: true });

    commandProcess.on('error', (err) => {
        console.error('Failed to start subprocess.', err);
    });

    commandProcess.stdout.on('data', (data) => {
        console.error(`stdout: ${data}`);
    });

    commandProcess.stdin.write(JSON.stringify({ message: 'heykasdjasd' }) + '\n');

    commandProcess.on('exit', (code) => {
        process.exit(code);
    });
}

module.exports = runnerMain;
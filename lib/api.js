const amqp = require('amqplib');
const jayson = require('jayson');

function generateQueueNames(name) {
    return {
        in: `${name}:in`,
        out: `${name}:out`,
        error: `${name}:error`,
        base: name
    };
}

function connect(url) {
    return amqp.connect(url);
}

function createChannel(conn, q) {
    return conn.createChannel()
        .then(async ch => {
            if (q) {
                await setQueue(ch, q);
            }

            return ch;
        });
}

function setConsumer(ch, q, cb) {
    return ch.consume(q, cb);
}

function setQueue(ch, queue) {
    return ch.assertQueue(queue);
}

function createConsumer(conn, q) {
    return createChannel(conn, q)
}

async function createPublisher(conn, q) {
    return createChannel(conn, q);
}

function sendMessage(ch, q, buffer) {
    buffer = Buffer.isBuffer(buffer)
        ? buffer
        : Buffer.from(buffer);

    return ch.sendToQueue(q, buffer);
}

function getPubCons(conn, q) {
    return Promise.all([
        createPublisher(conn, q),
        createConsumer(conn, q),
    ]);
}

// Checks whether a string is a valid RPC message
function isRpc(string, cb, opts = {}) {
    jayson.Utils.JSON.parse(string, opts, cb);
}

module.exports = {
    connect, 
    createChannel, 
    isRpc, 
    generateQueueNames, 
    setConsumer, 
    sendMessage,
};
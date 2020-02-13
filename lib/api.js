const amqp = require("amqplib");
const jayson = require("jayson");

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
  return conn.createChannel().then(async ch => {
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
  return createChannel(conn, q);
}

async function createPublisher(conn, q) {
  return createChannel(conn, q);
}

function sendMessage(ch, q, buffer) {
  buffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);

  return ch.sendToQueue(q, buffer);
}

// Return object or null if not parsed
function safeParse(string) {
  try {
    return JSON.parse(string);
  } catch (error) {
    return null;
  }
}


// Checks whether a string is a valid RPC request
function isRpcRequest(string) {
  const obj = safeParse(string);

  return obj
    ? jayson.Utils.Request.isValidRequest(obj)
    : false;
}

// Checks whether a string is a valid RPC response
function isRpcResponse(string) {
  const obj = safeParse(string);
  return obj
    ? jayson.Utils.Response.isValidResponse(obj)
    : false;
}

// Checks whether a string is a valid RPC error
function isRpcError(string) {
  const obj = safeParse(string);
  return obj
    ? jayson.Utils.Response.isValidError(obj)
    : false;
}

// Checks whether a string is a valid RPC notification
function isRpcNotification(string) {
  const obj = safeParse(string);
  return obj
    ? jayson.Utils.Request.isNotification(obj)
    : false;
}

// Checks whether a string is a valid RPC object
function isRpc(string) {
  const obj = safeParse(string);

  return obj ? (
    isRpcNotification(string) ||
    isRpcRequest(string) ||
    isRpcResponse(string) ||
    isRpcError(string)
  ) : false;
}

module.exports = {
  connect,
  createChannel,
  generateQueueNames,
  setConsumer,
  sendMessage,
  isRpcRequest,
  isRpcResponse,
  isRpcNotification,
  isRpcError,
  isRpc,
  safeParse,
};

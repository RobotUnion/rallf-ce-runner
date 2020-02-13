const runnerMain = require('../main.js');
runnerMain({
  cmd: `rallf-js run -t ./test-task/basic-example`,

  // You can pass in the name of the queue
  // this will generate 3 queues, in, out, error
  name: 'test',

  // or you can pass in the queues your self
  in: 'test:in',
  out: 'test:out',
  error: 'test:error',

  // Set debug
  debug: true,
}).then((connection) => {
  console.log('connection');
  // You can access RabbitMQ connection here
});
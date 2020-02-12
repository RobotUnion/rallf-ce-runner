
<!-- Docs links -->
<p align="center">
  <a href="http://rallf.com">
    <img src="https://avatars2.githubusercontent.com/u/24513128?s=200&v=4" height="100">
  </a>
</p>
<h1 align="center">rallf-ce-runner</h1>

<div align="center">
  <p>
    Runs a command, and sends `stdout` to a RabbitMQ queue and writes to `stdin` any message from a queue.
  </p>
</div>

****

**Disclaimer! This package is in development stage (unstable), it may be potentially buggy**


Basic Usage:
```sh
   node bin/rallf-ce-runner.js pipe --debug --name=test --cmd="rallf-js run -t ./test-task/basic-example"
```

Will listen in queue, and will post anytihng to output queue.

![](./rallf-ce-runner.png)

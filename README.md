# rallf-ce-runner

Pipes sdk std output to a RabbitMQ output queue as rpc, and receives input from a RabbitMQ input queue.

Basic Usage:
```sh
    rallf-ce-runner rallf-js run -t . -c { "in-queue": "asd" }
```
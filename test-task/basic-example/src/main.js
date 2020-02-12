const rallf = require('rallf-js-sdk');

class BasicExample extends rallf.Task {
  async warmup() {
    this.logger.debug('Warming up ' + this.name);
    this.firefox = this.devices.get('firefox');
    await this.firefox.get('http://0.0.0.0:9001/#/');
    await this.robot.delegateLocal('test-task', 'like', {
      post: 'some post'
    }, {});

  }

  async start(input) {
    this.logger.info(this.fqtn + ' started');
    return 'started';
  }

  async getTitle(input) {
    return await this.firefox.getTitle();
  }

  async cooldown() {
    this.logger.debug('cooldown');
  }
}
module.exports = BasicExample;

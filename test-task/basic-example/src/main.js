const rallf = require('rallf-js-sdk');

class BasicExample extends rallf.Task {
  async warmup() {
    this.logger.debug('Warming up ' + this.name);
    this.firefox = this.devices.get('firefox');
    let res = await this.robot.delegateLocal('test-task', 'like', {
      post: 'some post'
    }, {});
  }

  async start(input) {
    this.logger.info(this.fqtn + ' started');
    let res = await this.robot.delegateLocal('test-task', 'like', {
      post: 'some post'
    }, {});
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

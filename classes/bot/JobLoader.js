const cron = require('node-cron');
const FileLoader = require('./Loader');

module.exports = class JobLoader extends FileLoader {
  constructor(client) {
    super(client, 'jobs');
  }

  set(jobName, file) {
    super.set(jobName, file);

    cron.schedule(file.expression, () => file.run(this.client), { scheduled: true });

    return jobName;
  }
};

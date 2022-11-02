const chalk = require('chalk');
const moment = require('moment');

module.exports = class Logger {
  constructor(options) {
    this.dateFormat = options?.dateFormat ?? 'DD-MM-YYYY';
    this.timestamp = moment().format(`${this.dateFormat}, HH:mm:ss`);
    this.newline = /^win/.test(process.platform) ? '\r\n' : '\n';
    this.logType = (type) => {
      const types = {
        'log': () => chalk.bgCyan.black('LOG'),
        'warn': () => chalk.bgYellow.black('WARN'),
        'error': () => chalk.bgRed.black('ERROR'),
        'cmd': () => chalk.bgWhite.black('CMD'),
        'db': () => chalk.bgMagenta.black('DATABASE'),
      };

      return (types[type] || types['default'])();
    }
  }

  #formatText(entry, type = 'default') {
    return `[${this.timestamp}] ${this.logType(type)} - ${entry}${this.newline}`
  }

  log(entry) {
    process.stdout.write(this.#formatText(entry, 'log'));
  }

  warn(entry) {
    process.stdout.write(this.#formatText(entry, 'warn'));
  }

  error(entry) {
    process.stderr.write(this.#formatText(entry, 'error'));
  }

  cmd(entry) {
    process.stdout.write(this.#formatText(entry, 'cmd'));
  }

  db(entry) {
    process.stdout.write(this.#formatText(entry, 'db'));
  }
};

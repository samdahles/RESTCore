const chalk = require('chalk');
const fs = require('fs');

class Logger {
    constructor(path='', dump=false) {
        this._dump = dump === true;
        this._section = path == '' ? 'general' : path;
        this._path = 'logs/' + (path == '' ? '' : path.endsWith('/') ? path : path + '/');
        this._outfile = this._path + new Date().toDateString() + '.log';
    }

    combine(text) {
        if(typeof text == 'object') {
            return text.join(' ');
        } else {
            return text;
        }
    }

    dump(type, text) {
        if(this._dump) {
            if(!fs.existsSync(this._path)) {
                fs.mkdirSync(this._path);
            }

            fs.appendFile(this._outfile,
                new Date().toLocaleString() + '\t' + type.toUpperCase() + '\t' + text + '\n', 
                (err) => {
                    if (err) return false;
                }
            );
        }
        return true;
    }

    log(...text) {
        console.log(new Date().toLocaleString() + '\t' + chalk.yellow(this._section.toUpperCase()) +  '\t[' + chalk.blueBright('i') + '] ' + this.combine(text))
        return this.dump('info', this.combine(text));
    }

    warning(...text) {
        console.log(new Date().toLocaleString() + '\t' + chalk.yellow(this._section.toUpperCase()) + '\t[' + chalk.yellowBright('/') + '] ' + this.combine(text))
        return this.dump('warning', this.combine(text));
    }

    error(...text) {
        console.log(new Date().toLocaleString() + '\t' + chalk.yellow(this._section.toUpperCase()) + '\t[' + chalk.redBright('!') + '] ' + chalk.bgRed(this.combine(text)))
        return this.dump('error', this.combine(text));
    }

    unmarked(...text) {
        console.log(new Date().toLocaleString() + '\t' + chalk.yellow(this._section.toUpperCase()) + '\t' + this.combine(text));
    }
}

module.exports = { Logger };
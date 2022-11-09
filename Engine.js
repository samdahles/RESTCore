const { HTTPServer } = require('./HTTPServer');
const { Logger } = require('./Logger');
let settings = require('./settings.json');
const { SQLServer } = require('./SQLServer');
const fs = require('fs');
const crypto = require('crypto');
const { exit } = require('process');

class Engine {

    constructor() {
        this.cnsl = new Logger('engine', true)
        this.cnsl.log(settings['APP_NAME'], 'version', settings['APP_VERSION']);
        this.cnsl.log('Created by', settings['AUTHOR']);
        this.cnsl.log('Creating engine. . .');

        if(settings['SECRET'] === null) {
            this.cnsl.warning('No secret yet generated, generating. . .');
            settings['SECRET'] = crypto.randomBytes(256).toString('base64');
            try {
                fs.writeFileSync('./settings.json', JSON.stringify(settings));
                this.cnsl.log('Generated secret.');
            } catch (err) {
                this.cnsl.error('Could not generate secret: ', err);
                exit(1);
            }
        }

        this.cnsl.log('Setting up SQL and HTTP server. . .');
        this.sqlEngine = new SQLServer().then(() => {
            this.httpEngine = new HTTPServer();
        });    
    }

}

module.exports = { Engine };
const mongoose = require('mongoose');
const { Logger } = require('./Logger');
const { exit } = require('process');
const uniqueValidator = require('mongoose-unique-validator');

class SQLServer {

    static primary = null;

    settings() {
        return require('./settings.json');
    }

    constructor() {
        return (async () => {
            if(SQLServer.primary == null) SQLServer.primary = this;
            this.cnsl = new Logger('sql', true);
            await this.connect();
            return this;
        })();
    }

    async connect() {
        let db = this.settings()['DATABASE'];

        Object.keys(db).forEach(key => {
            db[key] = encodeURIComponent(db[key]); 
        })

        let dbUri = 'mongodb://' + 
        ((db.USERNAME || '') == '' ? (db.USERNAME) : ('')) +  
        ((db.PASSWORD || '') == '' && ((db.USERNAME || '') != '' ? (':' + db.PASSWORD + '@') : (''))) + 
        db.HOST + ':' +
        db.PORT + '/' +
        db.DB_NAME;

        this.cnsl.log('Connecting to', dbUri);

        return this._connection = mongoose.connect(dbUri).then(() => {
            this.cnsl.log('Connected to the MongoDB database.');
        }).catch((err) => {
            this.cnsl.error('Connection error:', err);
            exit(1);
        });


    }

    connection() {
        return this._connection;
    }


}

module.exports = { SQLServer };
const { Logger } = require('../Logger');
const { Middleware } = require('../Middleware');
class RequestLogger extends Middleware {
    constructor() {
        super();
        this.cnsl = new Logger('request', false);
    }

    core(req, res, next) {
        this.cnsl.unmarked(req.headers['x-forwarded-for'] || req.socket.remoteAddress, req.method, req.url, req.get('User-Agent'));
        next();
    }
}

module.exports = RequestLogger;
const { Express } = require('express');

class Middleware {
    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {Express.NextFunction} next 
     */
    core(req, res, next) {
        next();
    }
}

module.exports = { Middleware }
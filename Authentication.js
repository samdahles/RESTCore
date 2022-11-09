const { Responses } = require('./Endpoint')
const jwt = require('jsonwebtoken');
const settings = require('./settings.json');
const { User } = require('./models/UserModel');

const { Logger } = require('./Logger');

class Authentication {

    static logger = new Logger('auth', true);
    
    static authenticate(req, res, callback) {
        let engine = new Authentication.AuthEngine(req, res);

        engine.validAuthType(userToken => {
            engine.validAuth(userToken, userObject => {
                return callback(userObject);
            })
        });

    }

    static AuthEngine = class {
        constructor(req, res) {
            this.req = req;
            this.res = res;
        }

        static signToken(user, callback) {
            let token = jwt.sign({
                id: user._id,
                email: user.email
            }, settings['SECRET']);
            callback(token);
        }
        
        static tokenType = 'Bearer';

        validAuthType(callback) {
            if(this.req.get('Authorization').startsWith(Authentication.AuthEngine.tokenType + ' ') 
                && this.req.get('Authorization').trim() !== Authentication.AuthEngine.tokenType + ' ') {
                callback(this.req.get('Authorization').split('').splice((Authentication.AuthEngine.tokenType + ' ').length).join(''));
            }
        }
        
        validAuth(userToken, callback) {
            try {
                let payload = jwt.verify(userToken, settings['SECRET']);
                return User.findById(payload['id'], (err, userObject) => {
                    if(err) throw err;
                    return callback(userObject);
                });
            } catch(err) {
                if(err instanceof jwt.JsonWebTokenError) {
                    return this.res.status(401).json(Responses[401]());
                } else if(err instanceof jwt.TokenExpiredError) {
                    return this.res.status(401).json(Responses.generate('Your authentication token has expired. Please log in again', false));
                }
                Authentication.logger.error(err);
                return this.res.status(500).json(Responses[500](Responses.errors(err)));
            }
        }

    }
}

module.exports = { Authentication }
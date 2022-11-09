const { Authentication } = require('../Authentication');
const { Endpoint, Responses } = require('../Endpoint');
const { User } = require('../models/UserModel');

class UserIdEndpoint extends Endpoint {
    async get(req, res) {
        Authentication.authenticate(req, res, user => {
            User.findById(req.params.id, (err, userObject) => {
                if(err) return res.status(400).json(Responses[400](Responses.errors(err)));
                if(!userObject) return res.status(404).json(Responses.generate('No user exists with such id.', false, { data: null }));

                return res.status(200).json(Responses[200](null, userObject));
            });
        });
    }
}

module.exports = { UserIdEndpoint }
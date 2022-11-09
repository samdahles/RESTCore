const mongoose = require('mongoose');
const { Endpoint, Responses } = require('../Endpoint');
const { SQLServer } = require('../SQLServer');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const settings = require('../settings.json');
const { User } = require('../models/UserModel');
const { Authentication } = require('../Authentication');
class UserEndpoint extends Endpoint {
    async post(req, res) {
        return User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password == null ? '' : bcrypt.hashSync(req.body.password, 12),
        }).then(user => {
            return Authentication.AuthEngine.signToken(user, token => {
                return res.status(201).json(Responses[200]('Successfully created account.', {
                    token: token,
                    user: user.hide('password', 'salt', '__v')
                }));
            })

        }).catch(err => {
            return res.status(400).json(Responses[400](Responses.errors(err)));
        });
    }

    async get(req, res) {
        if(req.body.email && req.body.password) {
            User.findOne({
                email: req.body.email,
            }).select('+password').exec((err, user) => {
                if(err) return res.status(500).json(Responses[500](err));
                
                if(user) {
                    if(bcrypt.compareSync(req.body.password, user.password)) {
                        return Authentication.AuthEngine.signToken(user, token => {
                            return res.status(200).json(Responses[200]('Successfully logged in.', {
                                token: token
                            }));
                        });
                    } else {
                        return res.status(401).json(Responses.generate(['This password is incorrect. Please try again.'], false));
                    }
                } else {
                    return res.status(401).json(Responses.generate(['No user has been found with this email address.'], false));
                }
            });
        } else {
            return res.status(400).json(Responses[400](['Please provide a password and email address.']));
        }
    }
}

module.exports = { UserEndpoint }
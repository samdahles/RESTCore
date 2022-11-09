const express = require('express');
const { Logger } = require('./Logger');

class Endpoint {

    constructor(url) {
        this.url = String(url).startsWith('/') ? url : '/' + url;
        this.cnsl = new Logger(url, false);
    }

    async get(req, res) {
        res.set('Allow', this.allowedMethods(false));
        return res.status(405).json(Responses[405]());
    }

    async post(req, res) {
        res.set('Allow', this.allowedMethods(false));
        return res.status(405).json(Responses[405]());
    }

    async patch(req, res) {
        res.set('Allow', this.allowedMethods(false));
        return res.status(405).json(Responses[405]());
    }

    async put(req, res) {
        res.set('Allow', this.allowedMethods(false));
        return res.status(405).json(Responses[405]());
    }

    async delete(req, res) {
        res.set('Allow', this.allowedMethods(false));
        return res.status(405).json(Responses[405]());
    }

    allowedMethods(json=true) {
        let allowed = [];
        let proto = Object.getPrototypeOf(this);
        let endpointProto = Endpoint.prototype;
        ['get', 'post', 'update', 'delete'].forEach(method => {
            if(proto[method] != endpointProto[method]) {
                allowed.push(String(method).toUpperCase());
            }
        })
        return json ? allowed : (allowed.length == 0 ? '' : allowed.join(', '));
    }

    catchAll(req, res) {
        res.status(501).json(Responses[501]());
    }
}

const Responses = Object.freeze({

    generate: (response, success, additional = {}) => {
        let object = {
            'response' : String(response || ''),
            'success' : success === true
        };

        Object.keys(additional).forEach(key => {
            if(key != 'response' && key != 'error') {
                object[key] = additional[key];
            }
        });

        if(object['response'] == '') {
            delete object['response'];
        }

        return object;
    },

    errors: (err) => {
        if(typeof err == 'string') return [err];

        let errors = [];
        
        try {
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].properties.message);
            });
        } catch (e) {
            errors.push(err);
        }

        if(errors.length == 1 && Object.keys(errors[0]).length == 0) {
            errors.push(err.message);
        }

        return errors;
    },

    200: (response, data) => Responses.generate(response, true, {data: data}),
    204: () => Responses.generate(null, true),
    400: (errors=[]) => Responses.generate(
                                    'The server cannot process the request.', 
                                    false, 
                                    errors.length != 0 ? {errors : errors} : {}
                                    ),
    401: () => Responses.generate('Please provide a valid Authorization header.', false),
    402: () => Responses.generate('Your balance is insufficient to perform this action.', false),
    403: () => Responses.generate('You do not have the proper credentials to perform this action.', false),
    404: () => Responses.generate('This resource has not been found.', false),
    405: () => Responses.generate('This method is not allowed.', false),
    409: () => Responses.generate('This resource already exists.', false),
    413: () => Responses.generate('The payload is too large.', false),
    415: () => Responses.generate('The provided media is not supported', false),
    418: () => Responses.generate('An unknown error has occurred.', false),
    500: (errors=[]) => Responses.generate('A server error has occurred. Please try again later.',
                                    false,
                                    errors.length != 0 ? {errors : errors} : {}
                                    ),
    501: () => Responses.generate('This method is not implemented.', false)
});


module.exports = { Endpoint, Responses }
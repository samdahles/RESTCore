const { default: mongoose } = require('mongoose')
const http = require('http');
const express = require('express');
const { Endpoint } = require('../Endpoint');

class HealthEndpoint extends Endpoint {

    getSettings() {
        if(this._lastSettingsObtained == null || this._lastSettingsObtained.getTime() / 1000 | 0 < (new Date().getTime() / 1000) | 0 +  30) {
            this._settings = require('../settings.json');
        }
        return this._settings;
    }

    async get(req, res) {
        res.status(200).send({
            version: this.getSettings().APP_VERSION,
            database: mongoose.STATES[mongoose.connection.readyState]
        })
    }
}

module.exports = { HealthEndpoint }
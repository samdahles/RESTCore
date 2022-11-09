const { Logger } = require('./Logger');
const { Endpoint, Responses } = require('./Endpoint');
const express = require('express');
const bodyParser = require('body-parser');
const { Middleware } = require('./Middleware');
const RequestLogger = require('./middlewares/RequestLogger');
const { default: helmet } = require('helmet');
const http = require('http');
const https = require('https');
const { HealthEndpoint } = require('./endpoints/HealthEndpoint');
const { UserEndpoint } = require('./endpoints/UserEndpoint');
const { UserIdEndpoint } = require('./endpoints/UserIdEndpoint');
const fs = require('fs');

let settings = require('./settings.json');

class HTTPServer {

    constructor() {
        this.http = settings['SERVER']['HTTP_PORT'] || 8000;
        this.https = settings['SERVER']['HTTPS_PORT'] || 8443;

        this.cnsl = new Logger('server', true)
        this.app = express();
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));

        this.middlewares();
        this.serve()
    }

    SSL = class {
        
    }

    middlewares() {
        this._middlewares = HTTPServer.Create.middlewares();

        this._middlewares.forEach(middleware => {
            this.app.use((req, res, next) => middleware.core(req, res, next));
        });

        this.app.use(helmet());
    }

    serve() {
        this._endpoints = HTTPServer.Create.endpoints();

        this._endpoints.forEach(endpoint => {
            try {

                this.app.all(endpoint.url, (req, res, next) => {
                    res.set('Allow', endpoint.allowedMethods(false));
                    next();
                });

                this.app.get(endpoint.url, (req, res) => endpoint.get(req, res));
                this.app.post(endpoint.url, (req, res) => endpoint.post(req, res));
                this.app.put(endpoint.url, (req, res) => endpoint.put(req, res));
                this.app.patch(endpoint.url, (req, res) => endpoint.patch(req, res));
                this.app.delete(endpoint.url, (req, res) => endpoint.delete(req, res));
                this.app.all(endpoint.url, (req, res) => endpoint.catchAll(req, res));

                this.cnsl.log('Created', endpoint.allowedMethods(false), 'for', endpoint.url);
            } catch(err) {
                if(err instanceof TypeError) {
                    return this.cnsl.error('Could not appoint endpoints for', endpoint.constructor.name, '; Class probably does not inherit Endpoint features.');
                }
                return this.cnsl.warning('Could not appoint endpoints for', endpoint.url, err);
            }
        });

        this.app.all('*', (req, res) => {
            res.status(404).json(Responses[404]());
        });

        try {
            let sslOptions = {
                key: fs.readFileSync('./ssl/https.key'),
                cert: fs.readFileSync('./ssl/https.crt')
            };
            this.server = https.createServer(sslOptions, this.app);
            this.server.listen(this.https);
            this.cnsl.log('Listening on port', this.https, '(HTTPS)');
        } catch(err) {
            this.cnsl.warning('NO SSL! All data, including passwords, is *completely* unencrypted.');
            this.cnsl.warning('Please save the key as \'./ssl/https.key\' and the certificate as \'./ssl/https.crt\'.');
            this.server = http.createServer(this.app);
            this.server.listen(this.http);
            this.cnsl.log('Listening on port', this.http, '(HTTP)');
        }
   
    }

    static Create = class {
        static middlewares() {
            return [
                new RequestLogger(),
            ];
        }

        static endpoints() {
            return [
                new HealthEndpoint('/health'),
                new UserEndpoint('/user'),
                new UserIdEndpoint('/user/:id')
            ];
        }
    }

}

module.exports = { HTTPServer }
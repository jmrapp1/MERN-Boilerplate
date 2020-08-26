import 'reflect-metadata';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import { useContainer, createExpressServer } from 'routing-controllers';
import { RoutingControllersOptions } from 'routing-controllers';
import { Container } from 'typedi';
const chalk = require('chalk');
const express = require('express');

import { Events } from '@jrapp/server-core-events';
import { INFO_COLOR } from '@jrapp/server-core-logging';
import { EVENT_WEB_INIT } from './constants/Events';

export function createExpressWebServer(nodeEnv, port, controllers: any[], options: RoutingControllersOptions = {}): WebServer {
    const app = createExpressServer({
        ...options,
        controllers: controllers
    });
    configureApp(nodeEnv, app);
    if (nodeEnv && nodeEnv.toLowerCase() === 'production') {
        app.use(express.static('dist/client'));
    }
    return new WebServer(app);
}

function configureApp(nodeEnv, app) {
    useContainer(Container);
    app.set('port', (process.env.PORT || 3000));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(morgan(chalk.hex(INFO_COLOR)('[:date[iso]] ') + ':method :url :status - :response-time ms'));
}

export class WebServer {

    app;

    constructor(app) {
        this.app = app;
        Container.get(Events).emit(EVENT_WEB_INIT, this);
    }

}
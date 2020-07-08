import * as dotenv from 'dotenv';
import * as morgan from 'morgan';
import * as passport from 'passport';
import * as bodyParser from 'body-parser';
const chalk = require('chalk');
import 'reflect-metadata'; // required

import { createExpressServer, useContainer } from 'routing-controllers';
import { Container } from 'typedi';
useContainer(Container);

import { Logger } from '@jrapp/server-logging';
import { ResourceMappingManager } from '@jrapp/shared-resources';
import { TestController } from '@jrapp/server-example-module';
import { TestMapper } from '@jrapp/shared-example-module';
import { MongoConfig } from '@jrapp/server-dal-mongodb';
import { Events } from '@jrapp/server-events';
import { INITIALIZED } from '@jrapp/server-events';
import { registerModule, ModuleContext, ModulesRegistry } from '@jrapp/server-module';
import { INFO_COLOR } from '@jrapp/server-logging';

import UserController from './controllers/UserController';
import UserRegisterMapper from '../shared/mappers/user/UserRegisterMapper';
import UserLoginMapper from '../shared/mappers/user/UserLoginMapper';
import JwtMapper from '../shared/mappers/user/JwtMapper';
import registerPassport from './config/passport';

dotenv.load({ path: '.env' });

process.on('uncaughtException', function (err) {
    ModuleLogger.critical(`${err.message}: ${err.stack}`);
});

ResourceMappingManager.addMapper(UserRegisterMapper);
ResourceMappingManager.addMapper(UserLoginMapper);
ResourceMappingManager.addMapper(JwtMapper);
ResourceMappingManager.addMapper(TestMapper);

export const MODULE_NAME = 'APP';
export const AppContext: ModuleContext = registerModule(MODULE_NAME, '#00acc1');
export const ModuleLogger: Logger = AppContext.logger;

Container.get(Events).emit(INITIALIZED, {});

const express = require('express');

const app = createExpressServer({
    cors: true,
    routePrefix: '/api',
    controllers: [ TestController, UserController ]
});

app.set('port', (process.env.PORT || 3000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan(chalk.hex(INFO_COLOR)('[:date[iso]]: ') + ':method :url :status - :response-time ms'));

if (process.env.NODE_ENV === 'production') {
    ModuleLogger.info('Using production build');
    app.use(express.static('dist/client'));
} else {
    ModuleLogger.info('Using development build');
}

const modulesRegistry = Container.get(ModulesRegistry);
ModuleLogger.info(`Registered ${modulesRegistry.getModules().length} modules.`);
MongoConfig.connect(process.env.MONGODB_URI).then(() => {

    registerPassport(passport);

    app.listen(app.get('port'), () => {
        ModuleLogger.info('Listening on port ' + app.get('port'));
    });
});

export { app };

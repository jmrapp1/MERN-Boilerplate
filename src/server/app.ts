import * as dotenv from 'dotenv';
import * as morgan from 'morgan';
import * as passport from 'passport';
import * as bodyParser from 'body-parser';
import 'reflect-metadata'; // required

import registerPassport from './config/passport';
import { createExpressServer, useContainer } from 'routing-controllers';
import { Container } from 'typedi';
useContainer(Container);

import { Logger } from '@jrapp/server-logging';
import { ResourceMappingManager } from '@jrapp/shared-resources';
import { TestController } from '@jrapp/server-example-module';
import { TestMapper } from '@jrapp/shared-example-module';

import UserController from './controllers/UserController';
import UserRegisterMapper from '../shared/mappers/user/UserRegisterMapper';
import UserLoginMapper from '../shared/mappers/user/UserLoginMapper';
import JwtMapper from '../shared/mappers/user/JwtMapper';
import { MongoConfig } from '@jrapp/server-dal-mongodb';

dotenv.load({ path: '.env' });

ResourceMappingManager.addMapper(UserRegisterMapper);
ResourceMappingManager.addMapper(UserLoginMapper);
ResourceMappingManager.addMapper(JwtMapper);
ResourceMappingManager.addMapper(TestMapper);

const express = require('express');

const app = createExpressServer({
    cors: true,
    routePrefix: '/api',
    controllers: [ TestController, UserController ]
});

if (process.env.NODE_ENV === 'production') {
    console.log('Using production build');
    app.use(express.static('dist/client'));
}

app.set('port', (process.env.PORT || 3000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));

app.use(function (err, req, res, next) {
    next(err);
});

MongoConfig.connect(process.env.MONGODB_URI).then(() => {

    registerPassport(passport);

    app.listen(app.get('port'), () => {
        Logger.info('Listening on port ' + app.get('port'));
    });
});

export { app };

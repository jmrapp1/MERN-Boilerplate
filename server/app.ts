import * as dotenv from 'dotenv';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import 'reflect-metadata'; // required

import { createExpressServer, useContainer } from 'routing-controllers';
import { Container } from 'typedi';

import DatabaseSetup from './util/DatabaseSetup';

useContainer(Container);

const express = require('express');

const app = createExpressServer({
    cors: true,
    routePrefix: '/api',
    controllers: [ ]
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

dotenv.load({ path: '.env' });
app.set('port', (process.env.PORT || 3000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));

new DatabaseSetup().setupDb(() => {

    app.listen(app.get('port'), () => {
        console.log('Listening on port ' + app.get('port'));
    });
});

export { app };

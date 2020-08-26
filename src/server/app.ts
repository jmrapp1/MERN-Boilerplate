import 'reflect-metadata'; // required
import * as dotenv from 'dotenv';
import * as passport from 'passport';
import { Container } from 'typedi';
dotenv.load({ path: '.env' });

import { registerModule, ModuleContext, ModulesRegistry } from '@jrapp/server-core-module';
import { Logger } from '@jrapp/server-core-logging';
import { TestController } from '@jrapp/server-web-example';
import { ModuleContext as UserModuleContext, UserController, registerPassportJwt } from '@jrapp/server-web-user';
import { MongoConfig } from '@jrapp/server-dal-mongodb';
import { createExpressWebServer, EVENT_WEB_INIT, WebServer } from '@jrapp/server-core-web';
import { Events } from '@jrapp/server-core-events';
import { EVENT_MODULES_LOADED } from '@jrapp/server-core-events';

// Register module
export const MODULE_NAME = 'APP';
export const AppContext: ModuleContext = registerModule(MODULE_NAME, '#00acc1');
export const ModuleLogger: Logger = AppContext.logger;

// Catch and log all uncaught exceptions
process.on('uncaughtException', function (err) {
    ModuleLogger.critical(`${err.message}: ${err.stack}`);
});

// Set the User Module's Jwt Token Secret
UserModuleContext.setTokenSecret(process.env.JWT_SECRET);

// Hook into web server initialized event
Container.get(Events).once(EVENT_WEB_INIT, (webServer) => {
    ModuleLogger.info(`Registered ${ModulesRegistry.registeredModules.length} modules.`);

    // Connect to MongoDB
    MongoConfig.connect(process.env.MONGODB_URI).then(() => {
        registerPassportJwt(passport);
        webServer.app.listen(webServer.app.get('port'), () => {
            ModuleLogger.info('Listening on port ' + webServer.app.get('port'));
        });
    });
});

const webServer: WebServer = createExpressWebServer(
    process.env.NODE_ENV,
    process.env.PORT || 3000,
    [TestController, UserController],
    { cors: true, routePrefix: '/api', }
);

Container.get(Events).emit(EVENT_MODULES_LOADED);
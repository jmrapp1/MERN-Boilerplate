import 'reflect-metadata'; // required
import * as dotenv from 'dotenv';
import * as passport from 'passport';
import { Container } from 'typedi';
dotenv.load({ path: '.env' });

import { EVENT_MODULES_LOADED, Module, ModuleContext, ModulesRegistry } from '@modulfy/server-core-module';
import { TestController } from '@modulfy/server-web-example';
import { UserController, registerPassportJwt } from '@modulfy/server-web-user';
import { MongoConfig } from '@modulfy/server-dal-mongodb';
import { createExpressWebServer, EVENT_WEB_INIT, WebServer } from '@modulfy/server-core-web';
import { Events } from '@modulfy/server-core-events';
import { UserWebModule } from '@modulfy/server-web-user/dist';
import { MongoDbModule } from '@modulfy/server-dal-mongodb/dist';
import { BlogWebModule } from '@modulfy/server-web-blog/dist';

export const AppModule = new Module('APP', '#00acc1', new ModuleContext);

// Catch and log all uncaught exceptions
process.on('uncaughtException', function (err) {
    AppModule.logger.critical(`${err.message}: ${err.stack}`);
});

// Register modules
BlogWebModule.registerBlogModule();
UserWebModule.registerUserModule({ jwtSecret: process.env.JWT_SECRET });
MongoDbModule.registerModule();
AppModule.registerModule();
ModulesRegistry.doneLoadingModules();

// Hook into web server initialized event
Container.get(Events).once(EVENT_WEB_INIT, (webServer) => {
    AppModule.logger.info(`Registered ${ModulesRegistry.registeredModules.length} modules.`);

    // Connect to MongoDB
    MongoConfig.connect(process.env.MONGODB_URI).then(() => {
        registerPassportJwt(passport);
        webServer.app.listen(webServer.app.get('port'), () => {
            AppModule.logger.info('Listening on port ' + webServer.app.get('port'));
        });
    });
});

const webServer: WebServer = createExpressWebServer(
    process.env.NODE_ENV,
    process.env.PORT || 3000,
    [TestController, UserController],
    { cors: true, routePrefix: '/api', }
);
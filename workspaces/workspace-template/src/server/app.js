"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
require("reflect-metadata"); // required
var dotenv = require("dotenv");
var passport = require("passport");
var typedi_1 = require("typedi");
dotenv.load({ path: '.env' });
var server_core_module_1 = require("@modulfy/server-core-module");
var server_core_web_1 = require("@modulfy/server-core-web");
var server_core_events_1 = require("@modulfy/server-core-events");
var server_web_user_1 = require("@modulfy/server-web-user");
var server_dal_mongodb_1 = require("@modulfy/server-dal-mongodb");
exports.AppModule = new server_core_module_1.Module('APP', '#00acc1', new server_core_module_1.ModuleContext);
// Catch and log all uncaught exceptions
process.on('uncaughtException', function (err) {
    exports.AppModule.logger.critical(err.message + ": " + err.stack);
});
// Register modules
server_web_user_1.UserWebModule.registerUserModule({ jwtSecret: process.env.JWT_SECRET });
server_dal_mongodb_1.MongoDbModule.registerModule();
exports.AppModule.registerModule();
server_core_module_1.ModulesRegistry.doneLoadingModules();
// Hook into web server initialized event
typedi_1.Container.get(server_core_events_1.Events).once(server_core_web_1.EVENT_WEB_INIT, function (webServer) {
    exports.AppModule.logger.info("Registered " + server_core_module_1.ModulesRegistry.registeredModules.length + " modules.");
    // Connect to MongoDB
    server_dal_mongodb_1.MongoConfig.connect(process.env.MONGODB_URI).then(function () {
        server_web_user_1.registerPassportJwt(passport);
        webServer.app.listen(webServer.app.get('port'), function () {
            exports.AppModule.logger.info('Listening on port ' + webServer.app.get('port'));
        });
    });
});
var webServer = server_core_web_1.createExpressWebServer(process.env.NODE_ENV, process.env.PORT || 3000, [server_web_user_1.UserController], { cors: true, routePrefix: '/api', });

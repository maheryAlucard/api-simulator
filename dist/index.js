"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fastify_1 = __importDefault(require("fastify"));
var auth_1 = require("./routes/auth");
var cors_1 = __importDefault(require("@fastify/cors"));
var simulations_1 = require("./routes/simulations");
var users_1 = require("./routes/users");
var server = (0, fastify_1.default)();
var port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
server.register(cors_1.default, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
});
(0, auth_1.initAuth)(server);
(0, simulations_1.initSimulations)(server);
(0, users_1.initUsers)(server);
server.listen({ port: port, host: '0.0.0.0' }, function (err, address) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log("Server listening at ".concat(address));
});
//# sourceMappingURL=index.js.map
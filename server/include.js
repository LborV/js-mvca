// In this file will be aotomaticaly included your models
globalThis.config = require('./configs/config.js');
globalThis.ModelInterface = require('./kernel/interfaces/ModelInterface');
globalThis.Actions = require('./kernel/Actions');
globalThis.Models = require('./kernel/Models');

// Mysql Connection
if(config.mysql && config.mysql.host && config.mysql.user && config.mysql.user && config.mysql.password && config.mysql.db) {
    const mysql = require('sync-mysql');
    globalThis.mysqlConnection = new mysql({
        host: config.mysql.host,
        user: config.mysql.user,
        password: config.mysql.password,
        database: config.mysql.db,
    });
}

// Redis connection
if(config.redis && config.redis.port && config.redis.host && config.redis.password) {
    globalThis.redis = require('redis');
    const util = require('util');
    globalThis.redisConnection = redis.createClient();
    globalThis.redisConnection.get = util.promisify(globalThis.redisConnection.get);
}

// Cluster mode
// const io = require('socket.io')(3030);
// const redisAdapter = require('socket.io-redis');
// let server = io.adapter(redisAdapter({host: 'localhost', port: 6379, password: '123'}));

// Single thread
if(config.socket && config.socket.port) {
    const
        io = require("socket.io"),
        server = io.listen(config.socket.port);

    globalThis.actionsPool = new Actions({
        io: server
    });
}

globalThis.modelsPool = new Models();
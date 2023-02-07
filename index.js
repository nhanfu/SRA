import log4js from 'log4js';
import HttpServer from './server/HttpServer.js';

log4js.configure({
    appenders: { cheese: { type: "file", filename: "cheese.log" } },
    categories: { default: { appenders: ["cheese"], level: "error" } },
});
HttpServer.autoStart();
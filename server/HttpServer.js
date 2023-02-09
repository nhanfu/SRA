import http from 'http';
import url from 'url';
import LoadBalancer from './LoadBalancer.js';
import svRunner from '../services/svRunner.js';
import Sqlite from '../sql/sqlite.js';
import path, { resolve } from 'path';
import fs from 'fs';
import log4js from 'log4js';

var instance = null;
const folder = process.argv[3] || 'public';
const _logger = log4js.getLogger();
export default class HttpServer {
    constructor() {
        this.http = http;
        this.url = url;
        this.LoadBalanceServer = LoadBalancer;
        this.SvRunner = svRunner;;
        this.db = Sqlite.connect();
        this.svRunner = new this.SvRunner();
        this.loadBalanceServer = new this.LoadBalanceServer();
        this.svRunner.run();
        this.loadBalanceServer.run();
    }

    static autoStart() {
        if (instance == null) {
            instance = new HttpServer();
        }
        instance.start();
        return instance;
    }

    start() {
        const requestListener = async (req, res) => {
            const exist = await this.resolveFile(req, res);
            if (exist) {
                return;
            }
            this.resolveService(req, res);
        };

        this.server = this.http.createServer(requestListener);
        this.db.getAsync(`select * from [Const] where [Key] = 'host'`).then(row => {
            const conf = JSON.parse(row.Value);
            this.server.listen(conf.port, conf.host, () => {
                console.log(`Server is running on http://${conf.host}:${conf.port}`);
            });
        });
    }

    resolveService(req, res) {
        const uri = this.url.parse(req.url);
        let body = [];

        req.on('data', (chunk) => {
            body.push(chunk);
        });

        req.on('end', async () => {
            try {
                const arg = this.tryParseBody(body);
                const path = arg && arg.path || uri.pathname;
                if (path && path != '/') {
                    const result = await this.invokeService(path, arg, res);
                    this.writeStream(res, 200, typeof (result) === 'string' ? result : JSON.stringify(result));
                }
                else {
                    res.writeHead(200);
                    res.end('Ok');
                }
            } catch (e) {
                this.writeStream(res, e.status || 500, JSON.stringify({ message: e.message }));
            }
        });
    }

    resolveFile(req, res) {
        const parsedUrl = url.parse(req.url);
        if (parsedUrl.pathname === '' || parsedUrl.pathname === '/') return false;
        let pathname = path.join(folder, parsedUrl.pathname);
        const ext = path.parse(pathname).ext;
        const map = {
            '.ico': 'image/x-icon',
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.json': 'application/json',
            '.css': 'text/css',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.wav': 'audio/wav',
            '.mp3': 'audio/mpeg',
            '.svg': 'image/svg+xml',
            '.pdf': 'application/pdf',
            '.doc': 'application/msword'
        };
        return new Promise((resolve, reject) => {
            _logger.info(pathname);
            fs.exists(pathname, function (exist) {
                if (!exist) {
                    res.statusCode = 404;
                    res.end(`File ${pathname} not found!`);
                    resolve(false);
                }

                fs.readFile(pathname, function (err, data) {
                    if (err) {
                        res.statusCode = 500;
                        res.end(`Error getting the file: ${err}.`);
                    } else {
                        res.setHeader('Content-type', map[ext] || 'text/plain');
                        res.end(data);
                        resolve(true);
                    }
                });
            });
        });
    }

    async invokeService(path, arg, s) {
        if (path == null) throw new Error('Path is required');
        const fn = require('./services/' + path);
        if (fn == null) {
            const err = new Error('Service not found');
            err.status = 404;
            throw err;
        }
        const res = fn.call(this, arg == null ? null : arg.entity || arg.Entity, arg);
        const final = res instanceof Promise ? (await res) : typeof (res) == 'string' ? res : JSON.stringify(res) || 'Ok';
        return final;
    }

    writeStream(s, status, content, headers) {
        headers = headers || {
            'Access-Control-Allow-Origin': '*',
        };
        s.writeHead(status, headers);
        s.write(content);
        s.end();
    }

    tryParseBody(body) {
        if (body == null || body.length == 0) {
            return null;
        }
        try {
            return JSON.parse(body.toString().replace(/'/g, '\\\''));
        }
        catch (e) {
            return null;
        }
    }

    stop() {
    }
}
import http from 'http';
import url from 'url';
import svRunner from '../services/svRunner.js';
import Sqlite from '../sql/sqlite.js';
import path from 'path';
import { readFile } from 'fs';
import log4js from 'log4js';
import conf from './config.js';

var instance = null;
const folder = process.argv[3] || 'public';
const _logger = log4js.getLogger();
export default class HttpServer {
    constructor() {
        this.http = http;
        this.url = url;
        this.SvRunner = svRunner;;
        this.db = Sqlite.connect();
        this.svRunner = new this.SvRunner();
        this.svRunner.run();
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
        this.server.listen(conf.port, conf.host, () => {
            console.log(`Server is running on http://${conf.host}:${conf.port}`);
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

    static extMap = {
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

    resolveFile(req, res) {
        const parsedUrl = url.parse(req.url);
        if (parsedUrl.pathname === '' || parsedUrl.pathname === '/') return false;
        let pathname = path.join(folder, parsedUrl.pathname);
        const ext = path.parse(pathname).ext;
        const contentType = HttpServer.extMap[ext];
        if (!ext || !contentType) return false;
        return new Promise((resolve, reject) => {
            _logger.info(pathname);
            readFile(pathname, function (err, data) {
                if (err) {
                    if (ext && ext.length) {
                        res.statusCode = 500;
                        res.end(`Error getting the file: ${pathname}.`);
                    }
                    resolve(false);
                } else {
                    res.setHeader('Content-type', contentType || 'text/plain');
                    res.end(data);
                    resolve(true);
                }
            });
        });
    }

    async invokeService(path, arg, s) {
        if (path == null) throw new Error('Path is required');
        const fn = await import('../services/' + path + '.js');
        if (fn == null) {
            const err = new Error('Service not found');
            err.status = 404;
            throw err;
        }
        const method = fn.default ? fn.default : fn;
        const res = method(this, arg == null ? null : arg.entity || arg.Entity, arg);
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
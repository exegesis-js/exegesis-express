import express from 'express';
import http from 'http';
import * as path from 'path';
import { makeFetch } from 'supertest-fetch';

import * as exegesisExpress from '../src';

const openApiDoc =  {
    openapi: '3.0.1',
    info: {
        title: 'foo',
        version: '1.0.0'
    },
    paths: {
      "/greet": {
        get: {
            summary: "List all pets",
            "x-exegesis-controller": "greetController",
            "operationId": "greetGet",
            responses: {
                '200': {
                    description: "Greet message.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object"
                            }
                        }
                    }
                }
            }
        }
      }
    }
};

function createServer(done : exegesisExpress.Callback<http.Server>) {
    const options : exegesisExpress.ExegesisOptions = {
        controllers: path.resolve(__dirname, './integrationSample/controllers'),
        controllersPattern: "**/*.@(ts|js)"
    };

    exegesisExpress.middleware(
        openApiDoc,
        options,
        (err, exegesisMiddleware) => {
            if(err || !exegesisMiddleware) {
                return done(err || new Error('Expected middleware'));
            }

            const app = express();
            app.use(exegesisMiddleware);
            app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
                if(err) {
                    res.writeHead(500);
                    res.end(`Internal error: ${err.message}`);
                } else {
                    res.writeHead(404);
                    res.end();
                }
            });

            const server = http.createServer(app);

            done(null, server);
        }
    );

}

describe('callback', function() {
    it('should work with a callback', function(done) {
        createServer((err, server) => {
            if(err || !server) {
                return done(err || new Error("No server!"));
            }

            const fetch = makeFetch(server);
            fetch(`/greet?name=Jason`)
                .expect(200)
                .expect('content-type', 'application/json')
                .expectBody({greeting: 'Hello, undefined!'})
                .then(
                    () => done(),
                    err => done(err)
                );
        });
    });
});
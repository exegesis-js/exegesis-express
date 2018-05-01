# exegesis-express

[![Greenkeeper badge](https://badges.greenkeeper.io/exegesis-js/exegesis-express.svg)](https://greenkeeper.io/)

[![NPM version](https://badge.fury.io/js/exegesis-express.svg)](https://npmjs.org/package/exegesis-express)
[![Build Status](https://travis-ci.org/exegesis/exegesis-express.svg)](https://travis-ci.org/exegesis/exegesis-express)
[![Coverage Status](https://coveralls.io/repos/exegesis/exegesis-express/badge.svg)](https://coveralls.io/r/exegesis/exegesis-express)

> ## *exegesis*
>
> *n.* An explanation or critical interpretation of a text, especially an
> API definition document.
>
> -- No dictionary ever

This library implements an Express middleware for
[OpenAPI 3.x](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#requestBodyObject).

## WARNING

🚨🚨 This is super beta. 🚨🚨

This is very much a work in progress.  Wait for the v1.0.0 release, coming soon!  :)

## Usage

```js
import express from 'express';
import http from 'http';
import * as exegesisExpress from 'exegesis-express';

async function createServer() {
    // See https://github.com/exegesis-js/exegesis/blob/master/docs/Options.md
    const options {
        controllers: path.resolve(__dirname, './integrationSample/controllers'),
        securityPlugins: {
            sessionKey: sessionAuthSecurityPlugin
        }
    };

    const exegesisMiddleware = await exegesisExpress.middleware(
        path.resolve(__dirname, './integrationSample/openapi.yaml'),
        options
    );

    const app = express();
    app.use(exegesisMiddleware);
    app.use((err, req, res, _next) => {
        if(err) {
            res.writeHead(500);
            res.end(`Internal error: ${err.message}`);
        } else {
            res.writeHead(404);
            res.end();
        }
    });

    const server = http.createServer(app);
    server.listen(3000);
}
```

## TODO

* [ ] Enable semantic-release
  * `travis env set GH_TOKEN [your token here]`
  * `travis env set NPM_TOKEN [your token here]`
  * Uncomment lines in travis.yml

Copyright 2018 Jason Walton
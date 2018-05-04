# exegesis-express

[![NPM version](https://badge.fury.io/js/exegesis-express.svg)](https://npmjs.org/package/exegesis-express)
[![Build Status](https://travis-ci.org/exegesis-js/exegesis-express.svg)](https://travis-ci.org/exegesis-js/exegesis-express)
[![Coverage Status](https://coveralls.io/repos/exegesis-js/exegesis-express/badge.svg)](https://coveralls.io/r/exegesis-js/exegesis-express)
[![Greenkeeper badge](https://badges.greenkeeper.io/exegesis-js/exegesis-express.svg)](https://greenkeeper.io/)

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
        controllers: path.resolve(__dirname, './controllers')
    };

    const exegesisMiddleware = await exegesisExpress.middleware(
        path.resolve(__dirname, './openapi.yaml'),
        options
    );

    const app = express();

    // If you have any body parsers, this should go before them.
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

## Where to put Exegesis-Express in your middleware stack

Exegesis-express should appear near the top of your middleware stack, before
any body parsers.  This is because exegesis will take care of parsing the body
for us, and it can't do that if the body has already been read.  If you put
a body parser ahead of exeges-express, exegesis will try to use `req.body`
if it's there.

## Servers section

OpenAPI 3.x lets you specify what servers your API is available on.  For example:

```yaml
servers:
  - url: '/api/v2'
```

By default, exegesis will take 'servers' into account when routing requests,
so if you have the above servers section, and a path in your API called
"/users", then exegesis will only match the route if the incoming requests has
the URL "/api/v2/users".

If you have path templates in your servers, the variables will be available to
your controllers via `context.params.server`.

If you specify the `ignoreServers` option, however, exegesis will ignore the
servers section, an route purely based on your paths.  This lets you do
something like:

```js
    const exegesisMiddleware = await exegesisExpress.middleware(
        path.resolve(__dirname, './openapi.yaml'),
        {ignorePaths: true}
    );
    app.use('/api/v2', exegesisMiddleware);
```

which means non-api paths will not even be sent to the exegesis middleware.

## TODO

* [ ] Enable semantic-release
  * `travis env set GH_TOKEN [your token here]`
  * `travis env set NPM_TOKEN [your token here]`
  * Uncomment lines in travis.yml

Copyright 2018 Jason Walton

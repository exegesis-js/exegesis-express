# exegesis-express

[![NPM version](https://badge.fury.io/js/exegesis-express.svg)](https://npmjs.org/package/exegesis-express)
![Build Status](https://github.com/exegesis-js/exegesis-express/workflows/GitHub%20CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/exegesis-js/exegesis-express/badge.svg)](https://coveralls.io/r/exegesis-js/exegesis-express)
[![Greenkeeper badge](https://badges.greenkeeper.io/exegesis-js/exegesis-express.svg)](https://greenkeeper.io/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

> ## _exegesis_
>
> _n._ An explanation or critical interpretation of a text, especially an
> API definition document.
>
> -- No dictionary ever

This library implements an Express middleware for
[OpenAPI 3.x](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#requestBodyObject).

## Features

- Full support for OpenAPI 3.x.x (see [issues tagged with conformance](https://github.com/exegesis-js/exegesis/issues?q=is%3Aissue+is%3Aopen+label%3Aconformance) for areas which could use some improvement).
- Built in support for "application/json" and "application/x-www-form-urlencoded" requests
- Can use express [body parser middlewares](https://github.com/exegesis-js/exegesis/blob/master/docs/Options.md#mimetypeparsers)
- [Response validation](https://github.com/exegesis-js/exegesis/blob/master/docs/Options.md#onresponsevalidationerror)
- [Authentication support](https://github.com/exegesis-js/exegesis/blob/master/docs/OAS3%20Security.md)
- [Plugins](https://github.com/exegesis-js/exegesis/tree/master/docs) allow easy extensibility
- Easy support for [validating custom formats](https://github.com/exegesis-js/exegesis/blob/master/docs/Options.md#customformats)

## Tutorial

Check out the tutorial [here](https://github.com/exegesis-js/exegesis/blob/master/docs/Tutorial.md).

## Usage

Calling `exegesisExpress.middleware(openApiFile, options)` will return a Promise
which resolves to a connect/express middleware (alternatively you can call
`exegesisExpress.middleware(openApiFile, options, done)`, if callbacks are your
thing).

`openApiFile` is either a path to your openapi.yaml or openapi.json file,
or it can be a JSON object with the contents of your OpenAPI document. This
should have the [`x-exegesis-controller`](https://github.com/exegesis-js/exegesis/blob/master/docs/OAS3%20Specification%20Extensions.md)
extension defined on any paths you want to be able to access.

`options` can be [anything you can pass to exegesis](https://github.com/exegesis-js/exegesis/blob/master/docs/Options.md). At a
minimum, you'll probably want to provide `options.controllers`, a path to where
your [controller modules](https://github.com/exegesis-js/exegesis/blob/master/docs/Exegesis%20Controllers.md)
can be found. If you have any security requirements defined, you'll also
want to pass in some [authenticators](https://github.com/exegesis-js/exegesis/blob/master/docs/OAS3%20Security.md).
To enable response validation, you'll want to provide a validation callback
function via [`onResponseValidationError()`](https://github.com/exegesis-js/exegesis/blob/master/docs/Options.md#onresponsevalidationerror).
Exegesis's functionality can also be extended using [plugins](https://github.com/exegesis-js/exegesis/tree/master/docs),
which run on every request. Plugins let you add functionality like
[role base authorization](https://github.com/exegesis-js/exegesis-plugin-roles),
or CORS.

## Where to put Exegesis-Express in your middleware stack

Exegesis-express should appear near the top of your middleware stack, before
any body parsers. This is because exegesis will take care of parsing the body
for you, and it can't do that if the body has already been read. If you put
a body parser ahead of exegesis-express, exegesis will try to use `req.body`
if it's there.

## Servers section

OpenAPI 3.x lets you specify what servers your API is available on. For example:

```yaml
servers:
  - url: "/api/v2"
```

By default, exegesis will take 'servers' into account when routing requests,
so if you have the above servers section, and a path in your API called
"/users", then exegesis will only match the route if the incoming requests has
the URL "/api/v2/users".

If you have path templates in your servers, the variables will be available to
your controllers via `context.params.server`.

If you specify the `ignoreServers` option, however, exegesis will ignore the
servers section, an route purely based on your paths. This lets you do
something like:

```js
const exegesisMiddleware = await exegesisExpress.middleware(
  path.resolve(__dirname, "./openapi.yaml"),
  { ignorePaths: true }
);
app.use("/api/v2", exegesisMiddleware);
```

which means non-api paths will not even be sent to the exegesis middleware.

## Example

```js
import express from "express";
import path from "path";
import http from "http";
import * as exegesisExpress from "exegesis-express";

async function createServer() {
  // See https://github.com/exegesis-js/exegesis/blob/master/docs/Options.md
  const options = {
    controllers: path.resolve(__dirname, "./controllers"),
  };

  const exegesisMiddleware = await exegesisExpress.middleware(
    path.resolve(__dirname, "./openapi.yaml"),
    options
  );

  const app = express();

  // If you have any body parsers, this should go before them.
  app.use(exegesisMiddleware);

  app.use((req, res) => {
    res.status(404).json({ message: `Not found` });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({ message: `Internal error: ${err.message}` });
  });

  const server = http.createServer(app);
  server.listen(3000);
}
```

---

Copyright 2018 Jason Walton

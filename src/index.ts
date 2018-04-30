import * as exegesis from 'exegesis';
export * from 'exegesis/lib/types/index';

/**
 * Returns a connect/express middleware function which implements the API.
 *
 * @param openApiDoc - A string, representing a path to the OpenAPI document,
 *   or a JSON object.
 * @param options - Options.  See docs/options.md
 * @returns - an express middleware function.
 */
function middleware(
    openApiDoc: string | exegesis.oas3.OpenAPIObject,
    options?: exegesis.ExegesisOptions
) : Promise<exegesis.MiddlewareFunction>;

/**
 * Returns a connect/express middleware function which implements the API.
 *
 * @param openApiDoc - A string, representing a path to the OpenAPI document,
 *   or a JSON object.
 * @param options - Options.  See docs/options.md
 * @param done - Callback.  Returns an express middleware function.
 */
function middleware(
    openApiDoc: string | exegesis.oas3.OpenAPIObject,
    options: exegesis.ExegesisOptions,
    done: exegesis.Callback<exegesis.MiddlewareFunction>
) : void;

function middleware(
    openApiDoc: string | exegesis.oas3.OpenAPIObject,
    options?: exegesis.ExegesisOptions,
    done?: exegesis.Callback<exegesis.MiddlewareFunction>
) {
    if(done) {
        return exegesis.compileApi(openApiDoc, options, done);
    } else {
        return exegesis.compileApi(openApiDoc, options);
    }
}

export {middleware};
export default middleware;
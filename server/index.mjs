import * as functions from '@google-cloud/functions-framework';
import { getRequestListener } from '@hono/node-server';
import { app } from './app.mjs';

const listener = getRequestListener(app.fetch);

functions.http('foundestraTravelApi', listener);
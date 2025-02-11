import { Application } from 'express';
import cors from 'cors';
import express from 'express';

const globalMiddlewares = [
    cors(),
    express.json(),
    express.urlencoded({ extended: true }),
];

const setupMiddlewares = (app: Application): void => {
    globalMiddlewares.forEach((middleware) => app.use(middleware));

    // load custom middlewares
};

export default setupMiddlewares;

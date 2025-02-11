import express, { Application } from 'express';
import routes from './api/routes';
import setupMiddlewares from "@api/middlewares";

const app: Application = express();

// Middlewares
setupMiddlewares(app)

// Mount routes
app.use('/api', routes);

export default app;

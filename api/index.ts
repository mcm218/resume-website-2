import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
//@ts-ignore
import prerender from 'prerender-node';
dotenv.config();

import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from "./drizzle/schema";
import { eq } from 'drizzle-orm';
import Mixpanel from 'mixpanel';
const mixpanel = Mixpanel.init("ae047a879c87a69536d31d54709bd365");

if (!process.env.TURSO_TOKEN || !process.env.TURSO_URL) {
    console.error('TURSO_TOKEN environment variable not set');
    process.exit(1);
}

const client = createClient({
    url: process.env.TURSO_URL,
    authToken: process.env.TURSO_TOKEN,
});

const db = drizzle(client, { schema });

const app = express();
app.use(prerender.set('prerenderToken', process.env.PRERENDER_TOKEN || ''));
Sentry.init({
    dsn: 'https://953f62f29e44de26fab8242656793fa5@o4506140418441216.ingest.sentry.io/4506140429516800',
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Sentry.Integrations.Express({ app }),
        new ProfilingIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0,
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Swagger setup can be added here if needed

app.use(express.json()); // For parsing application/json
app.use(cors());

// API Routes
app.get('/api', (_req: Request, res: Response) => {
    res.send('Hello from Express');
});

app.post('/api/mixpanel/:event', (req: Request, res: Response) => {
    try {
        const event = req.params.event;
        const data = req.body;
        console.log(event, data);
        mixpanel.track(event, data);
        res.send('OK');
    } catch(err) {
        console.error(err);
        res.status(500).send('Error sending event to Mixpanel');
    }
});

app.get('/api/resumes/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const existingResume = await db.query.resumes.findFirst({
            where: eq(schema.resumes.id, id),
        });

        if (!existingResume) {
            return res.status(404).send('Resume not found');
        }

        return res.json(existingResume);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving resume');
    }
});

app.use(Sentry.Handlers.errorHandler());

// Serve Angular app for all non-API routes
app.use(express.static(path.join(__dirname, '../../src/dist')));
app.get('/*', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../src/dist/index.html'));
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import admin from 'firebase-admin';
//@ts-ignore
import prerender from 'prerender-node';
dotenv.config();

import * as Sentry from "@sentry/node";
import { ProfilingIntegration } from "@sentry/profiling-node";


//@ts-ignore
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.error('FIREBASE_SERVICE_ACCOUNT environment variable not set');
    process.exit(1);
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
app.use(prerender.set('prerenderToken', process.env.PRERENDER_TOKEN || ''));
Sentry.init({
  dsn: 'https://bdf5ec4781fa15f23b0d2c70e355e408@o4506140418441216.ingest.sentry.io/4506215894876160',
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

app.get('/api/resumes/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const doc = await db.collection('resumes').doc(id).get();
        if (!doc.exists) {
            res.status(404).send('Resume not found');
        } else {
            res.json(doc.data());
        }
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

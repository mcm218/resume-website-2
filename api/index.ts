import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import admin from 'firebase-admin';
//@ts-ignore
import prerender from 'prerender-node';
dotenv.config();

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

// Swagger setup can be added here if needed

app.use(express.json()); // For parsing application/json
app.use(cors());

// Custom error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).send(err.message || 'Internal Server Error');
});

// API Routes
app.get('/api', (req: Request, res: Response) => {
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

// Serve Angular app for all non-API routes
app.use(express.static(path.join(__dirname, '../../src/dist')));
app.get('/*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../src/dist/index.html'));
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

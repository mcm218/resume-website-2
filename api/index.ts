import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import path from 'path';

//@ts-ignore
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
const dirname = path.dirname("../dist/resume-website/index.html");

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
app.get('/*', (req: Request, res: Response) => {
    res.sendFile(path.join(dirname, '../dist/resume-website/index.html'));
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});


import * as functions from 'firebase-functions';
import { admin, db } from './firebase';
import { createSession as createSessionLogic } from './sessions/createSession';
import { getSession as getSessionLogic } from './sessions/getSession';
import { updateSessionStatus as updateSessionStatusLogic } from './sessions/updateSessionStatus';
import { listSessions as listSessionsLogic } from './sessions/listSessions';
import { Session } from './types/session';
import { HttpError } from './utils/errors';
import { validateRegion, validateSessionStatus } from './utils/validation';

// Helper to convert Firestore data to Session object
const toSession = (doc: admin.firestore.DocumentSnapshot): Session | null => {
    const data = doc.data();
    if (!data) return null;
    return {
        sessionId: data.sessionId,
        region: data.region,
        status: data.status,
        createdAt: (data.createdAt as admin.firestore.Timestamp).toDate(),
        updatedAt: (data.updatedAt as admin.firestore.Timestamp).toDate(),
    };
};

const verifyAuth = async (req: functions.https.Request): Promise<void> => {
    // DEVELOPMENT ONLY: Allow bypassing auth in emulator OR with a specific demo token from env
    const demoToken = process.env.DEMO_TOKEN;
    if (process.env.FUNCTIONS_EMULATOR === 'true' || (demoToken && req.headers.authorization === `Bearer ${demoToken}`)) {
        console.warn('Auth verification skipped (Emulator or Demo Token used).');
        return;
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new HttpError(401, 'Unauthorized: Check Authorization header');
    }
    const token = authHeader.split('Bearer ')[1];
    try {
        await admin.auth().verifyIdToken(token);
    } catch (err) {
        throw new HttpError(401, 'Unauthorized: Invalid token');
    }
};

const handleRequest = async (req: functions.https.Request, res: any, handler: () => Promise<any>) => {
    try {
        await verifyAuth(req);
        const result = await handler();
        res.status(200).json(result);
    } catch (err) {
        if (err instanceof HttpError) {
            res.status(err.statusCode).send(err.message);
        } else if (err instanceof Error) {
            // Check for standard errors that should be mapped to 400/404 if logic threw them directly
            // But logic throws using utils/errors which return HttpError items (which inherit from Error)
            // HttpError check above handles it.
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            console.error(err);
            res.status(500).send('Unknown Error');
        }
    }
};

export const createSession = functions.https.onRequest(async (req, res) => {
    await handleRequest(req, res, async () => {
        if (req.method !== 'POST') throw new HttpError(405, 'Method Not Allowed');

        // Call logic
        const session = createSessionLogic({ region: req.body.region });

        // Write to Firestore
        await db.collection('sessions').doc(session.sessionId).set(session);

        return session;
    });
});

export const getSession = functions.https.onRequest(async (req, res) => {
    await handleRequest(req, res, async () => {
        if (req.method !== 'GET') throw new HttpError(405, 'Method Not Allowed');

        const sessionId = req.query.sessionId as string;

        // Pre-fetch data
        if (!sessionId) {
            // Let logic handle validation or throw here? Logic expects string. 
            // If unknown, let's pass it. Logic checks for string type.
        }

        // We fetch if ID is string
        let cachedSession: Session | null = null;
        if (typeof sessionId === 'string') {
            const doc = await db.collection('sessions').doc(sessionId).get();
            cachedSession = toSession(doc);
        }

        return getSessionLogic(sessionId, (id) => {
            // Verification that id matches logic call is implicit as we are in the closure
            return cachedSession;
        });
    });
});

export const updateSessionStatus = functions.https.onRequest(async (req, res) => {
    await handleRequest(req, res, async () => {
        if (req.method !== 'PUT' && req.method !== 'POST') throw new HttpError(405, 'Method Not Allowed');

        const { sessionId, status } = req.body;

        // Pre-fetch
        let currentSession: Session | null = null;
        let docRef: admin.firestore.DocumentReference | null = null;

        if (typeof sessionId === 'string') {
            docRef = db.collection('sessions').doc(sessionId);
            const doc = await docRef.get();
            currentSession = toSession(doc);
        }

        let updatedSession: Session | null = null;

        const result = updateSessionStatusLogic(sessionId, status, (id, newStatus, updatedAt) => {
            if (!currentSession) return null;

            // Logic expects us to update and return.
            // We update in memory to return to logic.
            const nextSession = { ...currentSession, status: newStatus, updatedAt };
            updatedSession = nextSession;
            return nextSession;
        });

        // If successful, save to Firestore
        // Logic throws if not found, so if we reach here, result is valid.
        if (updatedSession && docRef) {
            await docRef.set(updatedSession);
        }

        return result;
    });
});

export const listSessions = functions.https.onRequest(async (req, res) => {
    await handleRequest(req, res, async () => {
        if (req.method !== 'GET') throw new HttpError(405, 'Method Not Allowed');

        const { region, status } = req.query;

        // Build query using validation helper logic (manually or via imports)
        let query: admin.firestore.Query = db.collection('sessions');

        if (status !== undefined) {
            // Logic uses validateSessionStatus, which throws if invalid.
            const validStatus = validateSessionStatus(status);
            query = query.where('status', '==', validStatus);
        }

        if (region !== undefined) {
            const validRegion = validateRegion(region);
            query = query.where('region', '==', validRegion);
        }

        const snapshot = await query.get();
        const results: Session[] = snapshot.docs
            .map(d => toSession(d))
            .filter((s): s is Session => s !== null);

        // Pass to logic for final filtering
        return listSessionsLogic({ status, region }, () => results);
    });
});

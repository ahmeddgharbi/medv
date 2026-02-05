import { Session, SessionStatus } from '../types/session';
import { badRequest, notFound } from '../utils/errors';
import { validateSessionStatus } from '../utils/validation';

export const updateSessionStatus = (
    sessionId: unknown,
    status: unknown,
    updater: (id: string, status: SessionStatus, updatedAt: Date) => Session | null
): Session => {
    if (typeof sessionId !== 'string' || sessionId.trim() === '') {
        throw badRequest('Session ID must be a non-empty string');
    }

    const validStatus = validateSessionStatus(status);
    const updatedAt = new Date();

    const session = updater(sessionId, validStatus, updatedAt);

    if (!session) {
        throw notFound(`Session not found: ${sessionId}`);
    }

    return session;
};

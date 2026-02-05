import { Session } from '../types/session';
import { badRequest, notFound } from '../utils/errors';

export const getSession = (
    sessionId: unknown,
    fetcher: (id: string) => Session | null
): Session => {
    if (typeof sessionId !== 'string' || sessionId.trim() === '') {
        throw badRequest('Session ID must be a non-empty string');
    }

    const session = fetcher(sessionId);

    if (!session) {
        throw notFound(`Session not found: ${sessionId}`);
    }

    return session;
};

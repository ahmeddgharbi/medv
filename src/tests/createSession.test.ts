import { createSession } from '../sessions/createSession';
import { SessionStatus } from '../types/session';
import { HttpError } from '../utils/errors';

describe('createSession', () => {
    it('should create a new session with valid region', () => {
        const input = { region: 'us-central1' };
        const session = createSession(input);

        expect(session).toBeDefined();
        expect(session.sessionId).toBeDefined();
        expect(typeof session.sessionId).toBe('string');
        expect(session.region).toBe('us-central1');
        expect(session.status).toBe(SessionStatus.pending);
        expect(session.createdAt).toBeInstanceOf(Date);
        expect(session.updatedAt).toBeInstanceOf(Date);
    });

    it('should throw error if region is missing', () => {
        const input = {};
        expect(() => createSession(input as any)).toThrow(HttpError);
        expect(() => createSession(input as any)).toThrow('Region must be a non-empty string');
    });

    it('should throw error if region is empty', () => {
        const input = { region: '' };
        expect(() => createSession(input)).toThrow(HttpError);
    });
});

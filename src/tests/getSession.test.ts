import { getSession } from '../sessions/getSession';
import { Session, SessionStatus } from '../types/session';
import { HttpError } from '../utils/errors';

describe('getSession', () => {
    const mockSession: Session = {
        sessionId: 'test-session-id',
        region: 'us-east',
        status: SessionStatus.pending,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    it('should return session if found', () => {
        const mockFetcher = jest.fn().mockReturnValue(mockSession);
        const session = getSession('test-session-id', mockFetcher);

        expect(session).toEqual(mockSession);
        expect(mockFetcher).toHaveBeenCalledWith('test-session-id');
    });

    it('should throw Not Found error if session does not exist', () => {
        const mockFetcher = jest.fn().mockReturnValue(null);

        expect(() => getSession('test-session-id', mockFetcher))
            .toThrow(HttpError);

        expect(() => getSession('test-session-id', mockFetcher))
            .toThrow('Session not found');
    });

    it('should throw error if sessionId is missing', () => {
        // @ts-ignore
        expect(() => getSession(null, jest.fn()))
            .toThrow(HttpError);
    });
});


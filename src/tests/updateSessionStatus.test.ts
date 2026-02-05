import { updateSessionStatus } from '../sessions/updateSessionStatus';
import { SessionStatus, Session } from '../types/session';
import { HttpError } from '../utils/errors';

describe('updateSessionStatus', () => {
    const mockSession: Session = {
        sessionId: 'test-session-id',
        region: 'us-central1',
        status: SessionStatus.pending,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    it('should update session status successfully', () => {
        const updater = jest.fn((id, status, updatedAt) => ({
            ...mockSession,
            status,
            updatedAt,
        }));

        const result = updateSessionStatus('test-session-id', 'active', updater);

        expect(updater).toHaveBeenCalledTimes(1);
        expect(updater).toHaveBeenCalledWith(
            'test-session-id',
            SessionStatus.active,
            expect.any(Date)
        );
        expect(result.status).toBe(SessionStatus.active);
    });

    it('should throw error if session ID is invalid', () => {
        const updater = jest.fn();
        expect(() => updateSessionStatus('', 'active', updater)).toThrow(HttpError);
        expect(updater).not.toHaveBeenCalled();
    });

    it('should throw error if status is invalid', () => {
        const updater = jest.fn();
        expect(() => updateSessionStatus('id', 'invalid-status', updater)).toThrow(
            HttpError
        );
        expect(updater).not.toHaveBeenCalled();
    });

    it('should throw not found error if updater returns null', () => {
        const updater = jest.fn().mockReturnValue(null);
        expect(() => updateSessionStatus('id', 'active', updater)).toThrow(HttpError);
        expect(() => updateSessionStatus('id', 'active', updater)).toThrow(
            'Session not found'
        );
    });
});

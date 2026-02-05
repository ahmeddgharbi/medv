import { listSessions } from '../sessions/listSessions';
import { Session, SessionStatus } from '../types/session';
import { HttpError } from '../utils/errors';

describe('listSessions', () => {
    const mockSessions: Session[] = [
        {
            sessionId: 's1',
            region: 'us-east',
            status: SessionStatus.pending,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            sessionId: 's2',
            region: 'eu-west',
            status: SessionStatus.completed,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ];

    it('should return all sessions if no filters provided', () => {
        const mockFetcher = jest.fn().mockReturnValue(mockSessions);
        const result = listSessions({}, mockFetcher);

        expect(result).toHaveLength(2);
        expect(mockFetcher).toHaveBeenCalledWith({});
    });

    it('should pass filters to fetcher', () => {
        const mockFetcher = jest.fn().mockReturnValue([]);
        const filters = { region: 'us-east', status: SessionStatus.pending };

        listSessions(filters, mockFetcher);

        expect(mockFetcher).toHaveBeenCalledWith(filters);
    });

    it('should throw error if invalid status provided', () => {
        const mockFetcher = jest.fn();
        const filters = { status: 'invalid-status' as any };

        expect(() => listSessions(filters, mockFetcher))
            .toThrow(HttpError);

        expect(mockFetcher).not.toHaveBeenCalled();
    });

    it('should throw error if region is empty', () => {
        const mockFetcher = jest.fn();
        const filters = { region: '' };

        expect(() => listSessions(filters, mockFetcher))
            .toThrow(HttpError);

        expect(mockFetcher).not.toHaveBeenCalled();
    });
});

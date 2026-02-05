import { SessionStatus } from '../types/session';
import { badRequest } from './errors';

export const validateRegion = (value: unknown): string => {
    if (typeof value !== 'string' || value.trim() === '') {
        throw badRequest('Region must be a non-empty string');
    }
    return value.trim();
};

export const validateSessionStatus = (value: unknown): SessionStatus => {
    if (typeof value !== 'string') {
        throw badRequest('Session status must be a string');
    }

    const isValidStatus = Object.values(SessionStatus).includes(value as SessionStatus);

    if (!isValidStatus) {
        throw badRequest(`Invalid session status: ${value}`);
    }

    return value as SessionStatus;
};

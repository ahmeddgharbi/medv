import * as crypto from 'crypto';
import { Session, SessionStatus } from '../types/session';
import { validateRegion } from '../utils/validation';

export const createSession = (input: { region: unknown }): Session => {
    const region = validateRegion(input.region);

    const now = new Date();

    return {
        sessionId: crypto.randomUUID(),
        region,
        status: SessionStatus.pending,
        createdAt: now,
        updatedAt: now,
    };
};

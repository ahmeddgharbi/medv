import { Session, SessionStatus } from '../types/session';
import { validateRegion, validateSessionStatus } from '../utils/validation';

export const listSessions = (
    filters: { status?: unknown; region?: unknown },
    fetcher: (filters: { status?: SessionStatus; region?: string }) => Session[]
): Session[] => {
    let status: SessionStatus | undefined;
    let region: string | undefined;

    if (filters.status !== undefined) {
        status = validateSessionStatus(filters.status);
    }

    if (filters.region !== undefined) {
        region = validateRegion(filters.region);
    }

    return fetcher({ status, region });
};

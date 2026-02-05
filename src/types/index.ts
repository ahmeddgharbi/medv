export enum SessionStatus {
    pending = 'pending',
    active = 'active',
    completed = 'completed',
    failed = 'failed',
}

export interface Session {
    sessionId: string;
    region: string;
    status: SessionStatus;
    createdAt: Date;
    updatedAt: Date;
}

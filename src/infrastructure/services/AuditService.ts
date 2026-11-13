import type { RecordActivityUseCase, RecordActivityRequest } from '@application/use-cases/Audit/RecordActivityUseCase.js';

export class AuditService {
    constructor(private readonly recordActivityUseCase: RecordActivityUseCase) {}

    async logActivity(data: RecordActivityRequest): Promise<void> {
        try {
            await this.recordActivityUseCase.execute(data);
        } catch (err) {
            // Audit failures should not crash the main business request
            console.error('[AuditService] Failed to record activity log:', err);
        }
    }
}

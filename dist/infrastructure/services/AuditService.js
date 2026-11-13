export class AuditService {
    recordActivityUseCase;
    constructor(recordActivityUseCase) {
        this.recordActivityUseCase = recordActivityUseCase;
    }
    async logActivity(data) {
        try {
            await this.recordActivityUseCase.execute(data);
        }
        catch (err) {
            // Audit failures should not crash the main business request
            console.error('[AuditService] Failed to record activity log:', err);
        }
    }
}

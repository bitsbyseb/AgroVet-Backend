import type { Context, Next } from 'hono';
import type { AuditService } from '@infrastructure/services/AuditService.js';
import type { AuditAction } from '@domain/entities/AuditLog.js';

export function createAuditMiddleware(auditService: AuditService) {
    return async (c: Context, next: Next) => {
        const method = c.req.method;

        // Only monitor mutating operations (POST, PUT, PATCH, DELETE)
        if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
            await next();
            return;
        }

        const path = c.req.path;
        // Do not self-audit query calls to the audit log itself
        if (path.includes('/audit')) {
            await next();
            return;
        }

        const payload = c.get('jwtPayload') as {
            sub?: string;
            id?: string;
            email?: string;
            role?: string;
        } | undefined;

        const userId = payload?.sub || payload?.id || null;
        const userEmail = payload?.email || null;
        const userRole = payload?.role || null;
        const ipAddress = c.req.header('x-forwarded-for')?.split(',')[0].trim() || c.req.header('x-real-ip') || null;

        let action: AuditAction = 'CREATE';
        if (method === 'PUT' || method === 'PATCH') {
            action = path.includes('/transfer') ? 'TRANSFER' : 'UPDATE';
        } else if (method === 'DELETE') {
            action = 'DELETE';
        }

        const resource = extractResourceFromPath(path);
        const resourceId = c.req.param('id') || null;

        let status: 'SUCCESS' | 'FAILURE' = 'SUCCESS';
        let errorDetails: string | null = null;

        try {
            await next();
            if (c.res && c.res.status >= 400) {
                status = 'FAILURE';
            }
        } catch (err: any) {
            status = 'FAILURE';
            errorDetails = err?.message || 'Error occurred';
            throw err;
        } finally {
            // Non-blocking activity recording
            auditService.logActivity({
                userId,
                userEmail,
                userRole,
                action,
                resource,
                resourceId,
                ipAddress,
                status,
                details: errorDetails ? { error: errorDetails } : { path, method, statusCode: c.res?.status }
            }).catch(() => {});
        }
    };
}

function extractResourceFromPath(path: string): string {
    const clean = path.replace(/^\/api\/v1\//, '').replace(/^\//, '');
    const segments = clean.split('/');
    const first = segments[0] || 'GENERAL';

    const map: Record<string, string> = {
        animals: 'ANIMAL',
        owners: 'OWNER',
        owner: 'OWNER',
        'medical-histories': 'MEDICAL_HISTORY',
        'medical-history': 'MEDICAL_HISTORY',
        vaccines: 'VACCINATION',
        appointments: 'APPOINTMENT',
        foods: 'FOOD',
        diet: 'ALIMENTATION',
        paddocks: 'PADDOCK',
        grazing: 'GRAZING',
        alerts: 'ALERT',
        reproduction: 'REPRODUCTION',
        production: 'PRODUCTION',
        auth: 'AUTH'
    };

    return map[first] || first.toUpperCase();
}

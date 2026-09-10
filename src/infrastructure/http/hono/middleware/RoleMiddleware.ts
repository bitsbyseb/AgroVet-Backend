import type { Context, Next } from 'hono';
import { jwt } from 'hono/jwt';
import { UserRole } from '@domain/entities/User.js';

const { JWT_SECRET } = process.env;

export const authMiddleware = jwt({
    secret: JWT_SECRET,
    alg: 'HS256'
});

type Resource = 'animales' | 'historial_medico' | 'vacunas' | 'consultas_veterinarias' | 'datos_productivos' | 'alimentacion' | 'reproduccion' | 'propietarios' | 'usuarios' | 'potreros';

const permissions: Record<Resource, { full: UserRole[], readOnly: UserRole[] }> = {
    animales: {
        full: [UserRole.VETERINARIAN, UserRole.ZOOTECHNICIAN, UserRole.ADMIN],
        readOnly: []
    },
    historial_medico: {
        full: [UserRole.VETERINARIAN],
        readOnly: [UserRole.ZOOTECHNICIAN, UserRole.ADMIN]
    },
    vacunas: {
        full: [UserRole.VETERINARIAN],
        readOnly: [UserRole.ZOOTECHNICIAN, UserRole.ADMIN]
    },
    consultas_veterinarias: {
        full: [UserRole.VETERINARIAN],
        readOnly: [UserRole.ADMIN]
    },
    datos_productivos: {
        full: [UserRole.ZOOTECHNICIAN],
        readOnly: [UserRole.VETERINARIAN, UserRole.ADMIN]
    },
    alimentacion: {
        full: [UserRole.ZOOTECHNICIAN],
        readOnly: [UserRole.ADMIN]
    },
    reproduccion: {
        full: [UserRole.ZOOTECHNICIAN],
        readOnly: [UserRole.ADMIN]
    },
    potreros: {
        full: [UserRole.ZOOTECHNICIAN, UserRole.ADMIN],
        readOnly: [UserRole.VETERINARIAN]
    },
    propietarios: {
        full: [UserRole.ADMIN],
        readOnly: [UserRole.VETERINARIAN]
    },
    usuarios: {
        full: [UserRole.ADMIN],
        readOnly: []
    }
};

export const rbacMiddleware = (resource: Resource) => {
    return async (c: Context, next: Next) => {
        const payload = c.get('jwtPayload') as {
            iat: number;
            exp: number;
            sub: string;
            role: string;
        };
        if (!payload) {
            return c.json({ message: 'Unauthorized: Missing JWT payload' }, 401);
        }

        const userRole = payload.role as UserRole;
        const method = c.req.method;
        const resPermissions = permissions[resource];

        if (!resPermissions) {
            return c.json({ message: 'Internal Server Error: Resource not defined in permissions' }, 500);
        }

        // Full access roles can do anything
        if (resPermissions.full.includes(userRole)) {
            await next();
            return;
        }

        // Read-only roles can only perform GET requests
        if (resPermissions.readOnly.includes(userRole) && method === 'GET') {
            await next();
            return;
        }

        return c.json({ message: 'Forbidden: You do not have permission to perform this action' }, 403);
    };
};

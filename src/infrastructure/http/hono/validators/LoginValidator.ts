import { z } from "@hono/zod-openapi";

export const loginSchema = z.object({
    email: z.email().openapi({
        example: 'admin@agrovet.com',
        description: 'Email del usuario'
    }),
    password: z.string().min(10).openapi({
        example: 'admin123456',
        description: 'Contraseña del usuario (mínimo 10 caracteres)'
    })
}).openapi('LoginRequest');

export const loginResponseSchema = z.object({
    token: z.string().openapi({
        description: 'JWT Token de acceso'
    })
}).openapi('LoginResponse');

export const errorResponseSchema = z.object({
    error: z.string().openapi({
        description: 'Mensaje de error'
    }),
    errors: z.array(z.string()).optional().openapi({
        description: 'Lista de errores de validación'
    })
}).openapi('ErrorResponse');

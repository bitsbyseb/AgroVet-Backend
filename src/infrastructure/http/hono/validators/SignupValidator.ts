import { z } from "@hono/zod-openapi";
import { UserRole } from "@domain/entities/User.js";

export const signupSchema = z.object({
    username: z.string().min(3).openapi({
        example: 'johndoe',
        description: 'Nombre de usuario'
    }),
    email: z.string().email().openapi({
        example: 'john@agrovet.com',
        description: 'Email único'
    }),
    password: z.string().min(10).openapi({
        example: 'password123',
        description: 'Contraseña segura'
    }),
    role: z.enum([UserRole.VETERINARIAN, UserRole.ZOOTECHNICIAN, UserRole.OWNER]).openapi({
        example: UserRole.VETERINARIAN,
        description: 'Rol asignado al usuario (Veterinario, Zootecnista o Propietario. No se permite crear administradores)'
    }),
    ownerData: z.object({
        name: z.string().optional(),
        document: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        ownerType: z.enum(['urban', 'rural']).optional(),
    }).optional().openapi({
        description: 'Datos del perfil de propietario (cuando role es OWNER)'
    })
}).openapi('SignupRequest');

export const signupResponseSchema = z.object({
    message: z.string().openapi({
        example: 'User registered successfully'
    })
}).openapi('SignupResponse');

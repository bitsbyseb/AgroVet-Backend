import { z } from "@hono/zod-openapi";
import { UserRole } from "../../../../domain/entities/User.js";
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
    role: z.enum([UserRole.VETERINARIAN, UserRole.ZOOTECHNICIAN]).openapi({
        example: UserRole.VETERINARIAN,
        description: 'Rol asignado al usuario (No se permite crear administradores)'
    })
}).openapi('SignupRequest');
export const signupResponseSchema = z.object({
    message: z.string().openapi({
        example: 'User registered successfully'
    })
}).openapi('SignupResponse');

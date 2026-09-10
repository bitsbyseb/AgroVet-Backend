import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { AuthController } from '../controllers/AuthController.js';
import { signupSchema, signupResponseSchema } from '../validators/SignupValidator.js';
import { loginSchema, loginResponseSchema, errorResponseSchema } from '../validators/LoginValidator.js';
import { authMiddleware, rbacMiddleware } from '../middleware/RoleMiddleware.js';
export function createAuthRouter(authController) {
    const router = new OpenAPIHono();
    const loginRoute = createRoute({
        method: 'post',
        path: '/login',
        summary: 'Login de usuario',
        description: 'Autentica a un usuario y devuelve un token JWT.',
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: loginSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                content: {
                    'application/json': {
                        schema: loginResponseSchema,
                    },
                },
                description: 'Login exitoso',
            },
            401: {
                content: {
                    'application/json': {
                        schema: errorResponseSchema,
                    },
                },
                description: 'Credenciales inválidas',
            },
        },
        tags: ['Autenticación'],
    });
    const signupRoute = createRoute({
        method: 'post',
        path: '/signup',
        summary: 'Registro de nuevo usuario',
        description: 'Registra un nuevo usuario en el sistema. Requiere privilegios de ADMINISTRADOR.',
        security: [{ Bearer: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: signupSchema,
                    },
                },
            },
        },
        responses: {
            201: {
                content: {
                    'application/json': {
                        schema: signupResponseSchema,
                    },
                },
                description: 'Usuario registrado correctamente',
            },
            400: {
                content: {
                    'application/json': {
                        schema: errorResponseSchema,
                    },
                },
                description: 'Datos de registro inválidos',
            },
            403: {
                content: {
                    'application/json': {
                        schema: errorResponseSchema,
                    },
                },
                description: 'Permisos insuficientes (No es administrador)',
            },
        },
        tags: ['Autenticación'],
    });
    router.openapi(loginRoute, (c) => authController.login(c));
    router.use('/signup', authMiddleware);
    router.use('/signup', rbacMiddleware('usuarios'));
    router.openapi(signupRoute, (c) => authController.signup(c));
    return router;
}

import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { AnimalController } from '../controllers/AnimalController.js';
import { animalSchema, updateAnimalSchema, transferAnimalSchema, animalResponseSchema, animalListResponseSchema } from '../validators/AnimalValidator.js';
import { medicalHistorySchema, medicalHistoryResponseSchema } from '../validators/MedicalHistoryValidator.js';
import { vaccinationSchema, vaccinationResponseSchema } from '../validators/VaccinationValidator.js';
import { MedicalHistoryController } from '../controllers/MedicalHistoryController.js';
import { VaccinationController } from '../controllers/VaccinationController.js';
import { AlimentationController } from '../controllers/AlimentationController.js';
import { ProductionController } from '../controllers/ProductionController.js';
import { ReproductionController } from '../controllers/ReproductionController.js';
import { alimentationSchema, alimentationResponseSchema } from '../validators/AlimentationValidator.js';
import { productionSchema, productionResponseSchema } from '../validators/ProductionValidator.js';
import { reproductionSchema, reproductionResponseSchema } from '../validators/ReproductionValidator.js';
import { authMiddleware, rbacMiddleware } from '../middleware/RoleMiddleware.js';
import { errorResponseSchema } from '../validators/LoginValidator.js';

export function createAnimalRouter(
    animalController: AnimalController,
    medicalHistoryController: MedicalHistoryController,
    vaccinationController: VaccinationController,
    alimentationController: AlimentationController,
    productionController: ProductionController,
    reproductionController: ReproductionController
) {
    const router = new OpenAPIHono();

    router.use('*', authMiddleware);

    const listAnimalsRoute = createRoute({
        method: 'get',
        path: '/',
        summary: 'Listar todos los animales',
        security: [{ Bearer: [] }],
        responses: {
            200: { content: { 'application/json': { schema: animalListResponseSchema } }, description: 'Lista de animales' }
        },
        tags: ['Animales']
    });

    const registerAnimalRoute = createRoute({
        method: 'post',
        path: '/',
        summary: 'Registrar un nuevo animal',
        security: [{ Bearer: [] }],
        request: { body: { content: { 'application/json': { schema: animalSchema } } } },
        responses: {
            201: { content: { 'application/json': { schema: z.object({ message: z.string() }) } }, description: 'Animal registrado' },
            400: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Error en registro' }
        },
        tags: ['Animales']
    });

    const getAnimalRoute = createRoute({
        method: 'get',
        path: '/{id}',
        summary: 'Obtener animal por ID',
        security: [{ Bearer: [] }],
        request: { params: z.object({ id: z.string().openapi({ example: 'uuid-123' }) }) },
        responses: {
            200: { content: { 'application/json': { schema: animalResponseSchema } }, description: 'Detalle del animal' },
            404: { description: 'Animal no encontrado' }
        },
        tags: ['Animales']
    });

    const updateAnimalRoute = createRoute({
        method: 'put',
        path: '/{id}',
        summary: 'Actualizar animal',
        security: [{ Bearer: [] }],
        request: { 
            params: z.object({ id: z.string() }),
            body: { content: { 'application/json': { schema: updateAnimalSchema } } } 
        },
        responses: {
            200: { content: { 'application/json': { schema: z.object({ message: z.string() }) } }, description: 'Animal actualizado' }
        },
        tags: ['Animales']
    });

    const deleteAnimalRoute = createRoute({
        method: 'delete',
        path: '/{id}',
        summary: 'Eliminar animal',
        security: [{ Bearer: [] }],
        request: { params: z.object({ id: z.string() }) },
        responses: {
            200: { content: { 'application/json': { schema: z.object({ message: z.string() }) } }, description: 'Animal eliminado' }
        },
        tags: ['Animales']
    });

    const transferAnimalRoute = createRoute({
        method: 'patch',
        path: '/{id}/transfer',
        summary: 'Transferir propiedad del animal',
        security: [{ Bearer: [] }],
        request: { 
            params: z.object({ id: z.string() }),
            body: { content: { 'application/json': { schema: transferAnimalSchema } } } 
        },
        responses: {
            200: { content: { 'application/json': { schema: z.object({ message: z.string() }) } }, description: 'Transferencia exitosa' }
        },
        tags: ['Animales']
    });

    // Clinical Routes
    const getHistoryRoute = createRoute({
        method: 'get',
        path: '/{id}/history',
        summary: 'Obtener historial médico del animal',
        security: [{ Bearer: [] }],
        request: { params: z.object({ id: z.string() }) },
        responses: {
            200: { content: { 'application/json': { schema: z.array(medicalHistoryResponseSchema) } }, description: 'Historial médico' }
        },
        tags: ['Clínica']
    });

    const postHistoryRoute = createRoute({
        method: 'post',
        path: '/{id}/history',
        summary: 'Registrar evento médico',
        security: [{ Bearer: [] }],
        request: { 
            params: z.object({ id: z.string() }),
            body: { content: { 'application/json': { schema: medicalHistorySchema } } }
        },
        responses: {
            201: { content: { 'application/json': { schema: z.object({ message: z.string() }) } }, description: 'Evento registrado' }
        },
        tags: ['Clínica']
    });

    // Diet Routes
    const getDietRoute = createRoute({
        method: 'get',
        path: '/{id}/diet',
        summary: 'Obtener dieta actual',
        security: [{ Bearer: [] }],
        request: { params: z.object({ id: z.string() }) },
        responses: {
            200: { content: { 'application/json': { schema: alimentationResponseSchema } }, description: 'Datos de alimentación' }
        },
        tags: ['Alimentación']
    });

    const postDietRoute = createRoute({
        method: 'post',
        path: '/{id}/diet',
        summary: 'Registrar alimentación',
        security: [{ Bearer: [] }],
        request: { 
            params: z.object({ id: z.string() }),
            body: { content: { 'application/json': { schema: alimentationSchema } } }
        },
        responses: {
            201: { content: { 'application/json': { schema: z.object({ message: z.string() }) } }, description: 'Alimentación registrada' }
        },
        tags: ['Alimentación']
    });

    // Vaccines Routes
    const getVaccinesRoute = createRoute({
        method: 'get',
        path: '/{id}/vaccines',
        summary: 'Obtener vacunas del animal',
        security: [{ Bearer: [] }],
        request: { params: z.object({ id: z.string() }) },
        responses: {
            200: { content: { 'application/json': { schema: z.array(vaccinationResponseSchema) } }, description: 'Lista de vacunas' }
        },
        tags: ['Vacunas']
    });

    const postVaccineRoute = createRoute({
        method: 'post',
        path: '/{id}/vaccines',
        summary: 'Registrar vacunación',
        security: [{ Bearer: [] }],
        request: { 
            params: z.object({ id: z.string() }),
            body: { content: { 'application/json': { schema: vaccinationSchema } } }
        },
        responses: {
            201: { content: { 'application/json': { schema: z.object({ message: z.string() }) } }, description: 'Vacuna registrada' }
        },
        tags: ['Vacunas']
    });

    // Production Routes
    const getProductionRoute = createRoute({
        method: 'get',
        path: '/{id}/production',
        summary: 'Obtener datos de producción del animal',
        security: [{ Bearer: [] }],
        request: { params: z.object({ id: z.string() }) },
        responses: {
            200: { content: { 'application/json': { schema: z.array(productionResponseSchema) } }, description: 'Registros de producción' }
        },
        tags: ['Producción']
    });

    const postProductionRoute = createRoute({
        method: 'post',
        path: '/{id}/production',
        summary: 'Registrar dato de producción',
        security: [{ Bearer: [] }],
        request: { 
            params: z.object({ id: z.string() }),
            body: { content: { 'application/json': { schema: productionSchema } } }
        },
        responses: {
            201: { content: { 'application/json': { schema: z.object({ message: z.string() }) } }, description: 'Dato registrado' }
        },
        tags: ['Producción']
    });

    // Reproduction Routes
    const getReproductionRoute = createRoute({
        method: 'get',
        path: '/{id}/reproduction',
        summary: 'Obtener eventos reproductivos',
        security: [{ Bearer: [] }],
        request: { params: z.object({ id: z.string() }) },
        responses: {
            200: { content: { 'application/json': { schema: z.array(reproductionResponseSchema) } }, description: 'Eventos reproductivos' }
        },
        tags: ['Reproducción']
    });

    const postReproductionRoute = createRoute({
        method: 'post',
        path: '/{id}/reproduction',
        summary: 'Registrar evento reproductivo',
        security: [{ Bearer: [] }],
        request: { 
            params: z.object({ id: z.string() }),
            body: { content: { 'application/json': { schema: reproductionSchema } } }
        },
        responses: {
            201: { content: { 'application/json': { schema: z.object({ message: z.string() }) } }, description: 'Evento registrado' }
        },
        tags: ['Reproducción']
    });

    // Implementation
    router.use('/', rbacMiddleware('animales'));
    router.use('/:id', rbacMiddleware('animales'));
    router.use('/:id/transfer', rbacMiddleware('animales'));
    router.use('/:id/history', rbacMiddleware('historial_medico'));
    router.use('/:id/vaccines', rbacMiddleware('vacunas'));
    router.use('/:id/diet', rbacMiddleware('alimentacion'));
    router.use('/:id/production', rbacMiddleware('datos_productivos'));
    router.use('/:id/reproduction', rbacMiddleware('reproduccion'));

    router.openapi(listAnimalsRoute, (c) => animalController.list(c));
    router.openapi(registerAnimalRoute, (c) => animalController.register(c));
    router.openapi(getAnimalRoute, (c) => animalController.getById(c));
    router.openapi(updateAnimalRoute, (c) => animalController.update(c));
    router.openapi(deleteAnimalRoute, (c) => animalController.delete(c));
    router.openapi(transferAnimalRoute, (c) => animalController.transfer(c));

    router.openapi(getHistoryRoute, (c) => medicalHistoryController.listByAnimal(c));
    router.openapi(postHistoryRoute, (c) => medicalHistoryController.register(c));
    
    router.openapi(getVaccinesRoute, (c) => vaccinationController.listByAnimal(c));
    router.openapi(postVaccineRoute, (c) => vaccinationController.register(c));
    
    router.openapi(getDietRoute, (c) => alimentationController.getDiet(c));
    router.openapi(postDietRoute, (c) => alimentationController.register(c));
    
    router.openapi(getProductionRoute, (c) => productionController.getProduction(c));
    router.openapi(postProductionRoute, (c) => productionController.register(c));
    
    router.openapi(getReproductionRoute, (c) => reproductionController.getReproduction(c));
    router.openapi(postReproductionRoute, (c) => reproductionController.register(c));

    return router;
}

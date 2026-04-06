import { Hono } from 'hono';
import { AnimalController } from '../controllers/AnimalController.js';
import { animalValidator, transferAnimalValidator, updateAnimalValidator } from '../validators/AnimalValidator.js';
import { medicalHistoryValidator } from '../validators/MedicalHistoryValidator.js';
import { vaccinationValidator } from '../validators/VaccinationValidator.js';
import { MedicalHistoryController } from '../controllers/MedicalHistoryController.js';
import { VaccinationController } from '../controllers/VaccinationController.js';
import { AlimentationController } from '../controllers/AlimentationController.js';
import { ProductionController } from '../controllers/ProductionController.js';
import { ReproductionController } from '../controllers/ReproductionController.js';
import { alimentationValidator } from '../validators/AlimentationValidator.js';
import { productionValidator } from '../validators/ProductionValidator.js';
import { reproductionValidator } from '../validators/ReproductionValidator.js';
import { authMiddleware, rbacMiddleware } from '../middleware/RoleMiddleware.js';

export function createAnimalRouter(
    animalController: AnimalController,
    medicalHistoryController: MedicalHistoryController,
    vaccinationController: VaccinationController,
    alimentationController: AlimentationController,
    productionController: ProductionController,
    reproductionController: ReproductionController
) {
    const router = new Hono();

    router.use('*', authMiddleware);

    router.get('/', rbacMiddleware('animales'), (c) => animalController.list(c));
    router.post('/', rbacMiddleware('animales'), animalValidator, (c) => animalController.register(c));
    router.get('/:id', rbacMiddleware('animales'), (c) => animalController.getById(c));
    router.put('/:id', rbacMiddleware('animales'), updateAnimalValidator, (c) => animalController.update(c));
    router.delete('/:id', rbacMiddleware('animales'), (c) => animalController.delete(c));
    router.patch('/:id/transfer', rbacMiddleware('animales'), transferAnimalValidator, (c) => animalController.transfer(c));

    // Clinical Management
    router.get('/:id/history', rbacMiddleware('historial_medico'), (c) => medicalHistoryController.listByAnimal(c));
    router.post('/:id/history', rbacMiddleware('historial_medico'), medicalHistoryValidator, (c) => medicalHistoryController.register(c));
    router.get('/:id/vaccines', rbacMiddleware('vacunas'), (c) => vaccinationController.listByAnimal(c));
    router.post('/:id/vaccines', rbacMiddleware('vacunas'), vaccinationValidator, (c) => vaccinationController.register(c));

    // Diet Management
    router.get('/:id/diet', rbacMiddleware('alimentacion'), (c) => alimentationController.getDiet(c));
    router.post('/:id/diet', rbacMiddleware('alimentacion'), alimentationValidator, (c) => alimentationController.register(c));

    // Production Management
    router.get('/:id/production', rbacMiddleware('datos_productivos'), (c) => productionController.getProduction(c));
    router.post('/:id/production', rbacMiddleware('datos_productivos'), productionValidator, (c) => productionController.register(c));

    // Reproduction Management
    router.get('/:id/reproduction', rbacMiddleware('reproduccion'), (c) => reproductionController.getReproduction(c));
    router.post('/:id/reproduction', rbacMiddleware('reproduccion'), reproductionValidator, (c) => reproductionController.register(c));

    return router;
}

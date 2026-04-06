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

export function createAnimalRouter(
    animalController: AnimalController,
    medicalHistoryController: MedicalHistoryController,
    vaccinationController: VaccinationController,
    alimentationController: AlimentationController,
    productionController: ProductionController,
    reproductionController: ReproductionController
) {
    const router = new Hono();

    router.get('/', (c) => animalController.list(c));
    router.post('/', animalValidator, (c) => animalController.register(c));
    router.get('/:id', (c) => animalController.getById(c));
    router.put('/:id',updateAnimalValidator, (c) => animalController.update(c));
    router.delete('/:id', (c) => animalController.delete(c));
    router.patch('/:id/transfer', transferAnimalValidator, (c) => animalController.transfer(c));

    // Clinical Management
    router.get('/:id/history', (c) => medicalHistoryController.listByAnimal(c));
    router.post('/:id/history', medicalHistoryValidator, (c) => medicalHistoryController.register(c));
    router.get('/:id/vaccines', (c) => vaccinationController.listByAnimal(c));
    router.post('/:id/vaccines', vaccinationValidator, (c) => vaccinationController.register(c));

    // Diet Management
    router.get('/:id/diet', (c) => alimentationController.getDiet(c));
    router.post('/:id/diet', alimentationValidator, (c) => alimentationController.register(c));

    // Production Management
    router.get('/:id/production', (c) => productionController.getProduction(c));
    router.post('/:id/production', productionValidator, (c) => productionController.register(c));

    // Reproduction Management
    router.get('/:id/reproduction', (c) => reproductionController.getReproduction(c));
    router.post('/:id/reproduction', reproductionValidator, (c) => reproductionController.register(c));

    return router;
}

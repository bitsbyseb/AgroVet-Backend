import { Hono } from 'hono';
import { AnimalController } from '../controllers/AnimalController.js';
import { animalValidator, transferAnimalValidator, updateAnimalValidator } from '../validators/AnimalValidator.js';
import { medicalHistoryValidator } from '../validators/MedicalHistoryValidator.js';
import { vaccinationValidator } from '../validators/VaccinationValidator.js';
import { MedicalHistoryController } from '../controllers/MedicalHistoryController.js';
import { VaccinationController } from '../controllers/VaccinationController.js';

export function createAnimalRouter(
    animalController: AnimalController,
    medicalHistoryController: MedicalHistoryController,
    vaccinationController: VaccinationController
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

    return router;
}

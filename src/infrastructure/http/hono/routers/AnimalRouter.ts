import { Hono } from 'hono';
import { AnimalController } from '../controllers/AnimalController.js';
import { animalValidator, transferAnimalValidator } from '../validators/AnimalValidator.js';

export function createAnimalRouter(animalController: AnimalController) {
    const router = new Hono();

    router.get('/', (c) => animalController.list(c));
    router.post('/', animalValidator, (c) => animalController.register(c));
    router.get('/:id', (c) => animalController.getById(c));
    router.put('/:id', (c) => animalController.update(c));
    router.delete('/:id', (c) => animalController.delete(c));
    router.patch('/:id/transfer', transferAnimalValidator, (c) => animalController.transfer(c));

    return router;
}

import { Hono } from 'hono';
import { OwnerController } from '../controllers/OwnerController.js';
import { ownerValidator, updateOwnerValidator } from '../validators/OwnerValidator.js';

export function createOwnerRouter(ownerController: OwnerController) {
    const router = new Hono();

    router.get('/', (c) => ownerController.list(c));
    router.post('/', ownerValidator, (c) => ownerController.register(c));
    router.get('/:id', (c) => ownerController.getById(c));
    router.put('/:id', updateOwnerValidator, (c) => ownerController.update(c));
    router.delete('/:id', (c) => ownerController.delete(c));
    router.get('/:id/animals', (c) => ownerController.getAnimals(c));

    return router;
}

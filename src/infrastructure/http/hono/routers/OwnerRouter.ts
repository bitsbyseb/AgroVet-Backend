import { Hono } from 'hono';
import { OwnerController } from '../controllers/OwnerController.js';
import { ownerValidator, updateOwnerValidator } from '../validators/OwnerValidator.js';
import { authMiddleware, rbacMiddleware } from '../middleware/RoleMiddleware.js';

export function createOwnerRouter(ownerController: OwnerController) {
    const router = new Hono();

    router.use('*', authMiddleware);

    router.get('/', rbacMiddleware('propietarios'), (c) => ownerController.list(c));
    router.post('/', rbacMiddleware('propietarios'), ownerValidator, (c) => ownerController.register(c));
    router.get('/:id', rbacMiddleware('propietarios'), (c) => ownerController.getById(c));
    router.put('/:id', rbacMiddleware('propietarios'), updateOwnerValidator, (c) => ownerController.update(c));
    router.delete('/:id', rbacMiddleware('propietarios'), (c) => ownerController.delete(c));
    router.get('/:id/animals', rbacMiddleware('propietarios'), (c) => ownerController.getAnimals(c));

    return router;
}

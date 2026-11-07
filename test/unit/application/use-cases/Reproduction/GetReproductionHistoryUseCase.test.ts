import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetReproductionHistoryUseCase } from '@application/use-cases/Reproduction/GetReproductionHistoryUseCase.js';
import { Reproduction, ReproductiveStatus, BreedingType } from '@domain/entities/Reproduction.js';
import { Animal, animalType, speciesType, Gender, Status } from '@domain/entities/Animal.js';
import type { ReproductionRepository } from '@domain/repositories/ReproductionRepository.js';
import type { AnimalRepository } from '@domain/repositories/AnimalRepository.js';
import { randomUUID } from 'node:crypto';

describe('GetReproductionHistoryUseCase (HU13)', () => {
    let mockReproductionRepo: { save: ReturnType<typeof vi.fn>; findByAnimalId: ReturnType<typeof vi.fn> };
    let mockAnimalRepo: { findById: ReturnType<typeof vi.fn> };
    let useCase: GetReproductionHistoryUseCase;

    beforeEach(() => {
        mockReproductionRepo = { save: vi.fn(), findByAnimalId: vi.fn() };
        mockAnimalRepo = { findById: vi.fn() };
        useCase = new GetReproductionHistoryUseCase(
            mockReproductionRepo as unknown as ReproductionRepository,
            mockAnimalRepo as unknown as AnimalRepository
        );
    });

    it('debería retornar el historial de reproducción ordenado cronológicamente de forma descendente por defecto', async () => {
        const animalId = randomUUID();
        const mockAnimal = new Animal(animalId, 'Bessie', speciesType.BOVINE, animalType.RURAL, 'Angus', Gender.FEMALE, new Date(), Status.ACTIVE, 'Black', randomUUID());
        mockAnimalRepo.findById.mockResolvedValue(mockAnimal);

        const event1 = new Reproduction(
            randomUUID(),
            animalId,
            ReproductiveStatus.EMPTY,
            null,
            0,
            null,
            new Date('2025-01-10T08:00:00Z') // evento más antiguo
        );

        const event2 = new Reproduction(
            randomUUID(),
            animalId,
            ReproductiveStatus.PREGNANT,
            null,
            0,
            BreedingType.INSEMINATION,
            new Date('2026-06-15T08:00:00Z') // evento intermedio
        );

        const event3 = new Reproduction(
            randomUUID(),
            animalId,
            ReproductiveStatus.LACTATING,
            '2027-03-20',
            1,
            null,
            new Date('2027-03-20T08:00:00Z') // evento más reciente
        );

        // Repositorio retorna en orden desordenado
        mockReproductionRepo.findByAnimalId.mockResolvedValue([event2, event1, event3]);

        const history = await useCase.execute(animalId);

        expect(mockAnimalRepo.findById).toHaveBeenCalledWith(animalId);
        expect(mockReproductionRepo.findByAnimalId).toHaveBeenCalledWith(animalId);
        expect(history).toHaveLength(3);
        // Evento más reciente primero (desc)
        expect(history[0].id).toBe(event3.id);
        expect(history[1].id).toBe(event2.id);
        expect(history[2].id).toBe(event1.id);
    });

    it('debería permitir ordenar el historial de forma ascendente', async () => {
        const animalId = randomUUID();
        const mockAnimal = new Animal(animalId, 'Bessie', speciesType.BOVINE, animalType.RURAL, 'Angus', Gender.FEMALE, new Date(), Status.ACTIVE, 'Black', randomUUID());
        mockAnimalRepo.findById.mockResolvedValue(mockAnimal);

        const eventOld = new Reproduction(
            randomUUID(),
            animalId,
            ReproductiveStatus.EMPTY,
            null,
            0,
            null,
            new Date('2025-01-01T00:00:00Z')
        );

        const eventNew = new Reproduction(
            randomUUID(),
            animalId,
            ReproductiveStatus.PREGNANT,
            null,
            0,
            BreedingType.NATURAL,
            new Date('2026-01-01T00:00:00Z')
        );

        mockReproductionRepo.findByAnimalId.mockResolvedValue([eventNew, eventOld]);

        const history = await useCase.execute(animalId, 'asc');

        expect(history[0].id).toBe(eventOld.id);
        expect(history[1].id).toBe(eventNew.id);
    });

    it('debería retornar array vacío si el animal no cuenta con registros reproductivos', async () => {
        const animalId = randomUUID();
        const mockAnimal = new Animal(animalId, 'Novilla', speciesType.BOVINE, animalType.RURAL, 'Jersey', Gender.FEMALE, new Date(), Status.ACTIVE, 'Marrón', randomUUID());
        mockAnimalRepo.findById.mockResolvedValue(mockAnimal);
        mockReproductionRepo.findByAnimalId.mockResolvedValue([]);

        const history = await useCase.execute(animalId);

        expect(history).toEqual([]);
    });

    it('debería lanzar error si el animal no existe', async () => {
        mockAnimalRepo.findById.mockResolvedValue(null);

        await expect(useCase.execute('animal-inexistente')).rejects.toThrow('Animal with ID "animal-inexistente" not found');
        expect(mockReproductionRepo.findByAnimalId).not.toHaveBeenCalled();
    });

    it('debería lanzar error si animalId es vacío', async () => {
        await expect(useCase.execute('')).rejects.toThrow('Animal ID is required');
    });
});

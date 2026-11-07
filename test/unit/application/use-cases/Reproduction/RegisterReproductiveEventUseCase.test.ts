import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterReproductiveEventUseCase } from '@application/use-cases/Reproduction/RegisterReproductiveEventUseCase.js';
import { Reproduction, ReproductiveStatus, BreedingType } from '@domain/entities/Reproduction.js';
import { Animal, animalType, speciesType, Gender, Status } from '@domain/entities/Animal.js';
import type { ReproductionRepository } from '@domain/repositories/ReproductionRepository.js';
import type { AnimalRepository } from '@domain/repositories/AnimalRepository.js';
import { randomUUID } from 'node:crypto';

describe('RegisterReproductiveEventUseCase (HU12)', () => {
    let mockReproductionRepo: { save: ReturnType<typeof vi.fn>; findByAnimalId: ReturnType<typeof vi.fn> };
    let mockAnimalRepo: { findById: ReturnType<typeof vi.fn> };
    let useCase: RegisterReproductiveEventUseCase;

    beforeEach(() => {
        mockReproductionRepo = { save: vi.fn(), findByAnimalId: vi.fn() };
        mockAnimalRepo = { findById: vi.fn() };
        useCase = new RegisterReproductiveEventUseCase(
            mockReproductionRepo as unknown as ReproductionRepository,
            mockAnimalRepo as unknown as AnimalRepository
        );
    });

    it('debería registrar un evento reproductivo con todos los campos detallados', async () => {
        const animalId = randomUUID();
        const mockAnimal = new Animal(
            animalId,
            'Margarita',
            speciesType.BOVINE,
            animalType.RURAL,
            'Holstein',
            Gender.FEMALE,
            new Date('2021-03-15'),
            Status.ACTIVE,
            'Blanco y Negro',
            randomUUID()
        );
        mockAnimalRepo.findById.mockResolvedValue(mockAnimal);

        const heatDate = '2026-05-10T08:00:00Z';
        const expectedCalvingDate = '2027-02-17T08:00:00Z';

        const result = await useCase.execute({
            animalId,
            reproductiveStatus: ReproductiveStatus.PREGNANT,
            breedingType: BreedingType.INSEMINATION,
            heatDate,
            expectedCalvingDate,
            bullId: 'TORO-098',
            semenBatch: 'LOTE-SEMEN-2026',
            inseminationDetails: 'Inseminación artificial con catéter recto-vaginal',
            offspringCount: 1,
            lastCalvingDate: '2025-04-10'
        });

        expect(mockAnimalRepo.findById).toHaveBeenCalledWith(animalId);
        expect(mockReproductionRepo.save).toHaveBeenCalledTimes(1);
        expect(result).toBeInstanceOf(Reproduction);
        expect(result.bullId).toBe('TORO-098');
        expect(result.semenBatch).toBe('LOTE-SEMEN-2026');
        expect(result.inseminationDetails).toBe('Inseminación artificial con catéter recto-vaginal');
        expect(result.heatDate).toEqual(new Date(heatDate));
        expect(result.expectedCalvingDate).toEqual(new Date(expectedCalvingDate));
    });

    it('debería calcular automáticamente la fecha probable de parto si se provee heatDate sin expectedCalvingDate en gestación', async () => {
        const animalId = randomUUID();
        const mockAnimal = new Animal(animalId, 'Clara', speciesType.BOVINE, animalType.RURAL, 'Jersey', Gender.FEMALE, new Date(), Status.ACTIVE, 'Marrón', randomUUID());
        mockAnimalRepo.findById.mockResolvedValue(mockAnimal);

        const heatDate = new Date('2026-01-01T00:00:00Z');

        const result = await useCase.execute({
            animalId,
            reproductiveStatus: ReproductiveStatus.PREGNANT,
            breedingType: BreedingType.NATURAL,
            heatDate
        });

        expect(result.expectedCalvingDate).not.toBeNull();
        const expectedTime = heatDate.getTime() + 283 * 24 * 60 * 60 * 1000;
        expect(result.expectedCalvingDate?.getTime()).toBe(expectedTime);
    });

    it('debería soportar un período de gestación personalizado en días', async () => {
        const animalId = randomUUID();
        const mockAnimal = new Animal(animalId, 'Oveja Dolly', speciesType.CAPRINE, animalType.RURAL, 'Dorper', Gender.FEMALE, new Date(), Status.ACTIVE, 'Blanco', randomUUID());
        mockAnimalRepo.findById.mockResolvedValue(mockAnimal);

        const heatDate = new Date('2026-01-01T00:00:00Z');
        const gestationDays = 150; // Período típico en ovinos/caprinos

        const result = await useCase.execute({
            animalId,
            reproductiveStatus: ReproductiveStatus.PREGNANT,
            breedingType: BreedingType.NATURAL,
            heatDate,
            gestationDays
        });

        const expectedTime = heatDate.getTime() + gestationDays * 24 * 60 * 60 * 1000;
        expect(result.expectedCalvingDate?.getTime()).toBe(expectedTime);
    });

    it('debería lanzar error si el animal no existe', async () => {
        mockAnimalRepo.findById.mockResolvedValue(null);

        await expect(useCase.execute({
            animalId: 'animal-no-existe',
            reproductiveStatus: ReproductiveStatus.EMPTY
        })).rejects.toThrow('Animal with ID "animal-no-existe" not found');

        expect(mockReproductionRepo.save).not.toHaveBeenCalled();
    });

    it('debería lanzar error si animalId es vacío', async () => {
        await expect(useCase.execute({
            animalId: '',
            reproductiveStatus: ReproductiveStatus.EMPTY
        })).rejects.toThrow('Animal ID is required');
    });

    it('debería lanzar error si offspringCount es negativo', async () => {
        const animalId = randomUUID();
        const mockAnimal = new Animal(animalId, 'Vaca', speciesType.BOVINE, animalType.RURAL, 'Angus', Gender.FEMALE, new Date(), Status.ACTIVE, 'Negro', randomUUID());
        mockAnimalRepo.findById.mockResolvedValue(mockAnimal);

        await expect(useCase.execute({
            animalId,
            reproductiveStatus: ReproductiveStatus.EMPTY,
            offspringCount: -3
        })).rejects.toThrow('Offspring count cannot be negative');
    });

    it('debería lanzar error si expectedCalvingDate es menor o igual a heatDate', async () => {
        const animalId = randomUUID();
        const mockAnimal = new Animal(animalId, 'Vaca', speciesType.BOVINE, animalType.RURAL, 'Angus', Gender.FEMALE, new Date(), Status.ACTIVE, 'Negro', randomUUID());
        mockAnimalRepo.findById.mockResolvedValue(mockAnimal);

        await expect(useCase.execute({
            animalId,
            reproductiveStatus: ReproductiveStatus.PREGNANT,
            heatDate: '2026-05-10T00:00:00Z',
            expectedCalvingDate: '2026-05-09T00:00:00Z'
        })).rejects.toThrow('Expected calving date must be after heat date');
    });
});

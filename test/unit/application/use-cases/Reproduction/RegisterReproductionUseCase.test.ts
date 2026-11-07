import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterReproductionUseCase } from '@application/use-cases/Reproduction/RegisterReproductionUseCase.js';
import { Reproduction, ReproductiveStatus, BreedingType } from '@domain/entities/Reproduction.js';
import { Animal, animalType, speciesType, Gender, Status } from '@domain/entities/Animal.js';
import type { ReproductionRepository } from '@domain/repositories/ReproductionRepository.js';
import type { AnimalRepository } from '@domain/repositories/AnimalRepository.js';
import { randomUUID } from 'node:crypto';

describe('RegisterReproductionUseCase', () => {
    let mockReproductionRepo: ReturnType<typeof vi.fn>;
    let mockAnimalRepo: ReturnType<typeof vi.fn>;
    let useCase: RegisterReproductionUseCase;

    beforeEach(() => {
        mockReproductionRepo = { save: vi.fn(), findByAnimalId: vi.fn() } as unknown as ReturnType<typeof vi.fn>;
        mockAnimalRepo = { findById: vi.fn() } as unknown as ReturnType<typeof vi.fn>;
        useCase = new RegisterReproductionUseCase(mockReproductionRepo as unknown as ReproductionRepository, mockAnimalRepo as unknown as AnimalRepository);
    });

    it('should register reproduction successfully with basic fields', async () => {
        const animalId = randomUUID();
        const mockAnimal = new Animal(animalId, 'Bessie', speciesType.BOVINE, animalType.RURAL, 'Angus', Gender.FEMALE, new Date(), Status.ACTIVE, 'Black', randomUUID());
        (mockAnimalRepo.findById as any).mockResolvedValue(mockAnimal);

        await useCase.execute({
            animalId,
            reproductiveStatus: ReproductiveStatus.PREGNANT,
            lastCalvingDate: '2023-01-01',
            offspringCount: 1,
            breedingType: BreedingType.NATURAL
        });

        expect(mockAnimalRepo.findById).toHaveBeenCalledWith(animalId);
        expect(mockReproductionRepo.save).toHaveBeenCalled();
        const savedEntity = (mockReproductionRepo.save as any).mock.calls[0][0];
        expect(savedEntity.animalId).toBe(animalId);
        expect(savedEntity.reproductiveStatus).toBe(ReproductiveStatus.PREGNANT);
        expect(savedEntity.breedingType).toBe(BreedingType.NATURAL);
    });

    it('should register reproduction with extended fields (heatDate, insemination, expectedCalvingDate)', async () => {
        const animalId = randomUUID();
        const mockAnimal = new Animal(animalId, 'Bessie', speciesType.BOVINE, animalType.RURAL, 'Angus', Gender.FEMALE, new Date(), Status.ACTIVE, 'Black', randomUUID());
        (mockAnimalRepo.findById as any).mockResolvedValue(mockAnimal);

        const heatDate = '2026-05-10T08:00:00Z';
        const expectedCalvingDate = '2027-02-17T08:00:00Z';

        await useCase.execute({
            animalId,
            reproductiveStatus: ReproductiveStatus.PREGNANT,
            breedingType: BreedingType.INSEMINATION,
            heatDate,
            expectedCalvingDate,
            bullId: 'TORO-098',
            semenBatch: 'LOTE-SEMEN-2026',
            inseminationDetails: 'Inseminación con catéter recto-vaginal'
        });

        expect(mockReproductionRepo.save).toHaveBeenCalled();
        const savedEntity = (mockReproductionRepo.save as any).mock.calls[0][0] as Reproduction;
        expect(savedEntity.bullId).toBe('TORO-098');
        expect(savedEntity.semenBatch).toBe('LOTE-SEMEN-2026');
        expect(savedEntity.inseminationDetails).toBe('Inseminación con catéter recto-vaginal');
        expect(savedEntity.heatDate).toEqual(new Date(heatDate));
        expect(savedEntity.expectedCalvingDate).toEqual(new Date(expectedCalvingDate));
    });

    it('should automatically calculate expectedCalvingDate if heatDate is given without expectedCalvingDate for pregnant status', async () => {
        const animalId = randomUUID();
        const mockAnimal = new Animal(animalId, 'Bessie', speciesType.BOVINE, animalType.RURAL, 'Angus', Gender.FEMALE, new Date(), Status.ACTIVE, 'Black', randomUUID());
        (mockAnimalRepo.findById as any).mockResolvedValue(mockAnimal);

        const heatDate = new Date('2026-01-01T00:00:00Z');

        await useCase.execute({
            animalId,
            reproductiveStatus: ReproductiveStatus.PREGNANT,
            breedingType: BreedingType.NATURAL,
            heatDate
        });

        const savedEntity = (mockReproductionRepo.save as any).mock.calls[0][0] as Reproduction;
        expect(savedEntity.expectedCalvingDate).not.toBeNull();
        const expectedTime = heatDate.getTime() + 283 * 24 * 60 * 60 * 1000;
        expect(savedEntity.expectedCalvingDate?.getTime()).toBe(expectedTime);
    });

    it('should throw error if animal not found', async () => {
        (mockAnimalRepo.findById as any).mockResolvedValue(null);

        await expect(useCase.execute({
            animalId: 'invalid', reproductiveStatus: ReproductiveStatus.PREGNANT, lastCalvingDate: null, offspringCount: 0, breedingType: null
        })).rejects.toThrow('Animal not found');

        expect(mockReproductionRepo.save).not.toHaveBeenCalled();
    });
});

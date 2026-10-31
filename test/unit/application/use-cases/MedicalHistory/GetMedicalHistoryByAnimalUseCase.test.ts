import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetMedicalHistoryByAnimalUseCase } from '@application/use-cases/MedicalHistory/GetMedicalHistoryByAnimalUseCase.js';
import { MedicalHistory } from '@domain/entities/MedicalHistory.js';
import { Animal, animalType, speciesType, Gender, Status } from '@domain/entities/Animal.js';
import type { MedicalHistoryRepository } from '@domain/repositories/MedicalHistoryRepository.js';
import type { AnimalRepository } from '@domain/repositories/AnimalRepository.js';
import { randomUUID } from 'node:crypto';

describe('GetMedicalHistoryByAnimalUseCase (Sprint 17 - HU8/HU9)', () => {
    let mockHistoryRepo: { findByAnimalId: ReturnType<typeof vi.fn> };
    let mockAnimalRepo: { findById: ReturnType<typeof vi.fn> };
    let useCase: GetMedicalHistoryByAnimalUseCase;

    beforeEach(() => {
        mockHistoryRepo = { findByAnimalId: vi.fn() };
        mockAnimalRepo = { findById: vi.fn() };
        useCase = new GetMedicalHistoryByAnimalUseCase(
            mockHistoryRepo as unknown as MedicalHistoryRepository,
            mockAnimalRepo as unknown as AnimalRepository
        );
    });

    it('debería retornar la lista de historial clínico enriquecido de un animal existente', async () => {
        const animalId = randomUUID();
        const mockAnimal = new Animal(
            animalId,
            'Luna',
            speciesType.FELINE,
            animalType.URBAN,
            'Siames',
            Gender.FEMALE,
            new Date('2022-01-01'),
            Status.ACTIVE,
            'Blanco',
            randomUUID()
        );
        mockAnimalRepo.findById.mockResolvedValue(mockAnimal);

        const entry1 = new MedicalHistory(
            randomUUID(),
            animalId,
            new Date('2026-09-01'),
            'R1',
            'D1',
            'T1',
            'O1',
            'vet-1',
            'Evolución inicial',
            { heartRate: 140, temperature: 38.8 },
            4.2,
            3
        );
        const entry2 = new MedicalHistory(
            randomUUID(),
            animalId,
            new Date('2026-10-01'),
            'R2',
            'D2',
            'T2',
            'O2',
            'vet-1',
            'Evolución completa de alta',
            { heartRate: 120, temperature: 38.5 },
            4.5,
            3.5
        );
        mockHistoryRepo.findByAnimalId.mockResolvedValue([entry1, entry2]);

        const result = await useCase.execute(animalId);

        expect(mockAnimalRepo.findById).toHaveBeenCalledWith(animalId);
        expect(mockHistoryRepo.findByAnimalId).toHaveBeenCalledWith(animalId);
        expect(result).toHaveLength(2);
        expect(result[0].evolution).toBe('Evolución inicial');
        expect(result[0].weight).toBe(4.2);
        expect(result[0].heartRate).toBe(140);
        expect(result[1].evolution).toBe('Evolución completa de alta');
        expect(result[1].weight).toBe(4.5);
    });

    it('debería lanzar un error si el animal no existe', async () => {
        mockAnimalRepo.findById.mockResolvedValue(null);

        await expect(useCase.execute('animal-invalido')).rejects.toThrow('Animal not found');
        expect(mockHistoryRepo.findByAnimalId).not.toHaveBeenCalled();
    });

    it('debería lanzar un error si el animalId está vacío', async () => {
        await expect(useCase.execute('')).rejects.toThrow('Animal ID is required');
        await expect(useCase.execute('   ')).rejects.toThrow('Animal ID is required');
        expect(mockAnimalRepo.findById).not.toHaveBeenCalled();
    });
});

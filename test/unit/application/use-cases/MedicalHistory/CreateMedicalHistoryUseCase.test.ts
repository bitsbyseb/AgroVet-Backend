import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateMedicalHistoryUseCase } from '@application/use-cases/MedicalHistory/CreateMedicalHistoryUseCase.js';
import { Animal, animalType, speciesType, Gender, Status } from '@domain/entities/Animal.js';
import type { MedicalHistoryRepository } from '@domain/repositories/MedicalHistoryRepository.js';
import type { AnimalRepository } from '@domain/repositories/AnimalRepository.js';
import { randomUUID } from 'node:crypto';

describe('CreateMedicalHistoryUseCase (Sprint 17 - HU8/HU9)', () => {
    let mockHistoryRepo: { save: ReturnType<typeof vi.fn> };
    let mockAnimalRepo: { findById: ReturnType<typeof vi.fn> };
    let useCase: CreateMedicalHistoryUseCase;

    beforeEach(() => {
        mockHistoryRepo = { save: vi.fn().mockResolvedValue(undefined) };
        mockAnimalRepo = { findById: vi.fn() };
        useCase = new CreateMedicalHistoryUseCase(
            mockHistoryRepo as unknown as MedicalHistoryRepository,
            mockAnimalRepo as unknown as AnimalRepository
        );
    });

    it('debería registrar una historia médica enriquecida con evolución, constantes y medidas', async () => {
        const animalId = randomUUID();
        const mockAnimal = new Animal(
            animalId,
            'Max',
            speciesType.CANINE,
            animalType.URBAN,
            'Golden Retriever',
            Gender.MALE,
            new Date('2021-05-10'),
            Status.ACTIVE,
            'Dorado',
            randomUUID()
        );
        mockAnimalRepo.findById.mockResolvedValue(mockAnimal);

        const result = await useCase.execute({
            animalId,
            date: '2026-10-20T10:00:00Z',
            reason: 'Revisión posquirúrgica',
            diagnosis: 'Recuperación favorable',
            treatment: 'Analgesia y antibiótico oral',
            observations: 'Paciente tolera bien el alimento',
            createdBy: 'vet-uuid-1',
            evolution: 'Herida limpia sin secreción en 48 horas',
            physiologicalConstants: {
                capillaryRefillTime: 1.5,
                mucosalState: 'rosadas'
            },
            heartRate: 95,
            respiratoryRate: 22,
            temperature: 38.6,
            weight: 31.4,
            bodyConditionScore: 3.5
        });

        expect(mockAnimalRepo.findById).toHaveBeenCalledWith(animalId);
        expect(mockHistoryRepo.save).toHaveBeenCalledTimes(1);
        expect(result.animalId).toBe(animalId);
        expect(result.evolution).toBe('Herida limpia sin secreción en 48 horas');
        expect(result.weight).toBe(31.4);
        expect(result.bodyConditionScore).toBe(3.5);
        expect(result.heartRate).toBe(95);
        expect(result.respiratoryRate).toBe(22);
        expect(result.temperature).toBe(38.6);
        expect(result.capillaryRefillTime).toBe(1.5);
        expect(result.mucosalState).toBe('rosadas');
    });

    it('debería lanzar un error si el animal no existe', async () => {
        mockAnimalRepo.findById.mockResolvedValue(null);

        await expect(useCase.execute({
            animalId: 'animal-inexistente',
            date: new Date(),
            reason: 'Consulta',
            diagnosis: 'Desconocido',
            treatment: 'Ninguno',
            createdBy: 'vet-1'
        })).rejects.toThrow('Animal not found');

        expect(mockHistoryRepo.save).not.toHaveBeenCalled();
    });

    it('debería rechazar pesos corporales no positivos', async () => {
        const animalId = randomUUID();
        mockAnimalRepo.findById.mockResolvedValue({ id: animalId });

        await expect(useCase.execute({
            animalId,
            date: new Date(),
            reason: 'R',
            diagnosis: 'D',
            treatment: 'T',
            createdBy: 'vet-1',
            weight: -10
        })).rejects.toThrow('Weight must be a positive number');

        await expect(useCase.execute({
            animalId,
            date: new Date(),
            reason: 'R',
            diagnosis: 'D',
            treatment: 'T',
            createdBy: 'vet-1',
            weight: 0
        })).rejects.toThrow('Weight must be a positive number');
    });

    it('debería rechazar puntuaciones de condición corporal no positivas', async () => {
        const animalId = randomUUID();
        mockAnimalRepo.findById.mockResolvedValue({ id: animalId });

        await expect(useCase.execute({
            animalId,
            date: new Date(),
            reason: 'R',
            diagnosis: 'D',
            treatment: 'T',
            createdBy: 'vet-1',
            bodyConditionScore: 0
        })).rejects.toThrow('Body condition score must be a positive number');
    });

    it('debería rechazar formatos de fecha inválidos', async () => {
        const animalId = randomUUID();
        mockAnimalRepo.findById.mockResolvedValue({ id: animalId });

        await expect(useCase.execute({
            animalId,
            date: 'fecha-totalmente-invalida',
            reason: 'R',
            diagnosis: 'D',
            treatment: 'T',
            createdBy: 'vet-1'
        })).rejects.toThrow('Invalid date format');
    });
});

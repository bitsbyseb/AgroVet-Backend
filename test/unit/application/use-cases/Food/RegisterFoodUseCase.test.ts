import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterFoodUseCase } from '@application/use-cases/Food/RegisterFoodUseCase.js';
import { Food } from '@domain/entities/Food.js';
import type { FoodRepository } from '@domain/repositories/FoodRepository.js';
import { randomUUID } from 'node:crypto';

describe('RegisterFoodUseCase', () => {
    let mockRepo: ReturnType<typeof vi.fn>;
    let useCase: RegisterFoodUseCase;

    beforeEach(() => {
        mockRepo = {
            save: vi.fn(),
            findAll: vi.fn(),
            findById: vi.fn()
        } as unknown as ReturnType<typeof vi.fn>;
        useCase = new RegisterFoodUseCase(mockRepo as unknown as FoodRepository);
    });

    it('should register food successfully', async () => {
        const request = {
            id: randomUUID(),
            name: 'Pedigree',
            type: 'Dry',
            description: 'Good food'
        };

        await useCase.execute(request);

        expect(mockRepo.save).toHaveBeenCalled();
        const savedFood = (mockRepo.save as any).mock.calls[0][0];
        expect(savedFood).toBeInstanceOf(Food);
        expect(savedFood.id).toBe(request.id);
        expect(savedFood.name).toBe(request.name);
    });
});

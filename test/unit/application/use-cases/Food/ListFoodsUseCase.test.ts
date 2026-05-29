import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListFoodsUseCase } from '@application/use-cases/Food/ListFoodsUseCase.js';
import { Food } from '@domain/entities/Food.js';
import type { FoodRepository } from '@domain/repositories/FoodRepository.js';
import { randomUUID } from 'node:crypto';

describe('ListFoodsUseCase', () => {
    let mockRepo: ReturnType<typeof vi.fn>;
    let useCase: ListFoodsUseCase;

    beforeEach(() => {
        mockRepo = {
            findAll: vi.fn(),
            findById: vi.fn(),
            save: vi.fn()
        } as unknown as ReturnType<typeof vi.fn>;
        useCase = new ListFoodsUseCase(mockRepo as unknown as FoodRepository);
    });

    it('should list all foods', async () => {
        const mockFoods = [new Food(randomUUID(), 'Pedigree', 'Dry', 'Desc')];
        (mockRepo.findAll as any).mockResolvedValue(mockFoods);

        const result = await useCase.execute();

        expect(mockRepo.findAll).toHaveBeenCalled();
        expect(result).toEqual(mockFoods);
    });
});

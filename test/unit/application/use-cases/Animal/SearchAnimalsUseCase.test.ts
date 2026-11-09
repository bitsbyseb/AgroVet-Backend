import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchAnimalsUseCase } from '@application/use-cases/Animal/SearchAnimalsUseCase.js';
import { Animal, animalType, speciesType, Gender, Status } from '@domain/entities/Animal.js';
import type { AnimalRepository } from '@domain/repositories/AnimalRepository.js';

describe('Caso de Uso: Buscar y Filtrar Animales (SearchAnimalsUseCase) - Sprint 20 HU14 & HU15', () => {
    let mockAnimalRepository: any;
    let useCase: SearchAnimalsUseCase;

    const sampleAnimals: Animal[] = [
        new Animal(
            'uuid-bessie-123',
            'Bessie',
            speciesType.BOVINE,
            animalType.RURAL,
            'Holstein',
            Gender.FEMALE,
            new Date('2022-01-15'),
            Status.ACTIVE,
            'Blanco y Negro',
            'owner-1',
            'paddock-1'
        ),
        new Animal(
            'uuid-firulais-456',
            'Firulais',
            speciesType.CANINE,
            animalType.URBAN,
            'Labrador',
            Gender.MALE,
            new Date('2023-05-10'),
            Status.ACTIVE,
            'Dorado',
            'owner-2',
            null
        ),
        new Animal(
            'uuid-bella-789',
            'Bella',
            speciesType.BOVINE,
            animalType.RURAL,
            'Angus',
            Gender.FEMALE,
            new Date('2021-08-20'),
            Status.INACTIVE,
            'Negro',
            'owner-1',
            'paddock-2'
        )
    ];

    beforeEach(() => {
        mockAnimalRepository = {
            search: vi.fn(),
            findAll: vi.fn()
        };

        useCase = new SearchAnimalsUseCase(mockAnimalRepository as AnimalRepository);
    });

    it('debería buscar animales pasando un término de búsqueda general como string', async () => {
        mockAnimalRepository.search.mockResolvedValue([sampleAnimals[0]]);

        const result = await useCase.execute('Bessie');

        expect(mockAnimalRepository.search).toHaveBeenCalledWith({ query: 'Bessie' });
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Bessie');
        expect(result[0].id).toBe('uuid-bessie-123');
        expect(result[0].species).toBe(speciesType.BOVINE);
    });

    it('debería buscar animales por número de identificación (ID)', async () => {
        mockAnimalRepository.search.mockResolvedValue([sampleAnimals[1]]);

        const result = await useCase.execute({ identification: 'uuid-firulais-456' });

        expect(mockAnimalRepository.search).toHaveBeenCalledWith({ identification: 'uuid-firulais-456' });
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Firulais');
        expect(result[0].id).toBe('uuid-firulais-456');
    });

    it('debería buscar animales por coincidencia de nombre específico', async () => {
        mockAnimalRepository.search.mockResolvedValue([sampleAnimals[2]]);

        const result = await useCase.execute({ name: 'Bella' });

        expect(mockAnimalRepository.search).toHaveBeenCalledWith({ name: 'Bella' });
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Bella');
    });

    it('debería filtrar animales por especie (HU15)', async () => {
        mockAnimalRepository.search.mockResolvedValue([sampleAnimals[0], sampleAnimals[2]]);

        const result = await useCase.execute({ species: speciesType.BOVINE });

        expect(mockAnimalRepository.search).toHaveBeenCalledWith({ species: speciesType.BOVINE });
        expect(result).toHaveLength(2);
        expect(result.every(a => a.species === speciesType.BOVINE)).toBe(true);
    });

    it('debería filtrar animales por propietario (HU15)', async () => {
        mockAnimalRepository.search.mockResolvedValue([sampleAnimals[0], sampleAnimals[2]]);

        const result = await useCase.execute({ ownerId: 'owner-1' });

        expect(mockAnimalRepository.search).toHaveBeenCalledWith({ ownerId: 'owner-1' });
        expect(result).toHaveLength(2);
        expect(result.every(a => a.ownerId === 'owner-1')).toBe(true);
    });

    it('debería filtrar animales por estado (activo / inactivo) (HU15)', async () => {
        mockAnimalRepository.search.mockResolvedValue([sampleAnimals[2]]);

        const result = await useCase.execute({ status: Status.INACTIVE });

        expect(mockAnimalRepository.search).toHaveBeenCalledWith({ status: Status.INACTIVE });
        expect(result).toHaveLength(1);
        expect(result[0].status).toBe(Status.INACTIVE);
    });

    it('debería combinar búsqueda por texto con filtros de especie, propietario y estado (HU15)', async () => {
        mockAnimalRepository.search.mockResolvedValue([sampleAnimals[0]]);

        const result = await useCase.execute({
            query: 'Bessie',
            species: speciesType.BOVINE,
            ownerId: 'owner-1',
            status: Status.ACTIVE
        });

        expect(mockAnimalRepository.search).toHaveBeenCalledWith({
            query: 'Bessie',
            species: speciesType.BOVINE,
            ownerId: 'owner-1',
            status: Status.ACTIVE
        });
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Bessie');
    });

    it('debería retornar todos los animales formateados cuando no se proporcionan parámetros', async () => {
        mockAnimalRepository.search.mockResolvedValue(sampleAnimals);

        const result = await useCase.execute();

        expect(mockAnimalRepository.search).toHaveBeenCalledWith({});
        expect(result).toHaveLength(3);
    });

    it('debería retornar un array vacío si no se encuentran coincidencias', async () => {
        mockAnimalRepository.search.mockResolvedValue([]);

        const result = await useCase.execute({ query: 'Inexistente' });

        expect(mockAnimalRepository.search).toHaveBeenCalledWith({ query: 'Inexistente' });
        expect(result).toEqual([]);
    });

    it('debería manejar valores nulos de paddockId correctamente', async () => {
        mockAnimalRepository.search.mockResolvedValue([sampleAnimals[1]]);

        const result = await useCase.execute({ query: 'Firulais' });

        expect(result[0].paddockId).toBeNull();
    });
});

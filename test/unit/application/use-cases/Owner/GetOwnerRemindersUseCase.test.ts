import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetOwnerRemindersUseCase } from '@application/use-cases/Owner/GetOwnerRemindersUseCase.js';
import { Owner, OwnerType } from '@domain/entities/Owner.js';
import { Animal, animalType, speciesType, Gender, Status } from '@domain/entities/Animal.js';
import { Vaccination } from '@domain/entities/Vaccination.js';
import { Appointment, AppointmentStatus } from '@domain/entities/Appointment.js';
import { Alimentation, weightUnits, frequency } from '@domain/entities/Alimentation.js';
import type { OwnerRepository } from '@domain/repositories/OwnerRepository.js';
import type { AnimalRepository } from '@domain/repositories/AnimalRepository.js';
import type { VaccinationRepository } from '@domain/repositories/VaccinationRepository.js';
import type { AppointmentRepository } from '@domain/repositories/AppointmentRepository.js';
import type { AlimentationRepository } from '@domain/repositories/AlimentationRepository.js';

function buildOwner(): Owner {
    return new Owner(
        'owner-uuid-1',
        'Juan Pérez',
        '12345678',
        '555-0001',
        'juan@example.com',
        'Calle 1 # 2-3',
        OwnerType.URBAN,
        'user-uuid-1'
    );
}

function buildAnimal(ownerId: string, id = 'animal-uuid-1', name = 'Firulais'): Animal {
    return new Animal(
        id,
        name,
        speciesType.CANINE,
        animalType.URBAN,
        'Labrador',
        Gender.MALE,
        new Date('2022-01-15'),
        Status.ACTIVE,
        'dorado',
        ownerId,
        null
    );
}

describe('Caso de Uso (Sprint 16 - HU7): GetOwnerRemindersUseCase', () => {
    let mockOwnerRepository: any;
    let mockAnimalRepository: any;
    let mockVaccinationRepository: any;
    let mockAppointmentRepository: any;
    let mockAlimentationRepository: any;
    let useCase: GetOwnerRemindersUseCase;

    beforeEach(() => {
        mockOwnerRepository = {
            findByUserId: vi.fn(),
            findById: vi.fn(),
            save: vi.fn(),
            update: vi.fn()
        };
        mockAnimalRepository = {
            findByOwnerId: vi.fn(),
            findById: vi.fn()
        };
        mockVaccinationRepository = {
            findByAnimalId: vi.fn()
        };
        mockAppointmentRepository = {
            findByAnimalId: vi.fn()
        };
        mockAlimentationRepository = {
            findByAnimalId: vi.fn()
        };

        useCase = new GetOwnerRemindersUseCase(
            mockOwnerRepository as OwnerRepository,
            mockAnimalRepository as AnimalRepository,
            mockVaccinationRepository as VaccinationRepository,
            mockAppointmentRepository as AppointmentRepository,
            mockAlimentationRepository as AlimentationRepository
        );
    });

    it('debería retornar los recordatorios unificados de vacunas, citas y alimentación ordenados cronológicamente', async () => {
        const owner = buildOwner();
        const animal = buildAnimal(owner.id);

        mockOwnerRepository.findByUserId.mockResolvedValue(owner);
        mockAnimalRepository.findByOwnerId.mockResolvedValue([animal]);

        // Fechas a futuro
        const futureDate1 = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // En 2 días (Cita)
        const futureDate2 = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); // En 5 días (Vacuna)
        const futureDate3 = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // En 10 días (Fin dieta)
        const pastStartDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);

        const vac = new Vaccination(
            'vac-1',
            animal.id,
            'Vacuna Antirrábica',
            new Date(),
            futureDate2,
            'BATCH-01',
            'vet-uuid'
        );

        const app = new Appointment(
            'app-1',
            animal.id,
            futureDate1,
            'Control postoperatorio',
            AppointmentStatus.SCHEDULED,
            'vet-uuid'
        );

        const alim = new Alimentation(
            'alim-1',
            animal.id,
            'food-1',
            250,
            weightUnits.g,
            frequency.daily,
            pastStartDate,
            futureDate3,
            'Dieta blanda'
        );

        mockVaccinationRepository.findByAnimalId.mockResolvedValue([vac]);
        mockAppointmentRepository.findByAnimalId.mockResolvedValue([app]);
        mockAlimentationRepository.findByAnimalId.mockResolvedValue([alim]);

        const reminders = await useCase.execute('user-uuid-1');

        expect(reminders).toHaveLength(3);
        // Debe estar ordenado cronológicamente (futureDate1 < futureDate2 < futureDate3)
        expect(reminders[0].category).toBe('appointment');
        expect(reminders[0].title).toContain('Control postoperatorio');
        expect(reminders[0].animalName).toBe('Firulais');

        expect(reminders[1].category).toBe('vaccination');
        expect(reminders[1].title).toContain('Vacuna Antirrábica');
        expect(reminders[1].status).toBe('pending');

        expect(reminders[2].category).toBe('alimentation');
        expect(reminders[2].title).toContain('daily');
        expect(reminders[2].status).toBe('active');
    });

    it('debería filtrar por animalId específico si es proporcionado (ASIDGA-174)', async () => {
        const owner = buildOwner();
        const animal1 = buildAnimal(owner.id, 'animal-1', 'Firulais');

        mockOwnerRepository.findByUserId.mockResolvedValue(owner);
        mockAnimalRepository.findById.mockResolvedValue(animal1);

        const futureDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
        const vac = new Vaccination('vac-1', animal1.id, 'Parvovirus', new Date(), futureDate, null, 'vet-uuid');

        mockVaccinationRepository.findByAnimalId.mockResolvedValue([vac]);
        mockAppointmentRepository.findByAnimalId.mockResolvedValue([]);
        mockAlimentationRepository.findByAnimalId.mockResolvedValue([]);

        const reminders = await useCase.execute('user-uuid-1', { animalId: 'animal-1' });

        expect(mockAnimalRepository.findById).toHaveBeenCalledWith('animal-1');
        expect(mockAnimalRepository.findByOwnerId).not.toHaveBeenCalled();
        expect(reminders).toHaveLength(1);
        expect(reminders[0].animalId).toBe('animal-1');
    });

    it('debería lanzar error 403 si el animalId solicitado pertenece a otro propietario', async () => {
        const owner = buildOwner();
        const animalDeOtro = buildAnimal('otro-owner-id', 'animal-ajeno');

        mockOwnerRepository.findByUserId.mockResolvedValue(owner);
        mockAnimalRepository.findById.mockResolvedValue(animalDeOtro);

        await expect(
            useCase.execute('user-uuid-1', { animalId: 'animal-ajeno' })
        ).rejects.toThrow('Acceso no autorizado: el animal solicitado no pertenece a este propietario.');
    });

    it('debería lanzar error 404 si el animalId solicitado no existe', async () => {
        const owner = buildOwner();

        mockOwnerRepository.findByUserId.mockResolvedValue(owner);
        mockAnimalRepository.findById.mockResolvedValue(null);

        await expect(
            useCase.execute('user-uuid-1', { animalId: 'no-existe' })
        ).rejects.toThrow('El animal con ID "no-existe" no fue encontrado.');
    });

    it('debería retornar lista vacía si el propietario no tiene animales registrados', async () => {
        const owner = buildOwner();

        mockOwnerRepository.findByUserId.mockResolvedValue(owner);
        mockAnimalRepository.findByOwnerId.mockResolvedValue([]);

        const reminders = await useCase.execute('user-uuid-1');

        expect(reminders).toEqual([]);
        expect(mockVaccinationRepository.findByAnimalId).not.toHaveBeenCalled();
    });

    it('debería marcar como overdue las vacunas cuya fecha de dosis ya pasó', async () => {
        const owner = buildOwner();
        const animal = buildAnimal(owner.id);

        mockOwnerRepository.findByUserId.mockResolvedValue(owner);
        mockAnimalRepository.findByOwnerId.mockResolvedValue([animal]);

        const pastDate = new Date(Date.now() - 48 * 60 * 60 * 1000); // Hace 2 días
        const vac = new Vaccination('vac-past', animal.id, 'Triple Felina', new Date(), pastDate, 'BATCH-99', 'vet-uuid');

        mockVaccinationRepository.findByAnimalId.mockResolvedValue([vac]);
        mockAppointmentRepository.findByAnimalId.mockResolvedValue([]);
        mockAlimentationRepository.findByAnimalId.mockResolvedValue([]);

        const reminders = await useCase.execute('user-uuid-1');

        expect(reminders).toHaveLength(1);
        expect(reminders[0].status).toBe('overdue');
    });

    it('debería ignorar citas que ya fueron completadas o canceladas (solo SCHEDULED)', async () => {
        const owner = buildOwner();
        const animal = buildAnimal(owner.id);

        mockOwnerRepository.findByUserId.mockResolvedValue(owner);
        mockAnimalRepository.findByOwnerId.mockResolvedValue([animal]);

        const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const appCompleted = new Appointment('app-c', animal.id, futureDate, 'Cirugía', AppointmentStatus.COMPLETED, 'vet-uuid');
        const appCancelled = new Appointment('app-x', animal.id, futureDate, 'Control', AppointmentStatus.CANCELLED, 'vet-uuid');

        mockVaccinationRepository.findByAnimalId.mockResolvedValue([]);
        mockAppointmentRepository.findByAnimalId.mockResolvedValue([appCompleted, appCancelled]);
        mockAlimentationRepository.findByAnimalId.mockResolvedValue([]);

        const reminders = await useCase.execute('user-uuid-1');

        expect(reminders).toHaveLength(0);
    });

    it('debería agregar recordatorios de múltiples animales propios asegurando aislamiento frente a otros dueños (ASIDGA-185)', async () => {
        const owner = buildOwner();
        const animal1 = buildAnimal(owner.id, 'animal-1', 'Bessie');
        const animal2 = buildAnimal(owner.id, 'animal-2', 'Clara');

        mockOwnerRepository.findByUserId.mockResolvedValue(owner);
        mockAnimalRepository.findByOwnerId.mockResolvedValue([animal1, animal2]);

        const futureDate1 = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const futureDate2 = new Date(Date.now() + 48 * 60 * 60 * 1000);

        const vac1 = new Vaccination('v1', animal1.id, 'Fiebre Aftosa', new Date(), futureDate1, 'L-01', 'vet-uuid');
        const vac2 = new Vaccination('v2', animal2.id, 'Brucelosis', new Date(), futureDate2, 'L-02', 'vet-uuid');

        mockVaccinationRepository.findByAnimalId.mockImplementation((id: string) => {
            if (id === 'animal-1') return Promise.resolve([vac1]);
            if (id === 'animal-2') return Promise.resolve([vac2]);
            return Promise.resolve([]);
        });
        mockAppointmentRepository.findByAnimalId.mockResolvedValue([]);
        mockAlimentationRepository.findByAnimalId.mockResolvedValue([]);

        const reminders = await useCase.execute('user-uuid-1');

        expect(mockAnimalRepository.findByOwnerId).toHaveBeenCalledWith(owner.id);
        expect(reminders).toHaveLength(2);
        expect(reminders.map(r => r.animalName)).toEqual(['Bessie', 'Clara']);
        // Ninguno pertenece a otro dueño
        expect(reminders.every(r => r.animalId === 'animal-1' || r.animalId === 'animal-2')).toBe(true);
    });
});

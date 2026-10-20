import { z } from "@hono/zod-openapi";
import { OwnerType } from "../../../../domain/entities/Owner.js";
import { animalType, speciesType, Gender, Status } from "../../../../domain/entities/Animal.js";
export const ownerSchema = z.object({
    name: z.string().openapi({ example: 'Juan Pérez', description: 'Nombre completo del propietario' }),
    document: z.string().regex(/^[0-9]+$/, { error: "El documento debe ser solo numeros" }).openapi({ example: '1234567890', description: 'Documento de identidad' }),
    phone: z.string().openapi({ example: '+1234567890', description: 'Número de teléfono' }),
    email: z.email().openapi({ example: 'juan@example.com', description: 'Correo electrónico' }),
    address: z.string().openapi({ example: 'Calle 123, Ciudad', description: 'Dirección del propietario' }),
    ownerType: z.enum(OwnerType).openapi({ example: OwnerType.URBAN, description: 'Tipo de propietario (URBAN o RURAL)' })
}).openapi('OwnerRequest');
export const updateOwnerSchema = ownerSchema.omit({ document: true }).partial().openapi('UpdateOwnerRequest');
export const ownerResponseSchema = ownerSchema.extend({
    id: z.string().openapi({ example: 'uuid-owner-123' })
}).openapi('OwnerResponse');
export const ownerListResponseSchema = z.array(ownerResponseSchema).openapi('OwnerListResponse');
// ─── Esquemas del Portal del Propietario (Sprint 11) ──────────────────────────
/**
 * Esquema de validación para los parámetros de la ruta de historia clínica.
 * Valida de forma estricta que animalId sea un UUID v4.
 */
export const ownerMedicalHistoryParamSchema = z.object({
    animalId: z.string().uuid().openapi({
        param: {
            name: 'animalId',
            in: 'path'
        },
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        description: 'Identificador único (UUID) del animal'
    })
}).openapi('OwnerMedicalHistoryParam');
/**
 * Esquema alternativo cuando el parámetro de ruta se denomina :id.
 */
export const ownerMedicalHistoryIdParamSchema = z.object({
    id: z.string().uuid().openapi({
        param: {
            name: 'id',
            in: 'path'
        },
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        description: 'Identificador único (UUID) del animal'
    })
}).openapi('OwnerMedicalHistoryIdParam');
/**
 * Esquema de respuesta para cada animal propio retornado al propietario.
 */
export const ownerAnimalSummaryResponseSchema = z.object({
    id: z.string().openapi({ example: 'uuid-animal-123', description: 'ID del animal' }),
    name: z.string().openapi({ example: 'Bessie', description: 'Nombre del animal' }),
    species: z.nativeEnum(speciesType).openapi({ example: speciesType.BOVINE, description: 'Especie' }),
    animalType: z.nativeEnum(animalType).openapi({ example: animalType.RURAL, description: 'Tipo (urbano/rural)' }),
    breed: z.string().openapi({ example: 'Holstein', description: 'Raza' }),
    gender: z.nativeEnum(Gender).openapi({ example: Gender.FEMALE, description: 'Género' }),
    birthDate: z.string().openapi({ example: '2022-01-15T00:00:00.000Z', description: 'Fecha de nacimiento ISO' }),
    status: z.nativeEnum(Status).openapi({ example: Status.ACTIVE, description: 'Estado del animal' }),
    color: z.string().openapi({ example: 'Blanco y Negro', description: 'Color' }),
    ownerId: z.string().openapi({ example: 'uuid-owner-123', description: 'ID del propietario' }),
    paddockId: z.string().nullable().openapi({ example: null, description: 'ID del potrero asignado' })
}).openapi('OwnerAnimalSummaryResponse');
/**
 * Lista de animales pertenecientes al propietario autenticado.
 */
export const ownerAnimalsResponseSchema = z.array(ownerAnimalSummaryResponseSchema).openapi('OwnerAnimalsResponse');
/**
 * Esquema de respuesta para una entrada del historial clínico del animal del propietario.
 */
export const ownerMedicalHistoryItemResponseSchema = z.object({
    id: z.string().openapi({ example: 'uuid-history-001', description: 'ID del registro médico' }),
    animalId: z.string().openapi({ example: 'uuid-animal-123', description: 'ID del animal' }),
    date: z.string().openapi({ example: '2024-03-15T00:00:00.000Z', description: 'Fecha de la atención médica' }),
    reason: z.string().openapi({ example: 'Revisión periódica', description: 'Motivo de consulta' }),
    diagnosis: z.string().openapi({ example: 'Animal en óptimas condiciones', description: 'Diagnóstico clínico' }),
    treatment: z.string().openapi({ example: 'Suplemento vitamínico', description: 'Tratamiento prescrito' }),
    observations: z.string().openapi({ example: 'Mantener dieta balanceada', description: 'Observaciones veterinarias' }),
    createdBy: z.string().openapi({ example: 'uuid-vet-user', description: 'ID del profesional que registró' }),
    createdAt: z.string().optional().openapi({ example: '2024-03-15T10:00:00.000Z' }),
    updatedAt: z.string().optional().openapi({ example: '2024-03-15T10:00:00.000Z' })
}).openapi('OwnerMedicalHistoryItemResponse');
/**
 * Historial clínico completo del animal del propietario en modo solo lectura.
 */
export const ownerMedicalHistoriesResponseSchema = z.array(ownerMedicalHistoryItemResponseSchema).openapi('OwnerMedicalHistoriesResponse');
// ─── Esquemas de Recordatorios del Propietario (Sprint 16 - HU7 / ASIDGA-172 a ASIDGA-174) ───
/**
 * Esquema de validación para parámetros de consulta opcionales de recordatorios.
 */
export const ownerRemindersQuerySchema = z.object({
    animalId: z.string().uuid({ message: 'El animalId debe ser un UUID válido' }).optional().openapi({
        param: {
            name: 'animalId',
            in: 'query'
        },
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        description: 'Filtro opcional por identificador único del animal'
    })
}).openapi('OwnerRemindersQuery');
/**
 * Esquema de respuesta para un recordatorio individual de propietario.
 */
export const ownerReminderItemResponseSchema = z.object({
    id: z.string().openapi({ example: 'uuid-reminder-123', description: 'Identificador único del recordatorio o registro origen' }),
    animalId: z.string().openapi({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'ID del animal vinculado' }),
    animalName: z.string().openapi({ example: 'Canela', description: 'Nombre del animal' }),
    category: z.enum(['vaccination', 'appointment', 'alimentation']).openapi({ example: 'vaccination', description: 'Categoría del recordatorio (vaccination | appointment | alimentation)' }),
    title: z.string().openapi({ example: 'Próxima dosis: Vacuna Antirrábica', description: 'Título descriptivo del evento o actividad' }),
    description: z.string().openapi({ example: 'Dosis de refuerzo programada para Vacuna Antirrábica', description: 'Detalle complementario de la actividad' }),
    dueDate: z.string().openapi({ example: '2026-11-20T09:00:00.000Z', description: 'Fecha programada o límite en formato ISO 8601' }),
    status: z.string().openapi({ example: 'pending', description: 'Estado del recordatorio (pending, overdue, scheduled, active)' })
}).openapi('OwnerReminderItemResponse');
/**
 * Esquema de lista completa de recordatorios futuros y pendientes del propietario.
 */
export const ownerRemindersResponseSchema = z.array(ownerReminderItemResponseSchema).openapi('OwnerRemindersResponse');

import { z } from "@hono/zod-openapi";
import { OwnerType } from "@domain/entities/Owner.js";

export const ownerSchema = z.object({
    name: z.string().openapi({ example: 'Juan Pérez', description: 'Nombre completo del propietario' }),
    document: z.string().regex(/^[0-9]+$/,{ error:"El documento debe ser solo numeros" }).openapi({ example: '1234567890', description: 'Documento de identidad' }),
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

export type ownerCreationType = z.infer<typeof ownerSchema>;
export type ownerUpdateType = z.infer<typeof updateOwnerSchema>;

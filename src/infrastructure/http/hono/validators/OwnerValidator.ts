import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { OwnerType } from "@domain/entities/Owner.js";

export const ownerSchema = z.object({
    id: z.uuid(),
    name: z.string().min(3, "Name must be at least 3 characters"),
    document: z.string().min(5, "Document is too short"),
    phone: z.string().min(7, "Invalid phone number"),
    email: z.email("Invalid email address"),
    address: z.string().min(5, "Address is too short"),
    ownerType: z.enum(OwnerType)
});

export const updateOwnerSchema = z.object({
    name: z.string().min(3).optional(),
    phone: z.string().min(7).optional(),
    email: z.email().optional(),
    address: z.string().min(5).optional(),
    ownerType: z.enum(OwnerType).optional()
});

export const ownerValidator = zValidator('json', ownerSchema, (result, c) => {
    if (!result.success) {
        return c.json({ errors: result.error.issues.map(iss => iss.message) }, 400);
    }
});

export const updateOwnerValidator = zValidator('json', updateOwnerSchema, (result, c) => {
    if (!result.success) {
        return c.json({ errors: result.error.issues.map(iss => iss.message) }, 400);
    }
});

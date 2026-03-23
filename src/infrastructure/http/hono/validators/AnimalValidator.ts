import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { AnimalType, SpeciesType, Gender } from "@domain/entities/Animal.js";

export const animalSchema = z.object({
    id: z.uuid(),
    name: z.string().min(2, "Name is too short"),
    species: z.enum(SpeciesType),
    animalType: z.enum(AnimalType),
    breed: z.string().min(2, "Breed is required"),
    gender: z.enum(Gender),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").transform((str) => new Date(str)),
    color: z.string().min(3),
    ownerId: z.uuid()
});

export const transferAnimalSchema = z.object({
    newOwnerId: z.uuid()
});

export const animalValidator = zValidator('json', animalSchema, (result, c) => {
    if (!result.success) {
        return c.json({ errors: result.error.issues.map(iss => iss.message) }, 400);
    }
});

export const transferAnimalValidator = zValidator('json', transferAnimalSchema, (result, c) => {
    if (!result.success) {
        return c.json({ errors: result.error.issues.map(iss => iss.message) }, 400);
    }
});

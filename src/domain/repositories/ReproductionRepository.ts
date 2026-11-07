import { Reproduction } from "../entities/Reproduction.js";

/**
 * Puerto de Repositorio de Dominio para Reproduction.
 * Define el contrato de persistencia desacoplado de la infraestructura.
 */
export interface ReproductionRepository {
    save(reproduction: Reproduction): Promise<void>;
    findById(id: string): Promise<Reproduction | null>;
    findByAnimalId(animalId: string): Promise<Reproduction[]>;
    findAll(): Promise<Reproduction[]>;
    update(reproduction: Reproduction): Promise<void>;
    delete(id: string): Promise<void>;
}

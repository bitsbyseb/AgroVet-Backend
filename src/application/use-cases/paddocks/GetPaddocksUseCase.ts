import type { Paddock } from "@domain/entities/Paddock.js";
import type { PaddockRepository } from "@domain/repositories/PaddockRepository.js";

export class GetPaddocksUseCase {
    constructor(private readonly paddockRepository: PaddockRepository) {}

    async execute(): Promise<Paddock[]> {
        return await this.paddockRepository.findAll();
    }

    async getById(id: string): Promise<Paddock | null> {
        return await this.paddockRepository.findById(id);
    }
}

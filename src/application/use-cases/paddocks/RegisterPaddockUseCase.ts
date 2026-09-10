import { Paddock, PaddockStatus } from "@domain/entities/Paddock.js";
import type { PaddockRepository } from "@domain/repositories/PaddockRepository.js";

export interface RegisterPaddockDTO {
    id: string;
    name: string;
    capacity: number;
    area?: number | null;
    status?: PaddockStatus;
    description?: string | null;
}

export class RegisterPaddockUseCase {
    constructor(private readonly paddockRepository: PaddockRepository) {}

    async execute(request: RegisterPaddockDTO): Promise<void> {
        const existingPaddock = await this.paddockRepository.findByName(request.name);
        if (existingPaddock) {
            throw new Error(`Paddock with name "${request.name}" already exists`);
        }

        const paddock = new Paddock(
            request.id,
            request.name,
            request.capacity,
            request.area ?? null,
            request.status ?? PaddockStatus.ACTIVE,
            request.description ?? null
        );

        await this.paddockRepository.save(paddock);
    }
}

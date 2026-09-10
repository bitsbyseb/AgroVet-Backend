import type { PaddockStatus } from "@domain/entities/Paddock.js";
import type { PaddockRepository } from "@domain/repositories/PaddockRepository.js";

export interface UpdatePaddockDTO {
    name?: string;
    capacity?: number;
    area?: number | null;
    status?: PaddockStatus;
    description?: string | null;
}

export class UpdatePaddockUseCase {
    constructor(private readonly paddockRepository: PaddockRepository) {}

    async execute(id: string, request: UpdatePaddockDTO): Promise<void> {
        const paddock = await this.paddockRepository.findById(id);
        if (!paddock) {
            throw new Error("Paddock not found");
        }

        if (request.name && request.name !== paddock.name) {
            const existingWithSameName = await this.paddockRepository.findByName(request.name);
            if (existingWithSameName && existingWithSameName.id !== id) {
                throw new Error(`Paddock with name "${request.name}" already exists`);
            }
        }

        paddock.updateDetails(request);
        await this.paddockRepository.update(paddock);
    }
}

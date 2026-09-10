import { Paddock, PaddockStatus } from "../../../domain/entities/Paddock.js";
export class RegisterPaddockUseCase {
    paddockRepository;
    constructor(paddockRepository) {
        this.paddockRepository = paddockRepository;
    }
    async execute(request) {
        const existingPaddock = await this.paddockRepository.findByName(request.name);
        if (existingPaddock) {
            throw new Error(`Paddock with name "${request.name}" already exists`);
        }
        const paddock = new Paddock(request.id, request.name, request.capacity, request.area ?? null, request.status ?? PaddockStatus.ACTIVE, request.description ?? null);
        await this.paddockRepository.save(paddock);
    }
}

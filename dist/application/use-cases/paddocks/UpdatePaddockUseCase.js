export class UpdatePaddockUseCase {
    paddockRepository;
    constructor(paddockRepository) {
        this.paddockRepository = paddockRepository;
    }
    async execute(id, request) {
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

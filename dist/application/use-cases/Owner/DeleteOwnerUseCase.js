export class DeleteOwnerUseCase {
    ownerRepository;
    constructor(ownerRepository) {
        this.ownerRepository = ownerRepository;
    }
    async execute(id) {
        const owner = await this.ownerRepository.findById(id);
        if (!owner) {
            throw new Error("Owner not found");
        }
        await this.ownerRepository.delete(id);
    }
}

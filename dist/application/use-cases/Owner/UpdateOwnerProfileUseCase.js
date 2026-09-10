export class UpdateOwnerProfileUseCase {
    ownerRepository;
    constructor(ownerRepository) {
        this.ownerRepository = ownerRepository;
    }
    async execute(id, request) {
        const owner = await this.ownerRepository.findById(id);
        if (!owner) {
            throw new Error("Owner not found");
        }
        owner.updateDetails(request);
        await this.ownerRepository.update(owner);
    }
}

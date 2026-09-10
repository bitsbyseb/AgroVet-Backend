export class ListAllOwnersUseCase {
    ownerRepository;
    constructor(ownerRepository) {
        this.ownerRepository = ownerRepository;
    }
    async execute() {
        const owners = await this.ownerRepository.findAll();
        return owners.map(owner => ({
            id: owner.id,
            name: owner.name,
            document: owner.document,
            phone: owner.phone,
            email: owner.email,
            address: owner.address,
            ownerType: owner.ownerType
        }));
    }
}

export class GetPaddocksUseCase {
    paddockRepository;
    constructor(paddockRepository) {
        this.paddockRepository = paddockRepository;
    }
    async execute() {
        return await this.paddockRepository.findAll();
    }
    async getById(id) {
        return await this.paddockRepository.findById(id);
    }
}

export class GetGrazingActivitiesUseCase {
    grazingActivityRepository;
    constructor(grazingActivityRepository) {
        this.grazingActivityRepository = grazingActivityRepository;
    }
    async execute(paddockId) {
        if (paddockId && paddockId.trim() !== '') {
            return await this.grazingActivityRepository.findByPaddockId(paddockId.trim());
        }
        return await this.grazingActivityRepository.findAll();
    }
}

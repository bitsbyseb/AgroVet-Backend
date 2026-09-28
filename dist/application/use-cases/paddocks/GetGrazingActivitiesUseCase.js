export class GetGrazingActivitiesUseCase {
    grazingActivityRepository;
    constructor(grazingActivityRepository) {
        this.grazingActivityRepository = grazingActivityRepository;
    }
    async execute(paddockId) {
        if (paddockId) {
            return await this.grazingActivityRepository.findByPaddockId(paddockId);
        }
        return await this.grazingActivityRepository.findAll();
    }
}

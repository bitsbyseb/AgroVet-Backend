import { ProductionData } from '../../../domain/entities/ProductionData.js';
export class GetProductionIndicatorsUseCase {
    productionRepository;
    animalRepository;
    constructor(productionRepository, animalRepository) {
        this.productionRepository = productionRepository;
        this.animalRepository = animalRepository;
    }
    async execute(request) {
        const animal = await this.animalRepository.findById(request.animalId);
        if (!animal)
            throw new Error(`Animal not found: ${request.animalId}`);
        const to = request.to ? new Date(request.to) : new Date();
        const from = request.from
            ? new Date(request.from)
            : new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
        // Normalize 'to' to end-of-day so the same date is inclusive
        to.setHours(23, 59, 59, 999);
        const records = await this.productionRepository.findByAnimalIdAndPeriod(request.animalId, from, to);
        const period = this.buildPeriodSummary(from, to, records);
        const weightGainEvolution = this.buildWeightGainEvolution(records);
        return {
            animalId: request.animalId,
            period,
            weightGainEvolution
        };
    }
    // ── Private helpers ───────────────────────────────────────────────────────
    buildPeriodSummary(from, to, records) {
        const totalRecords = records.length;
        // Weight aggregates (only records where weight is defined)
        const weightRecords = records.filter(r => r.weight != null);
        const totalWeight = weightRecords.length > 0
            ? weightRecords.reduce((sum, r) => sum + r.weight, 0)
            : null;
        const avgWeight = totalWeight != null && weightRecords.length > 0
            ? parseFloat((totalWeight / weightRecords.length).toFixed(2))
            : null;
        // Milk production aggregates
        const milkRecords = records.filter(r => r.milkProduction != null);
        const totalMilkProduction = milkRecords.length > 0
            ? milkRecords.reduce((sum, r) => sum + r.milkProduction, 0)
            : null;
        const avgMilkProduction = totalMilkProduction != null && milkRecords.length > 0
            ? parseFloat((totalMilkProduction / milkRecords.length).toFixed(2))
            : null;
        // Weight gain aggregate
        const weightGainRecords = records.filter(r => r.weightGain != null);
        const totalWeightGain = weightGainRecords.length > 0
            ? parseFloat(weightGainRecords.reduce((sum, r) => sum + r.weightGain, 0).toFixed(2))
            : null;
        // Quality distribution
        const qualityDistribution = {};
        for (const r of records) {
            const key = r.productQuality?.trim() || 'Sin especificar';
            qualityDistribution[key] = (qualityDistribution[key] ?? 0) + 1;
        }
        // Purpose distribution
        const purposeDistribution = {};
        for (const r of records) {
            const key = r.purpose ?? 'other';
            purposeDistribution[key] = (purposeDistribution[key] ?? 0) + 1;
        }
        return {
            from: from.toISOString(),
            to: to.toISOString(),
            totalRecords,
            totalWeight: totalWeight != null ? parseFloat(totalWeight.toFixed(2)) : null,
            avgWeight,
            totalMilkProduction: totalMilkProduction != null ? parseFloat(totalMilkProduction.toFixed(2)) : null,
            avgMilkProduction,
            totalWeightGain,
            qualityDistribution,
            purposeDistribution
        };
    }
    buildWeightGainEvolution(records) {
        // Records are already sorted ASC by recordDate from the repository
        let cumulative = 0;
        return records.map(r => {
            const gain = r.weightGain ?? 0;
            cumulative = parseFloat((cumulative + gain).toFixed(2));
            return {
                date: r.recordDate.toISOString(),
                weight: r.weight,
                weightGain: r.weightGain,
                cumulativeWeightGain: cumulative
            };
        });
    }
}

export var ReproductiveStatus;
(function (ReproductiveStatus) {
    ReproductiveStatus["EMPTY"] = "empty";
    ReproductiveStatus["PREGNANT"] = "pregnant";
    ReproductiveStatus["LACTATING"] = "lactating";
    ReproductiveStatus["ANESTRUS"] = "anestrus";
    ReproductiveStatus["OPEN"] = "open";
    ReproductiveStatus["DRY"] = "dry";
})(ReproductiveStatus || (ReproductiveStatus = {}));
export var BreedingType;
(function (BreedingType) {
    BreedingType["NATURAL"] = "natural";
    BreedingType["INSEMINATION"] = "insemination";
    BreedingType["ARTIFICIAL"] = "artificial";
    BreedingType["EMBRYO_TRANSFER"] = "embryo_transfer";
})(BreedingType || (BreedingType = {}));
export class Reproduction {
    id;
    animalId;
    reproductiveStatus;
    lastCalvingDate;
    offspringCount;
    breedingType;
    heatDate;
    expectedCalvingDate;
    bullId;
    semenBatch;
    inseminationDetails;
    createdAt;
    updatedAt;
    constructor(id, animalId, reproductiveStatus, lastCalvingDate = null, offspringCount = 0, breedingType = null, heatDate = null, expectedCalvingDate = null, bullId = null, semenBatch = null, inseminationDetails = null, createdAt, updatedAt) {
        this.id = id;
        this.animalId = animalId;
        this.reproductiveStatus = reproductiveStatus;
        this.lastCalvingDate = lastCalvingDate;
        this.offspringCount = offspringCount;
        this.breedingType = breedingType;
        this.heatDate = heatDate;
        this.expectedCalvingDate = expectedCalvingDate;
        this.bullId = bullId;
        this.semenBatch = semenBatch;
        this.inseminationDetails = inseminationDetails;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        if (this.offspringCount < 0) {
            throw new Error('Offspring count cannot be negative');
        }
    }
    /**
     * Calcula y asigna la fecha probable de parto a partir de la fecha de celo o servicio,
     * considerando el período medio de gestación de la especie (por defecto 283 días para bovinos).
     */
    calculateExpectedCalvingDate(baseDate, gestationDays = 283) {
        const reference = baseDate ?? this.heatDate;
        if (!reference)
            return null;
        const calculated = new Date(reference.getTime() + gestationDays * 24 * 60 * 60 * 1000);
        this.expectedCalvingDate = calculated;
        return calculated;
    }
    /**
     * Registra un celo detectado para el animal.
     */
    recordHeat(heatDate) {
        this.heatDate = heatDate;
    }
    /**
     * Registra el evento de monta o inseminación con sus detalles y calcula opcionalmente el parto.
     */
    recordBreeding(type, details) {
        this.breedingType = type;
        if (details?.bullId !== undefined)
            this.bullId = details.bullId;
        if (details?.semenBatch !== undefined)
            this.semenBatch = details.semenBatch;
        if (details?.inseminationDetails !== undefined)
            this.inseminationDetails = details.inseminationDetails;
        if (details?.heatDate) {
            this.heatDate = details.heatDate;
        }
        if (this.heatDate) {
            this.calculateExpectedCalvingDate(this.heatDate, details?.gestationDays ?? 283);
        }
    }
    /**
     * Actualiza atributos del registro reproductivo asegurando invariantes de negocio.
     */
    update(data) {
        if (data.offspringCount !== undefined) {
            if (data.offspringCount < 0) {
                throw new Error('Offspring count cannot be negative');
            }
            this.offspringCount = data.offspringCount;
        }
        if (data.reproductiveStatus !== undefined)
            this.reproductiveStatus = data.reproductiveStatus;
        if (data.lastCalvingDate !== undefined)
            this.lastCalvingDate = data.lastCalvingDate;
        if (data.breedingType !== undefined)
            this.breedingType = data.breedingType;
        if (data.heatDate !== undefined)
            this.heatDate = data.heatDate;
        if (data.expectedCalvingDate !== undefined)
            this.expectedCalvingDate = data.expectedCalvingDate;
        if (data.bullId !== undefined)
            this.bullId = data.bullId;
        if (data.semenBatch !== undefined)
            this.semenBatch = data.semenBatch;
        if (data.inseminationDetails !== undefined)
            this.inseminationDetails = data.inseminationDetails;
    }
}

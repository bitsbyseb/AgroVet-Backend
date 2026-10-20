import { Op } from '@sequelize/core';
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
/**
 * Valida si un valor es una cadena UUID v1-v5 válida.
 */
export function isValidUuid(val) {
    return typeof val === 'string' && UUID_REGEX.test(val.trim());
}
/**
 * Limpia y construye una cláusula WHERE para Sequelize omitiendo dinámicamente:
 * - `undefined`
 * - `null`
 * - Cadenas vacías (`''` o con solo espacios en blanco)
 *
 * También limpia recursivamente objetos anidados (por ejemplo filtros con operadores Op de Sequelize)
 * y descarta objetos vacíos para evitar que Sequelize genere cláusulas `IS NULL` o filtros inválidos.
 */
export function cleanWhereClause(filters) {
    const clean = {};
    if (!filters || typeof filters !== 'object') {
        return clean;
    }
    const keys = [
        ...Object.keys(filters),
        ...Object.getOwnPropertySymbols(filters)
    ];
    for (const key of keys) {
        const val = filters[key];
        // Omitir undefined y null
        if (val === undefined || val === null) {
            continue;
        }
        // Omitir cadenas vacías o solo con espacios
        if (typeof val === 'string') {
            if (val.trim() === '') {
                continue;
            }
            clean[key] = val;
            continue;
        }
        // Arrays: mantener si no están vacíos
        if (Array.isArray(val)) {
            const cleanArray = val.filter((item) => item !== undefined && item !== null && item !== '');
            if (cleanArray.length > 0) {
                clean[key] = cleanArray;
            }
            continue;
        }
        // Objetos fecha, regexp, etc.
        if (val instanceof Date || val instanceof RegExp) {
            clean[key] = val;
            continue;
        }
        // Objetos anidados (incluyendo operadores de Sequelize como { [Op.gte]: date })
        if (typeof val === 'object') {
            const nestedClean = cleanWhereClause(val);
            const nestedKeys = [
                ...Object.keys(nestedClean),
                ...Object.getOwnPropertySymbols(nestedClean)
            ];
            if (nestedKeys.length > 0) {
                clean[key] = nestedClean;
            }
            continue;
        }
        // Primitivos restantes (números, booleanos, etc.)
        clean[key] = val;
    }
    return clean;
}
/**
 * Helper para construir la condición de búsqueda dentro de un campo JSON/Array (como `animalIds`).
 * Utiliza el operador `Op.substring` que en dialectos como MySQL traduce a `LIKE '%<valor>%'`,
 * permitiendo buscar elementos UUID dentro de la cadena JSON de forma segura.
 */
export function buildJsonArrayContains(value) {
    return {
        [Op.substring]: value
    };
}

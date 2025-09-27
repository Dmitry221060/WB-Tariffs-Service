import { WBAPIWarehouseBoxRates } from "#app/worker/dto/wb-api-response.dto.js";
import env from "#config/env/env.js";

export class WarehouseBoxRatesEntity {
    forDate!: string;
    updatedAt!: Date;
    boxDeliveryBase?: number;
    boxDeliveryCoefExpr?: number;
    boxDeliveryLiter?: number;
    boxDeliveryMarketplaceBase?: number;
    boxDeliveryMarketplaceCoefExpr?: number;
    boxDeliveryMarketplaceLiter?: number;
    boxStorageBase?: number;
    boxStorageCoefExpr?: number;
    boxStorageLiter?: number;
    geoName!: string;
    warehouseName!: string;

    static fromWBFormat(external: WBAPIWarehouseBoxRates, date?: string): WarehouseBoxRatesEntity {
        const entity = new WarehouseBoxRatesEntity();
        const floatOrNull = (s: string) => (s == "-" ? undefined : parseFloat(s.replace(",", ".")));
        entity.forDate = date ?? new Date().toISOString().substring(0, 10);
        entity.updatedAt = new Date();
        entity.boxDeliveryBase = floatOrNull(external.boxDeliveryBase);
        entity.boxDeliveryCoefExpr = floatOrNull(external.boxDeliveryCoefExpr);
        entity.boxDeliveryLiter = floatOrNull(external.boxDeliveryLiter);
        entity.boxDeliveryMarketplaceBase = floatOrNull(external.boxDeliveryMarketplaceBase);
        entity.boxDeliveryMarketplaceCoefExpr = floatOrNull(external.boxDeliveryMarketplaceCoefExpr);
        entity.boxDeliveryMarketplaceLiter = floatOrNull(external.boxDeliveryMarketplaceLiter);
        entity.boxStorageBase = floatOrNull(external.boxStorageBase);
        entity.boxStorageCoefExpr = floatOrNull(external.boxStorageCoefExpr);
        entity.boxStorageLiter = floatOrNull(external.boxStorageLiter);
        entity.geoName = external.geoName;
        entity.warehouseName = external.warehouseName;
        return entity;
    }

    toExcelFormat(): [string, unknown][] {
        return WarehouseBoxRatesEntity.toExcelFormat(this);
    }

    // prettier-ignore
    static toExcelFormat(entity: WarehouseBoxRatesEntity): [string, unknown][] {
		if (!env.FORMAT_EXPORT) return WarehouseBoxRatesEntity.toExcelFormatRaw(entity);

        const result: [string, unknown][] = [];

		result.push(["Warehouse name", entity.warehouseName]);
        result.push(["Country/Federal district", entity.geoName]);
        result.push(["Tariff for", entity.forDate]);
        result.push(["Updated at", entity.updatedAt.toISOString()]);
        if (entity.boxDeliveryBase != null) result.push(["First liter logistics", entity.boxDeliveryBase]);
        if (entity.boxDeliveryCoefExpr != null) result.push(["Logistics coefficient", entity.boxDeliveryCoefExpr / 100]);
        if (entity.boxDeliveryLiter != null) result.push(["Subsequent liter logistics", entity.boxDeliveryLiter]);
        if (entity.boxDeliveryMarketplaceBase != null) result.push(["FBS first liter logistics", entity.boxDeliveryMarketplaceBase]);
        if (entity.boxDeliveryMarketplaceCoefExpr != null) result.push(["FBS logistics coefficient", entity.boxDeliveryMarketplaceCoefExpr / 100]);
        if (entity.boxDeliveryMarketplaceLiter != null) result.push(["FBS subsequent liter logistics", entity.boxDeliveryMarketplaceLiter]);
        if (entity.boxStorageBase != null) result.push(["First liter storage per day", entity.boxStorageBase]);
        if (entity.boxStorageCoefExpr != null) result.push(["Storage coefficient", entity.boxStorageCoefExpr / 100]);
        if (entity.boxStorageLiter != null) result.push(["Subsequent liter storage per day", entity.boxStorageLiter]);

        return result;
    }

    private static toExcelFormatRaw(entity: WarehouseBoxRatesEntity): [string, unknown][] {
        const result: [string, unknown][] = [];

        for (const key in entity) {
            const value = entity[key as keyof typeof entity] ?? "-";
            result.push([key, value]);
        }

        return result;
    }
}

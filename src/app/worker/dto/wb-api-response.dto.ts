export class WBAPIBoxTariffsResponse {
    response!: {
        data: {
            dtNextBox: string;
            dtTillMax: string;
            warehouseList: WBAPIWarehouseBoxRates[];
        };
    };
}

export class WBAPIWarehouseBoxRates {
    boxDeliveryBase!: string;
    boxDeliveryCoefExpr!: string;
    boxDeliveryLiter!: string;
    boxDeliveryMarketplaceBase!: string;
    boxDeliveryMarketplaceCoefExpr!: string;
    boxDeliveryMarketplaceLiter!: string;
    boxStorageBase!: string;
    boxStorageCoefExpr!: string;
    boxStorageLiter!: string;
    geoName!: string;
    warehouseName!: string;
}

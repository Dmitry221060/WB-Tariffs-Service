/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    return knex.schema.createTable("warehouseBoxRates", (table) => {
        table.string("forDate");
        table.dateTime("updatedAt");
        table.float("boxDeliveryBase").nullable();
        table.float("boxDeliveryCoefExpr").nullable();
        table.float("boxDeliveryLiter").nullable();
        table.float("boxDeliveryMarketplaceBase").nullable();
        table.float("boxDeliveryMarketplaceCoefExpr").nullable();
        table.float("boxDeliveryMarketplaceLiter").nullable();
        table.float("boxStorageBase").nullable();
        table.float("boxStorageCoefExpr").nullable();
        table.float("boxStorageLiter").nullable();
        table.string("geoName");
        table.string("warehouseName");
        table.primary(["warehouseName", "forDate"]);
    });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    return knex.schema.dropTable("warehouseBoxRates");
}

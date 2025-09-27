import { Test } from "@nestjs/testing";
import { querybuilder } from "test/utils/knex-mock";
import { updateSpreadsheetMock } from "test/utils/gsheets-mock";
import fakeTariffsResponse from "test/fakes/wb-tariffs-response.json";
import { ExportService } from "./export.service";
import { WarehouseBoxRatesEntity } from "#postgres/entities/warehouseBoxRate.entity.js";

describe("Export", () => {
    let exportService: ExportService;
    const testTableId = "1N0fxfJirp5zJJaWGpS0y4iMarrEuc80GtsK2VrW2IdA";
    const fakeTariffs = fakeTariffsResponse.response.data.warehouseList;
    const testWarehouseBoxRates: WarehouseBoxRatesEntity[] = fakeTariffs.map((e) =>
        WarehouseBoxRatesEntity.fromWBFormat(e),
    );

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [ExportService],
        }).compile();

        exportService = moduleRef.get(ExportService);

        jest.clearAllMocks();
    });

    it("should export tariffs to google sheets", async () => {
        querybuilder.orderByRaw.mockResolvedValueOnce(testWarehouseBoxRates);

        const response = await exportService.exportToGoogleSheets({ tables: [{ tableId: testTableId }] });

        expect(response.results.length).toBe(1);
        expect(response.results[0].tableId).toBe(testTableId);
        expect(response.results[0].status).toBe("success");

        const expectedValues = testWarehouseBoxRates.map((e) => e.toExcelFormat()).flat(1);
        expect(updateSpreadsheetMock).toHaveBeenCalledTimes(1);
        expect(updateSpreadsheetMock.mock.lastCall[0]?.requestBody?.values).toEqual(expectedValues);
    });

    it("should export tariffs by date", async () => {
        const date = "2025-01-01";
        const oldTariff = WarehouseBoxRatesEntity.fromWBFormat(fakeTariffs[0], date);
        const dbTariffs = [...testWarehouseBoxRates, oldTariff];
        querybuilder.orderByRaw.mockResolvedValueOnce(dbTariffs.filter((e) => e.forDate == date));

        const response = await exportService.exportToGoogleSheets({
            tables: [{ tableId: testTableId }],
            forDate: date,
        });

        expect(response.results.length).toBe(1);
        expect(response.results[0].tableId).toBe(testTableId);
        expect(response.results[0].status).toBe("success");

        const expectedValues = dbTariffs
            .filter((e) => e.forDate == date)
            .map((e) => e.toExcelFormat())
            .flat(1);
        expect(updateSpreadsheetMock).toHaveBeenCalledTimes(1);
        expect(updateSpreadsheetMock.mock.lastCall[0]?.requestBody?.values).toEqual(expectedValues);
    });

    it("should export tariffs to multiple sheets", async () => {
        const tables = [{ tableId: "Invalid ID" }, { tableId: testTableId }];
        querybuilder.orderByRaw.mockResolvedValueOnce(testWarehouseBoxRates);
        updateSpreadsheetMock.mockRejectedValueOnce(new Error("Invalid spreadsheet ID"));

        const response = await exportService.exportToGoogleSheets({ tables });

        expect(response.results.length).toBe(tables.length);
        expect(response.results[0].tableId).toBe(tables[0].tableId);
        expect(response.results[0].status).toBe("failure");
        expect(response.results[1].tableId).toBe(tables[1].tableId);
        expect(response.results[1].status).toBe("success");
        expect(updateSpreadsheetMock).toHaveBeenCalledTimes(tables.length);
    });
});

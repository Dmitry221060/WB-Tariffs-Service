import { Test } from "@nestjs/testing";
import { querybuilder, knexMock } from "test/utils/knex-mock";
import { fetchSpy, fetchJsonResponseMock } from "test/utils/fetch-mock";
import fakeTariffsResponse from "test/fakes/wb-tariffs-response.json";
import { WorkerService } from "./worker.service";
import { ExportService } from "#app/export/export.service.js";

fetchJsonResponseMock.mockReturnValue(fakeTariffsResponse);
const exportToGoogleSheetsMock = jest.fn(async () => ({ results: [] }));
querybuilder.select.mockResolvedValue([]);
jest.useFakeTimers();

describe("Worker", () => {
    let workerService: WorkerService;
    const tariffsEndpoint = "https://common-api.wildberries.ru/api/v1/tariffs/box";
    const testTableId = "1N0fxfJirp5zJJaWGpS0y4iMarrEuc80GtsK2VrW2IdA";

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [WorkerService, ExportService],
        })
            .overrideProvider(ExportService)
            .useValue({ exportToGoogleSheets: exportToGoogleSheetsMock })
            .compile();

        workerService = moduleRef.get(WorkerService);

        jest.clearAllMocks();
    });

    it("should create a query schedule on startup", () => {
        const workerSpy = jest.spyOn(workerService, "query");

        workerService.onModuleInit();

        expect(workerSpy).toHaveBeenCalledTimes(1);
        jest.runOnlyPendingTimers();
        expect(workerSpy).toHaveBeenCalledTimes(2);
        workerSpy.mockRestore();
    });

    it("should fetch tariffs from WB API", async () => {
        await workerService.query();

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(fetchSpy.mock.lastCall[0]).toContain(tariffsEndpoint);
    });

    it("should fetch tariffs by date", async () => {
        const date = "2025-01-01";
        const expectedUrl = `${tariffsEndpoint}?date=${date}`;

        await workerService.query({ date });

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(fetchSpy.mock.lastCall[0]).toBe(expectedUrl);
    });

    it("should update tariffs in database", async () => {
        await workerService.query();

        expect(knexMock).toHaveBeenCalledWith("warehouseBoxRates");
        expect(querybuilder.insert).toHaveBeenCalledTimes(1);
    });

    it("should export fetched tariffs", async () => {
        querybuilder.select.mockResolvedValueOnce([{ spreadsheet_id: testTableId }]);

        await workerService.query();

        expect(exportToGoogleSheetsMock).toHaveBeenCalledTimes(1);
        expect(exportToGoogleSheetsMock).toHaveBeenCalledWith({ tables: [{ tableId: testTableId }] });
    });
});

import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { WBAPIBoxTariffsResponse } from "./dto/wb-api-response.dto";
import { TriggerQueryRequestDto } from "./dto/trigger-query.dto";
import env from "#config/env/env.js";
import { ExportService } from "#app/export/export.service.js";
import { WarehouseBoxRatesEntity } from "#postgres/entities/warehouseBoxRate.entity.js";
import knex from "#postgres/knex.js";

@Injectable()
export class WorkerService implements OnModuleInit, OnModuleDestroy {
    private scheduledQueryTimer!: NodeJS.Timeout;

    constructor(private readonly exportService: ExportService) {}

    async query(queryOptions?: TriggerQueryRequestDto) {
        if (queryOptions?.resetSchedule) {
            if (this.scheduledQueryTimer != null) clearInterval(this.scheduledQueryTimer);
            this.scheduledQueryTimer = setInterval(() => {
                this.query().catch((e) => console.log("Failed to query WB API", e));
            }, env.WORKER_QUERY_INTERVAL);
        }

        const date = queryOptions?.date ?? new Date().toISOString().substring(0, 10);
        const rawTariffData = await this.fetchTariffs(date);
        const warehouseBoxRates = rawTariffData.response.data.warehouseList.map((e) =>
            WarehouseBoxRatesEntity.fromWBFormat(e, date),
        );

        if (warehouseBoxRates.length > 0)
            await knex("warehouseBoxRates").insert(warehouseBoxRates).onConflict(["warehouseName", "forDate"]).merge();

        const dbSpreadsheets = await knex("spreadsheets").select();
        const destinationTables = dbSpreadsheets.map((e) => ({
            tableId: e.spreadsheet_id,
            address: e.target_range,
        }));

        const exportResults = await this.exportService.exportToGoogleSheets({ tables: destinationTables });
        exportResults.results
            .filter((e) => e.status == "failure")
            .forEach((e) => console.log(`Failed to update ${e.tableId} - ${e.error?.message}`));
    }

    private async fetchTariffs(date: string): Promise<WBAPIBoxTariffsResponse> {
        const queryParams = new URLSearchParams({ date });
        const url = `https://common-api.wildberries.ru/api/v1/tariffs/box?${queryParams}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${env.WB_API_KEY}`,
            },
        });

        const result = await response.json();
        if (response.status != 200) throw new Error(result.detail ?? response.statusText);

        return result as WBAPIBoxTariffsResponse;
    }

    onModuleInit() {
        this.query({ resetSchedule: true }).catch((e) => console.log("Failed to query WB API", e));
    }

    onModuleDestroy() {
        clearInterval(this.scheduledQueryTimer);
    }
}

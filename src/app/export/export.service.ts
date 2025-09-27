import { Injectable } from "@nestjs/common";
import { auth, sheets_v4, sheets } from "@googleapis/sheets";
import { ExportRequestDto, ExportResponseDto, ExportResultDto } from "./dto/export-tariffs.dto";
import env from "#config/env/env.js";
import { WarehouseBoxRatesEntity } from "#postgres/entities/warehouseBoxRate.entity.js";
import knex from "#postgres/knex.js";

@Injectable()
export class ExportService {
    private readonly defaultRange = "stocks_coefs!A1";
    private client: sheets_v4.Sheets;

    constructor() {
        const _auth = new auth.GoogleAuth({
            keyFile: env.GOOGLE_API_KEYFILE,
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });
        this.client = sheets({ version: "v4", auth: _auth });
    }

    async exportToGoogleSheets(dto: ExportRequestDto): Promise<ExportResponseDto> {
        let dbQuery = knex("warehouseBoxRates").select("*");
        if (dto.forDate) dbQuery = dbQuery.where("forDate", dto.forDate);
        const dbRates = await dbQuery.orderByRaw(
            'COALESCE("boxDeliveryCoefExpr", "boxDeliveryMarketplaceCoefExpr", "boxStorageCoefExpr") ASC',
        );
        /*[
            { column: "boxDeliveryCoefExpr", order: "asc" },
            { column: "boxDeliveryMarketplaceCoefExpr", order: "asc" },
            { column: "boxStorageCoefExpr", order: "asc" },
        ]);*/
        const data = dbRates.map((e) => WarehouseBoxRatesEntity.toExcelFormat(e)).flat(1);

        const requests = dto.tables.map((tableInfo) => {
            return this.updateSpreadsheet(tableInfo.tableId, data, tableInfo.address);
        });

        const responses = await Promise.allSettled(requests);
        const results: ExportResultDto[] = [];
        responses.forEach((response, i) => {
            const result: ExportResultDto = {
                tableId: dto.tables[i].tableId,
                status: "success",
            };

            if (response.status == "rejected") {
                result.status = "failure";
                const rejectReason = response.reason;
                const innerError = rejectReason?.response?.data?.error ?? rejectReason;
                result.error = {
                    code: innerError?.code ?? 500,
                    message: innerError?.message ?? innerError ?? "Internal error",
                };
            }

            results.push(result);
        });

        return { results };
    }

    private async updateSpreadsheet(spreadsheetId: string, values: unknown[][], range?: string) {
        return this.client.spreadsheets.values.update({
            spreadsheetId,
            range: range ?? this.defaultRange,
            valueInputOption: "RAW",
            requestBody: {
                values,
            },
        });
    }
}

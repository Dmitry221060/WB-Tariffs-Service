import { Post, Body, Controller } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { ExportService } from "./export.service";
import { ExportRequestDto, ExportResponseDto } from "./dto/export-tariffs.dto";

@Controller("export")
export class ExportController {
    constructor(private readonly exportService: ExportService) {}

    @Post()
    @ApiOperation({
        summary: "Exports the tariff data to provided google spreadsheets",
    })
    async exportToGoogleSheets(@Body() dto: ExportRequestDto): Promise<ExportResponseDto> {
        return this.exportService.exportToGoogleSheets(dto);
    }
}

import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class ExportRequestDto {
    @IsArray()
    tables!: ExportTableDto[];

    @IsOptional()
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: "Date should be YYYY-MM-DD" })
    @ApiProperty({
        description: "Date for which to export tariffs. If not specified, tariffs for all dates are returned",
        example: new Date().toISOString().substring(0, 10),
    })
    forDate?: string;
}

export class ExportTableDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "ID of the table to export to",
        example: "1QPvcIcmNU1QbZYRF__rrjIC4C1F0Ir3KI-YtIRCCWws",
        required: true,
    })
    tableId!: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "Address at which to insert the data",
        example: "Sheet1!A1",
    })
    address?: string;
}

export class ExportResponseDto {
    results!: ExportResultDto[];
}

export class ExportResultDto {
    status!: "success" | "failure";
    tableId!: string;
    error?: {
        code: number;
        message: string;
    };
}

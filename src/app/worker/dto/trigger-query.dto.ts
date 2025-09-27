import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, Matches } from "class-validator";

export class TriggerQueryRequestDto {
    @IsOptional()
    @IsBoolean()
    @ApiProperty({
        description: "If true, reset the timer of next scheduled query to max duration.",
        example: false,
    })
    resetSchedule?: boolean;

    @IsOptional()
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: "Date should be YYYY-MM-DD" })
    @ApiProperty({
        description: "Date to query tariffs for.",
        example: new Date().toISOString().substring(0, 10),
    })
    date?: string;
}

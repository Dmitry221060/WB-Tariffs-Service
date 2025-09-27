import { Post, Body, Controller } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { WorkerService } from "./worker.service";
import { TriggerQueryRequestDto } from "./dto/trigger-query.dto";

@Controller("worker")
export class WorkerController {
    constructor(private readonly workerService: WorkerService) {}

    @Post("/query")
    @ApiOperation({
        summary: "Manually trigger query to WB API to update tariff info",
    })
    async triggerQuery(@Body() dto: TriggerQueryRequestDto) {
        return this.workerService.query(dto);
    }
}

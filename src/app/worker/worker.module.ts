import { Module } from "@nestjs/common";
import { WorkerController } from "./worker.controller";
import { WorkerService } from "./worker.service";
import { ExportService } from "#app/export/export.service.js";

@Module({
    controllers: [WorkerController],
    providers: [WorkerService, ExportService],
})
export class WorkerModule {}

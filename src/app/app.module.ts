import { Module } from "@nestjs/common";
import { ExportModule } from "./export/export.module";
import { WorkerModule } from "./worker/worker.module";
import { HealthModule } from "./health/health.module";

@Module({
    imports: [ExportModule, WorkerModule, HealthModule],
})
export class AppModule {}

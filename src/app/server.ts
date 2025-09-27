import { NestFactory } from "@nestjs/core";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "./app.module";
import env from "#config/env/env.js";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });

    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.use(helmet());
    createSwagger(app);

    const port = env.APP_PORT ?? 5000;
    await app.listen(port);
    console.log(`Server running at port ${port}`);
}

function createSwagger(app: INestApplication) {
    const options = new DocumentBuilder()
        .setTitle("WB-Tariffs-Service")
        .setDescription("https://github.com/Dmitry221060/WB-Tariffs-Service")
        .build();

    const documentFactory = () => SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("api-docs", app, documentFactory);
}

export default {
    start: bootstrap,
};

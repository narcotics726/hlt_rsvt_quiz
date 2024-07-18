import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CouchService } from './infra/couch/couch.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // init
    CouchService.initDb();

    await app.listen(3001);
}
bootstrap();

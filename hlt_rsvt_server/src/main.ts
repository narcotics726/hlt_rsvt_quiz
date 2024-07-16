import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CouchService } from './infra/couch/couch.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // init
    const couchService = await app.resolve(CouchService);
    await couchService.getScope();

    await app.listen(3001);
}
bootstrap();

import { Global, Module } from '@nestjs/common';
import { CouchService } from './couch.service';

@Global()
@Module({
    providers: [CouchService],
    exports: [CouchService],
})
export class CouchModule {}

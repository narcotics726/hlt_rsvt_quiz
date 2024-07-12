import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsResolver } from './reservations.resolver';
import { CouchModule } from 'src/infra/couch/couch.module';

@Module({
    imports: [CouchModule],
    providers: [ReservationsService, ReservationsResolver],
})
export class ReservationsModule {}

import { Args, Query, Resolver } from '@nestjs/graphql';
import { Reservation } from './models/reservation.model';
import { ReservationsService } from './reservations.service';

@Resolver((of) => Reservation)
export class ReservationsResolver {
    constructor(private rsvtSvc: ReservationsService) {}

    @Query((returns) => Reservation)
    async reservation(@Args('id', { type: () => String }) id: string) {
        return this.rsvtSvc.findOneById(id);
    }
}

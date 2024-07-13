import { Args, Query, Resolver } from '@nestjs/graphql';
import { ReservationsService } from './reservations.service';

@Resolver('Reservation')
export class ReservationsResolver {
    constructor(private rsvtSvc: ReservationsService) {}

    @Query()
    async reservation(@Args('id') id: string) {
        return this.rsvtSvc.findOneById(id);
    }

    @Query()
    async reservations(
        @Args('first') first: number = 5,
        @Args('offset') offset: number = 0,
    ) {
        return this.rsvtSvc.findAll(first, offset);
    }
}

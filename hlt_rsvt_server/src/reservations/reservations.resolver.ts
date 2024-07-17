import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReservationsService } from './reservations.service';
import { ReservationInput } from 'src/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
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
        @Args('status') status?: string,
        @Args('timeRange') timeRange?: { from?: string; until?: string },
    ) {
        console.log(
            `[reservations] first: ${first}, offset: ${offset}, status: ${status}`,
        );
        return this.rsvtSvc.findAll(first, offset, timeRange, status);
    }

    @Mutation()
    async modifyReservation(
        @Args('id') id: string,
        @Args('rsvt') rsvt: ReservationInput,
    ) {
        return this.rsvtSvc.update(id, rsvt);
    }
}

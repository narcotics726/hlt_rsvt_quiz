import { Injectable } from '@nestjs/common';
import { ReservationInput } from 'src/graphql';
import { CouchService } from 'src/infra/couch/couch.service';

@Injectable()
export class ReservationsService {
    constructor(private readonly couchService: CouchService) {}

    async findOneById(id: string) {
        return this.couchService.findReservationById(id);
    }

    async findAll(
        first: number,
        offset: number,
        timeRange?: { from?: string; until?: string },
        status?: string,
    ) {
        const result = await this.couchService.findAllReservations(
            first,
            offset,
            timeRange,
            status,
        );

        console.log(
            `[reservations] first: ${first}, offset: ${offset}, status: ${status}, result: ${JSON.stringify(result)}`,
        );

        return result;
    }

    async update(id: string, rsvt: ReservationInput) {
        return this.couchService.updateReservation(id, rsvt);
    }
}

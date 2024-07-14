import { Injectable } from '@nestjs/common';
import { ReservationInput } from 'src/graphql';
import { CouchService } from 'src/infra/couch/couch.service';

@Injectable()
export class ReservationsService {
    constructor(private readonly couchService: CouchService) {}

    async findOneById(id: string) {
        return this.couchService.findReservationById(id);
    }

    async findAll(first: number, offset: number) {
        return this.couchService.findAllReservations(first, offset);
    }

    async update(id: string, rsvt: ReservationInput) {
        return this.couchService.updateReservation(id, rsvt);
    }
}

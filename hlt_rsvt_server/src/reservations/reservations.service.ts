import { Injectable } from '@nestjs/common';
import { CouchService } from 'src/infra/couch/couch.service';

@Injectable()
export class ReservationsService {
    constructor(private readonly couchService: CouchService) {}

    async findOneById(id: string) {
        return { id };
    }
}

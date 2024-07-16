import { Injectable } from '@nestjs/common';
import { CouchService } from './couch/couch.service';

@Injectable()
export class BaseDAL {
    // #TODO: abstract the CouchService to DatabaseService
    constructor(protected readonly couchService: CouchService) {}
}

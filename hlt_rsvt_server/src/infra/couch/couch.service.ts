import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CouchService {
    constructor(private readonly configService: ConfigService) {}

    async init() {
        console.log(this.configService.get('HLT_RSVT_COUCH_CONNSTR'));
    }
}

import * as path from 'node:path';

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ReservationsModule } from './reservations/reservations.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            typePaths: ['./**/*.graphql'],
            definitions: {
                path: path.join(process.cwd(), 'src/graphql.ts'),
                outputAs: 'class',
            },
        }),
        ConfigModule.forRoot({ isGlobal: true }),
        ReservationsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

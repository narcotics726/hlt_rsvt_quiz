import * as path from 'node:path';

import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ReservationsModule } from './reservations/reservations.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

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
        AuthModule,
        UsersModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}

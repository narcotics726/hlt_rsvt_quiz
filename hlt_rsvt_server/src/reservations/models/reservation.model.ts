import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Reservation {
    @Field((type) => String)
    id: string;
}


/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class Reservation {
    id: string;
    customerName: string;
    customerPhone: string;
    status: string;
    tableSize: number;
    time: string;
}

export class PaginationOfReservation {
    totalCount: number;
    reservations?: Nullable<Nullable<Reservation>[]>;
}

export abstract class IQuery {
    abstract reservation(id: string): Nullable<Reservation> | Promise<Nullable<Reservation>>;

    abstract reservations(first?: Nullable<number>, offset?: Nullable<number>): Nullable<PaginationOfReservation> | Promise<Nullable<PaginationOfReservation>>;
}

type Nullable<T> = T | null;

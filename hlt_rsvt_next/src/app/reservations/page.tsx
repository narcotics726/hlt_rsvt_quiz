import Link from 'next/link';
import { findReservations } from '../actions';
import {
    CancelReservationButton,
    EditReservationButton,
} from '../ui/resv-button';
import CustomerReservationTable from '../ui/customer-resv-table';

export default async function Page() {
    const reservations = await findReservations();

    return (
        <CustomerReservationTable
            reservations={reservations}
        ></CustomerReservationTable>
    );
}

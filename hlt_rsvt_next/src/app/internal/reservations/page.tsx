import { empGetReservations } from '@/app/actions';
import { EmployeeReservationsTable } from '@/app/ui/emp-resv-table';

export default async function Page({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        page?: string;
    };
}) {
    const page = Number(searchParams?.page || '1');

    const result = await empGetReservations((isNaN(page) ? 1 : page));
    const pages = Math.ceil(result.totalCount / 5);
    const reservations = result.reservations;

    return (
        <EmployeeReservationsTable
            reservations={reservations}
            page={page}
            pages={pages}
        ></EmployeeReservationsTable>
    );
}

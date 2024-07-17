import { empGetReservations } from '@/app/actions';
import { EmployeeReservationsTable } from '@/app/ui/emp-resv-table';

export default async function Page({
    searchParams,
}: {
    searchParams?: {
        status?: string;
        from?: string;
        until?: string;
        page?: string;
    };
}) {
    const page = Number(searchParams?.page || '1');

    const result = await empGetReservations(
        isNaN(page) ? 1 : page,
        searchParams?.status,
        {
            from: searchParams?.from,
            until: searchParams?.until,
        }
    );
    const pages = Math.ceil(result.totalCount / 5);
    const reservations = result.reservations;

    return (
        <>
            <EmployeeReservationsTable
                reservations={reservations}
                page={page}
                pages={pages}
            ></EmployeeReservationsTable>
        </>
    );
}

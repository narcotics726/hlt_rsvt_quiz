import Link from 'next/link';
import { findReservations } from '../actions';
import {
    CancelReservationButton,
    EditReservationButton,
} from '../ui/resv-button';

export default async function Page() {
    const reservations = await findReservations();

    return (
        <div className="container mx-auto max-w-4xl bg-gray-50 p-4 shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold">Your Reservations</h1>
            <div>
                <Link
                    href="/reservations/create"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Add Reservation
                </Link>
            </div>
            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Table Size</th>
                        <th className="px-4 py-2">Time</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Operations</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.map((reservation) => (
                        <tr key={reservation.id}>
                            <td className="border px-4 py-2">
                                {reservation.tableSize}
                            </td>
                            <td className="border px-4 py-2">
                                {reservation.time}
                            </td>
                            <td className="border px-4 py-2">
                                {reservation.status}
                            </td>
                            <td className="border px-4 py-2">
                                <EditReservationButton id={reservation.id} isDisabled={reservation.status !== 'pending'}/>
                                <CancelReservationButton id={reservation.id} isDisabled={reservation.status !== 'pending'}/>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

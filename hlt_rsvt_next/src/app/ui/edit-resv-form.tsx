/*

 */
'use client';
import { editReservation, State } from '@/app/actions';
import { useFormState } from 'react-dom';

export default function EditReservationForm({
    reservation,
}: {
    reservation: {
        id: string;
        customerName: string;
        customerPhone: string;
        tableSize: string;
        time: string;
    };
}) {
    console.log(`[EditReservationForm] reservation: ${JSON.stringify(reservation)}`);
    const updateWithId = editReservation.bind(null, reservation.id);
    return (
        <div className="container mx-auto max-w-4xl bg-gray-50 p-4 shadow-lg rounded-lg">
            <form action={updateWithId} className="space-y-6 p-6">
                <label
                    htmlFor="customerName"
                    className="block text-sm font-medium text-gray-700"
                >
                    Name
                </label>
                <input
                    id="customerName"
                    name="customerName"
                    type="text"
                    defaultValue={reservation.customerName}
                    aria-describedby="customerName-error"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />

                <label
                    htmlFor="customerPhone"
                    className="block text-sm font-medium text-gray-700"
                >
                    Phone
                </label>
                <input
                    type="number"
                    id="customerPhone"
                    name="customerPhone"
                    defaultValue={reservation.customerPhone}
                    readOnly
                    aria-describedby="customerPhone-error"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />

                <label
                    htmlFor="tableSize"
                    className="block text-sm font-medium text-gray-700"
                >
                    Table size
                </label>
                <input
                    type="string"
                    id="tableSize"
                    name="tableSize"
                    defaultValue={reservation.tableSize}
                    aria-describedby="tableSize-error"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <label
                    htmlFor="time"
                    className="block text-sm font-medium text-gray-700"
                >
                    Reservation time
                </label>
                <input
                    type="datetime-local"
                    id="time"
                    name="time"
                    defaultValue={reservation.time.slice(0, -8)}
                    aria-describedby="time-error"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />

                <button
                    type="submit"
                    className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
                >
                    Update reservation
                </button>
            </form>
        </div>
    );
}

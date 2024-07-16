'use client';
import { createReservation, State } from '@/app/actions';
import { useFormState } from 'react-dom';

export default function CreateReservationForm(props: { phone: string | null }) {
    const initialState: State = { message: null, errors: {} };
    const [state, formAction] = useFormState(createReservation, initialState);
    return (
        <div className="container mx-auto max-w-4xl bg-gray-50 p-4 shadow-lg rounded-lg">
            <form action={formAction} className="space-y-6 p-6">
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
                    defaultValue={'Fred Fox'}
                    aria-describedby="customerName-error"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div
                    id="customerName-error"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {state.errors?.customerName &&
                        state.errors.customerName.map((error: string) => (
                            <p
                                className="mt-2 text-sm text-red-500"
                                key={error}
                            >
                                {error}
                            </p>
                        ))}
                </div>

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
                    defaultValue={props.phone || ''}
                    readOnly
                    aria-describedby="customerPhone-error"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div
                    id="customerPhone-error"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {state.errors?.customerPhone &&
                        state.errors.customerPhone.map((error: string) => (
                            <p
                                className="mt-2 text-sm text-red-500"
                                key={error}
                            >
                                {error}
                            </p>
                        ))}
                </div>

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
                    defaultValue={'2'}
                    aria-describedby="tableSize-error"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div id="tableSize-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.tableSize &&
                        state.errors.tableSize.map((error: string) => (
                            <p
                                className="mt-2 text-sm text-red-500"
                                key={error}
                            >
                                {error}
                            </p>
                        ))}
                </div>

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
                    defaultValue={new Date().toISOString().slice(0, -8)}
                    aria-describedby="time-error"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div id="time-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.time &&
                        state.errors.time.map((error: string) => (
                            <p
                                className="mt-2 text-sm text-red-500"
                                key={error}
                            >
                                {error}
                            </p>
                        ))}
                </div>

                <button
                    type="submit"
                    className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
                >
                    Make a reservation
                </button>
            </form>
        </div>
    );
}

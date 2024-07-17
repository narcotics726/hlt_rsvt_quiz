'use client';
import { createReservation, State } from '@/app/actions';
import { Input, Select, SelectItem } from '@nextui-org/react';
import { useFormState } from 'react-dom';

export default function CreateReservationForm(props: {
    phone?: string | null;
}) {
    const initialState: State = { message: null, errors: {} };
    const [state, formAction] = useFormState(createReservation, initialState);
    return (
        <div className="container mx-auto max-w-4xl bg-gray-50 p-4">
            <form action={formAction} className="space-y-6 p-6">
                <label
                    htmlFor="customerName"
                    className="block text-sm font-medium text-gray-700"
                >
                    Name
                </label>
                <Input
                    id="customerName"
                    name="customerName"
                    type="text"
                    defaultValue={'Fred Fox'}
                    aria-describedby="customerName-error"
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
                <Input
                    name="customerPhone"
                    value={props.phone || ''}
                    isReadOnly
                    aria-describedby="customerPhone-error"
                    isRequired={false}
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
                <Select
                    name="tableSize"
                    aria-describedby="tableSize-error"
                    defaultSelectedKeys={'2'}
                >
                    <SelectItem key="2">2</SelectItem>
                    <SelectItem key="4">4</SelectItem>
                    <SelectItem key="6">6</SelectItem>
                    <SelectItem key="8">8</SelectItem>
                </Select>
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
                <Input
                    type="datetime-local"
                    id="time"
                    name="time"
                    defaultValue={new Date(Date.now() + 3600 * 1000).toISOString().slice(0, -8)}
                    aria-describedby="time-error"
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

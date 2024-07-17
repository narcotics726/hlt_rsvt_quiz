'use client';

import { useFormState } from "react-dom";
import { empAuth } from "../actions";

export default function EmpLoginForm() {
    const [state, formAction] = useFormState(empAuth, '');
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">HLT RESERVATION</h1>
            <form className="flex flex-col space-y-4" action={formAction}>
                <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    className="border border-gray-300 rounded-md px-4 py-2"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="border border-gray-300 rounded-md px-4 py-2"
                />
                {state && (
                    <p className="text-red-500 text-sm">{state}</p>
                )}
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
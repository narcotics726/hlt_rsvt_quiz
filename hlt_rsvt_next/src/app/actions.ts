'use server';

import { z } from 'zod';
import * as couchbase from 'couchbase';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Couch } from '@/lib/couch';
import bcrypt from 'bcrypt';
import { GqlClient } from '@/lib/gql_client';
import { gql } from '@apollo/client';

const CreateReservationFormSchema = z.object({
    customerName: z.string().min(2).max(50),
    customerPhone: z.string(),
    tableSize: z.string(),
    time: z.coerce.date(),
});

export type State = {
    errors?: {
        customerName?: string[];
        customerPhone?: string[];
        tableSize?: string[];
        time?: string[];
    };
    message?: string | null;
};

export async function createReservation(prevState: State, formData: FormData) {
    const rawFormData = Object.fromEntries(formData.entries());
    const validatedFields = CreateReservationFormSchema.safeParse(rawFormData);
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing fields. Failed to create invoice.',
        };
    }

    const scope = await Couch.getScope();
    const collection = scope.collection('reservations');
    await collection.upsert('reservation::' + Date.now(), {
        ...validatedFields.data,
        status: 'pending',
    });

    revalidatePath('/reservations');
    redirect('/reservations');
}

export async function getPhoneBySession(): Promise<string | null> {
    const sessionId = cookies().get('hlt-rsvt.session-token')?.value;
    const baseURL = process.env.HLT_RSVT_REST_SERVER_URL;
    const customerInfoAPI = '/auth/customer/info';

    const response = await fetch(baseURL + customerInfoAPI, {
        headers: {
            Authorization: `Bearer ${sessionId}`,
            ContentType: 'application/json',
        },
    });

    if (!response.ok) {
        return null;
    }

    return (await response.json()).phone;
}

export async function findReservationsBySessionId() {
    const scope = await Couch.getScope();
    const phone = await getPhoneBySession();
    if (!phone) {
        redirect('/reservations/create');
    }

    const query = `SELECT reservations.*, meta(reservations).id AS id FROM reservations WHERE customerPhone = $1 AND status <> 'cancelled'`;
    const result = await scope.query(query, { parameters: [phone] });
    if (result.rows.length === 0) {
        redirect('/reservations/create');
    }

    return result.rows;
}

export async function cancelReservation(id: string) {
    const scope = await Couch.getScope();
    const collection = scope.collection('reservations');
    const resv = await collection.get(id).catch(() => null);
    if (resv) {
        await collection.upsert(id, {
            ...resv.content,
            status: 'cancelled',
        });
    }

    revalidatePath('/reservations');
    redirect('/reservations');
}

export async function empAuth(prevState: string | null, formData: FormData) {
    const scope = await Couch.getScope();
    const query = `SELECT employees.*, meta(employees).id AS id FROM employees WHERE username = $1`;
    const result = await scope.query(query, {
        parameters: [formData.get('username')],
    });
    if (result.rows.length === 0) {
        return 'Invalid credentials';
    }

    const employee = result.rows[0];
    const pwd = formData.get('password')?.toString() ?? null;
    if (pwd === null) {
        return 'Invalid credentials';
    }
    const passwordMatch = await bcrypt.compare(pwd, employee.password);

    if (!passwordMatch) {
        return 'Invalid credentials';
    }

    // set jwt
    redirect('/internal/reservations');
}

export async function empGetReservations(page: number = 1) {
    const client = GqlClient.getClient();
    const offset = (page - 1) * 5;
    const result = await client.query({
        query: gql`
            {
                reservations(first: 5, offset: ${offset}) {
                    totalCount
                    reservations {
                        id
                        customerName
                        customerPhone
                        status
                        tableSize
                        time
                    }
                }
            }
        `,
    });

    return result.data.reservations;
}

export async function customerAuth(
    prevState: string | null,
    formData: FormData
) {
    const baseURL = process.env.HLT_RSVT_REST_SERVER_URL;
    const customerAuthAPI = `${baseURL}/auth/customer/login`;
    const { phone, verificationCode } = Object.fromEntries(formData.entries());

    const response = await fetch(customerAuthAPI, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, verificationCode }),
    });

    if (!response.ok) {
        return 'Invalid verification code';
    }

    cookies().set('hlt-rsvt.session-token', (await response.json()).access_token);

    redirect('/reservations');
}

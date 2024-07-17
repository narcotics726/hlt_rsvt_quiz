'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Couch } from '@/lib/couch';
import { GqlClient } from '@/lib/gql_client';
import { gql } from '@apollo/client';
import { ApiClient } from '@/lib/api_client';
import { v4 as uuidv4 } from 'uuid';

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

// #TODO: move all reservation r/w to RESTAPI

export async function createReservation(prevState: State, formData: FormData) {
    const rawFormData = Object.fromEntries(formData.entries());
    const validatedFields = CreateReservationFormSchema.safeParse(rawFormData);
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing fields. Failed to create invoice.',
        };
    }

    const datetime = new Date(validatedFields.data.time);
    // check if reservation time is at least 1 hour in the future
    if (datetime.getTime() - Date.now() < 3600 * 1000) {
        return {
            errors: { time: ['Reservation time must be at least 1 hour in the future'] },
            message: 'Invalid reservation time',
        };
    }

    const scope = await Couch.getScope();
    const collection = scope.collection('reservations');
    await collection.upsert(uuidv4(), {
        ...validatedFields.data,
        status: 'pending',
    });

    revalidatePath('/reservations');
    redirect('/reservations');
}

export async function editReservation(id: string, formData: FormData) {
    console.log(`[editReservation] id: ${id}`);
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
    await collection.upsert(id, {
        ...validatedFields.data,
        status: 'pending',
    });

    revalidatePath('/reservations');
    redirect('/reservations');
}

export async function getUserInfoFromCookie() {
    const token = cookies().get('hlt-rsvt.session-token')?.value;
    const info = cookies().get('hlt-rsvt.user-info')?.value;
    if (!info) {
        return ApiClient.getClient().getUserInfo(token);
    }

    const userInfo = JSON.parse(info);
    console.log(`[getCustomerInfo] userInfo: ${JSON.stringify(userInfo)}`);
    return userInfo;
}

export async function getCustomerPhone() {
    const userInfo = await getUserInfoFromCookie();

    return userInfo?.phone ?? null;
}

export async function findReservations() {
    const scope = await Couch.getScope();
    const phone = await getCustomerPhone();
    if (!phone) {
        redirect('/reservations/create');
    }

    const query = `SELECT reservations.*, meta(reservations).id AS id FROM reservations WHERE customerPhone = $1 ORDER BY time DESC`;
    const result = await scope.query(query, { parameters: [phone] });
    if (result.rows.length === 0) {
        redirect('/reservations/create');
    }

    const reservations = result.rows;
    const now = new Date();
    reservations.forEach((r) => {
        if (new Date(r.time) < now && r.status !== 'cancelled') {
            r.status = 'expired';
        }
    });

    return reservations;
}

export async function findReservationById(id: string) {
    const scope = await Couch.getScope();
    const collection = scope.collection('reservations');
    const doc = await collection.get(id).catch(() => null);
    if (!doc) {
        return null;
    }

    return {
        id,
        ...doc.content,
    };
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
    const username = (formData.get('username') ?? '') as string;
    const password = (formData.get('password') ?? '') as string;
    const result = await ApiClient.getClient().empLogin(username, password);
    if (!result) {
        return 'Invalid credential';
    }

    cookies().set('hlt-rsvt.session-token', result.access_token);
    const str = JSON.stringify({ role: 'employee', name: 'admin', id: 0 });
    cookies().set('hlt-rsvt.user-info', str);

    revalidatePath('/internal/reservations');
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

    const token = (await response.json()).access_token;

    cookies().set('hlt-rsvt.session-token', token);

    const info = await ApiClient.getClient().getUserInfo(token);
    const str = JSON.stringify({ phone: info?.phone, role: info?.role });
    cookies().set('hlt-rsvt.user-info', str);

    redirect('/reservations');
}

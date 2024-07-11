'use server';

import { z } from 'zod';
import * as couchbase from 'couchbase';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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

async function connectToCouch(): Promise<couchbase.Scope> {
    const cluster = await couchbase.connect('couchbase://localhost', {
        username: 'admin',
        password: '123456',
    });
    const bucket = cluster.bucket('default');

    return bucket.scope('hlt_reservation');
}

export async function createReservation(prevState: State, formData: FormData) {
    const rawFormData = Object.fromEntries(formData.entries());
    const validatedFields = CreateReservationFormSchema.safeParse(rawFormData);
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing fields. Failed to create invoice.',
        };
    }

    const scope = await connectToCouch();
    const collection = scope.collection('reservations');
    await collection.upsert('reservation::' + Date.now(), {
        ...validatedFields.data,
        status: 'pending',
    });

    const sessionPhoneCollection = scope.collection('sessions');
    await sessionPhoneCollection.upsert('session::' + cookies().get('hlt-rsvt.session-token')?.value, {
        phone: validatedFields.data.customerPhone,
    });

    revalidatePath('/reservations');
    redirect('/reservations');
}

export async function getPhoneBySession(): Promise<string | null> {
    const sessionId = cookies().get('hlt-rsvt.session-token')?.value;
    const scope = await connectToCouch();
    const session = await scope.collection('sessions').get('session::' + sessionId).catch(() => null);

    return (session?.content?.phone?.toString()) ?? null;
}

export async function findReservationsBySessionId() {
    const scope = await connectToCouch();
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
    const scope = await connectToCouch();
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

import { getPhoneBySession } from '@/app/actions';
import { CustomerLoginForm } from '@/app/ui/customer-login-form';
import { redirect } from 'next/navigation';

export default async function Page() {
    const phone = await getPhoneBySession();
    if (phone) {
        redirect('/reservations');
    }

    return <CustomerLoginForm />;
}

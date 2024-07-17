import { getCustomerPhone } from '@/app/actions';
import HLTBreadcrumbs from '@/app/ui/breadcrumbs';
import CreateReservationForm from '@/app/ui/create-resv-form';

export default async function Page() {
    const phone = await getCustomerPhone();
    return (
        <>
            <HLTBreadcrumbs
                items={[
                    { name: 'Reservations', href: '/reservations' },
                    {
                        name: 'Create reservation',
                        href: '/reservations/create',
                    },
                ]}
            ></HLTBreadcrumbs>
            <CreateReservationForm phone={phone}></CreateReservationForm>
        </>
    );
}

import { getPhoneBySession } from '@/app/actions';
import CreateReservationForm from '@/app/ui/create-resv-form';

export default async function Page() {
    const phone = await getPhoneBySession();
    return <CreateReservationForm phone={phone}></CreateReservationForm>;
}

import { findReservationById } from "@/app/actions";
import EditReservationForm from "@/app/ui/edit-resv-form";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const rsvt = await findReservationById(id);
    if (!rsvt) {
        console.log(`[reservations/${id}/edit] cannot find reservation`);
        notFound();
    }

    return (
        <EditReservationForm reservation={rsvt} ></EditReservationForm>
    );
}
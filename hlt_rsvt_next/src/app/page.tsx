import { Couch } from "@/lib/couch";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
  await Couch.initDb();
  redirect('/reservations/login');
}

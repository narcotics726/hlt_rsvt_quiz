import { Couch } from "@/lib/couch";

export async function GET() {
    console.log('/seed');

    await Couch.initDb();
    return Response.json({message: 'OK'});
}
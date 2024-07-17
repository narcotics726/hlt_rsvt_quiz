import { empAuth } from "@/app/actions";
import EmpLoginForm from "@/app/ui/emp-login-form";
import { useFormState } from "react-dom";

export default async function LoginPage() {
    return (
        <>
        <EmpLoginForm></EmpLoginForm>
        </>
    );
}

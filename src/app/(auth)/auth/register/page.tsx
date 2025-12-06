import AuthForm from "@/components/modules/Auth/AuthForm";
import AuthShell from "@/components/modules/Auth/AuthLayout";
import RegisterFields from "@/components/modules/Auth/RegisterForm";


export default function RegisterPage() {
  return (
    <AuthShell>
      <AuthForm
        title="Create your account"
        subtitle="Join thousands of travelers"
      >
        <RegisterFields />
      </AuthForm>
    </AuthShell>
  );
}

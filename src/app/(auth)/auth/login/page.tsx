import AuthForm from "@/components/modules/Auth/AuthForm";
import AuthShell from "@/components/modules/Auth/AuthLayout";
import LoginFields from "@/components/modules/Auth/LoginForm";


export default function LoginPage() {
  return (
    <AuthShell>
      <AuthForm
        title="Welcome back"
        subtitle="Sign in to access your account"
      >
        <LoginFields />
      </AuthForm>
    </AuthShell>
  );
}

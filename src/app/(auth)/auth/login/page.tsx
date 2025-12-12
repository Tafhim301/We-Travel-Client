import AuthForm from "@/components/modules/Auth/AuthForm";
import AuthShell from "@/components/modules/Auth/AuthLayout";
import LoginFields from "@/components/modules/Auth/LoginForm";
import { Suspense } from "react";


export default function LoginPage() {
  return (
    <AuthShell>
      <AuthForm
        title="Welcome back"
        subtitle="Sign in to access your account"
      >
        <Suspense fallback={<div className="text-sm text-slate-500">Loading...</div>}>
          <LoginFields />
        </Suspense>
      </AuthForm>
    </AuthShell>
  );
}

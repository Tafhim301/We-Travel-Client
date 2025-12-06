
import Logo from "@/components/shared/Logo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ReactNode } from "react";

export default function AuthForm({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="w-full max-w-md space-y-8 animate-fadeIn">
     

     <Card  className="px-5 shadow-xl">
        <CardHeader> 
     <div className=" flex items-center flex-col">
            <div className="mb-5"><Logo /></div>
        <h2 className="text-3xl font-bold dark:text-gray-200 text-gray-900">{title}</h2>
        <p className="mt-2 text-gray-400 text-sm">{subtitle}</p>
      </div>
        </CardHeader>

      <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}

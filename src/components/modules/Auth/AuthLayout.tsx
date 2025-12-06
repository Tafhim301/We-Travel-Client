import { ReactNode } from "react";
import Image from "next/image";
import Logo from "@/components/shared/Logo";

export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex w-full">
      {/* Left Side (image + branding) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900">
        <div className="absolute inset-0 bg-linear-to-b from-black/30 to-black/60 z-10" />

        <Image
          src="https://images.unsplash.com/photo-1686871804587-edba94d051b6?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000"
          alt="Travel Nature"
          className="absolute inset-0 w-full h-full object-cover"
          height={800}
          width={600}
        />

        <div className="relative z-20 flex flex-col justify-between h-full p-12 text-white">
         
         
          
       

          <blockquote className="text-2xl font-medium leading-relaxed">
            <Logo />
           &quot;Explore the world with trusted companions. Your journey begins here.&quot;
          </blockquote>
        </div>
      </div>

    
      <div className="flex-1 flex items-center justify-center p-8 ">
        {children}
      </div>
    </div>
  );
}

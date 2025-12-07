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
          src="https://plus.unsplash.com/premium_photo-1677343210638-5d3ce6ddbf85?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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

"use client"

import { useAuth } from "@/lib/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"


export default function Page() {
  const router = useRouter()
  const {user,loading} = useAuth()
    useEffect(() => {
    if (!loading && user) {
      router.push(user.role === "ADMIN"
        ? "/dashboard/admin/overview"
        : "/dashboard/overview"
      );
    }
  }, [loading, user, router]);
  return null}

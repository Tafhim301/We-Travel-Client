"use client"

import { useAuth } from "@/lib/context/AuthContext"
import { useRouter } from "next/navigation"


export default function Page() {
  const router = useRouter()
  const {user} = useAuth()
  return (

    router.push(user?.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/overview"))

  
}

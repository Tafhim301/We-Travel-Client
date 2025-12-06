import { Mountain } from 'lucide-react'
import Link from 'next/link'
import { greatVibes } from '@/app/fonts'

export default function Logo() {
  return (
    <div>
      <Link href="/" className="flex items-center group">
        <div className="bg-linear-to-br from-primary to-sky-500 p-2 rounded-lg mr-2 shadow-sm group-hover:scale-105 transition">
          <Mountain className="h-6 w-6 text-white" />
        </div>

        <h1
          className={`
            text-3xl font-bold tracking-tight 
            bg-linear-to-br from-primary to-sky-600 
            bg-clip-text text-transparent 
            ${greatVibes.className}
          `}
        >
          WeTravel
        </h1>
      </Link>
    </div>
  )
}

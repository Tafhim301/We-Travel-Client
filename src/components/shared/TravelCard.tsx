/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Image from 'next/image'
import { MapPin, Calendar } from 'lucide-react'


interface TravelCardProps {
  plan: any
  onClick?: () => void
}

export function TravelCard({ plan, onClick }: TravelCardProps) {
  const location = `${plan.destination.city}, ${plan.destination.country}`

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all"
    >
      {/* Image */}
      <div className="relative h-48 w-full">
        <Image
          src={plan.image}
          alt={plan.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
          {plan.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {plan.description}
        </p>

        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
            {plan.travelType}
          </span>

          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            {new Date(plan.startDate).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  )
}

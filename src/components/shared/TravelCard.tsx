/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  MapPin,
  Star,
  UserPlus,
  Users,
  Calendar,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Badge } from '../ui/badge'
import { format } from 'date-fns'

export function TravelCard({ plan, currentUser }: any) {
  const isHost = currentUser?._id === plan.user._id
  const isRated = plan.user.totalReviewsReceived > 0

  const handleJoin = async () => {
    if (!currentUser) {
      toast.warning('Login required')
      return
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/travel-requests/`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            travelPlan: plan._id,
            message: 'Excited to join!',
          }),
        }
      )

      const json = await res.json()
      if (!res.ok) throw new Error(json.message)

      toast.success('Request sent successfully')
    } catch (err: any) {
      toast.error(err.message || 'Request failed')
    }
  }


  return (
    <div className="group rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border hover:shadow-xl transition-all duration-300 flex flex-col">
    
      <div className="relative h-52 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-10" />
        <Image
          src={plan.image}
          alt={plan.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <Badge className="absolute top-4 right-4 z-20 backdrop-blur bg-white/20 border border-white/30 text-white">
          {plan.travelType}
        </Badge>

        <div className="absolute bottom-4 left-4 z-20 text-white">
          <div className="flex items-center text-sm font-medium">
            <MapPin className="h-4 w-4 mr-1" />
            {plan.destination.city}, {plan.destination.country}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-1 line-clamp-1 group-hover:text-primary transition">
          {plan.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {plan.description}
        </p>

        {/* Date */}
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4 mr-2" />
          {format(new Date(plan.startDate), 'PPP')} —{' '}
          {format(new Date(plan.endDate), 'PPP')}
        </div>

    
        <div className="flex justify-between items-center text-sm font-medium mb-4">
          <div>
            ৳{plan.budgetRange.min.toLocaleString()} — ৳
            {plan.budgetRange.max.toLocaleString()}
          </div>

      <Badge variant={"outline"}>
        <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-4 w-4" />
            {plan.approvedMembers.length}/{plan.maxMembers}
          </div>
      </Badge>
        </div>

    
        <Link
          href={`/profile/${plan.user._id}`}
          className="flex items-center gap-3 pt-4 border-t mt-auto"
        >
          <Image
            src={plan.user.profileImage?.url}
            alt={"Profile Image"}
            width={36}
            height={36}
            className="h-9 w-9 rounded-full border-2 border-primary object-cover"
          />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Hosted by</p>
            <p className="text-sm font-medium leading-none flex items-center gap-1">
              {plan.user.name}
              {isRated && (
                <span className="flex items-center text-xs text-yellow-500 ml-1">
                  <Star className="h-3 w-3 mr-0.5" />
                  {plan.user.averageRating.toFixed(1)}
                </span>
              )}
            </p>
          </div>
        </Link>
      </div>

      {/* Actions */}
      <div className="p-5 pt-0 flex gap-2">
        <Link href={`/travel/${plan._id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            View Details
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>

        {!isHost && (
          <Button className='hover:cursor-pointer' onClick={handleJoin}>
            <UserPlus className="h-4 w-4 mr-1" />
            Join
          </Button>
        )}
      </div>
    </div>
  )
}

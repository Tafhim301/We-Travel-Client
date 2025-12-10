/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Star,  UserPlus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Badge } from '../ui/badge'

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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/travelRequests`,
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
    <div className="rounded-xl overflow-hidden bg-white dark:bg-slate-900 border hover:shadow-lg transition">
      <div className="relative h-48">
        <Image src={plan.image} alt={plan.title} fill className="object-cover" />
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-lg">{plan.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{plan.description}</p>

        {/* Preview */}
      <div className='flex items-center justify-between'>
         <Link href={plan.user._id}>
        <div className="text-xs text-gray-500 flex items-center gap-1 ">
         <Image height={10} width={10} className='h-10 w-10 rounded-full border-2 border-primary'  src={plan?.user?.profileImage?.url} alt='profile Image' /> Hosted By: {plan.user.name} ·{' '}
          {isRated ? (
            <span className="inline-flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500" />
              {plan.user.averageRating.toFixed(1)}
            </span>
          ) : (
            'Not rated yet'
          )}
        </div></Link>
         <div className='flex items-center justify-center text-shadow-gray-500'>
         <Badge variant={"outline"} className=''>  <Users className="w-4 h-4 text-shadow-gray-500"></Users> <p className='text-sm text-shadow-gray-500'>{plan?.approvedMembers?.length}/{plan.maxMembers}</p></Badge>
         </div>
      </div>

        <div className="flex items-center text-sm gap-2 mt-3 ml-2">
          <MapPin className="h-4 w-4" />
          {plan.destination.city}, {plan.destination.country}, {plan.destination.destination}
        </div>

        <div className="flex justify-between pt-2">
          <Link href={`/travel/${plan._id}`}>
            <Button size="sm" variant="outline">
              View Details
            </Button>
          </Link>

          {!isHost && (
            <Button size="sm" onClick={handleJoin}>
              <UserPlus className="h-4 w-4 mr-1" />
              Join
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

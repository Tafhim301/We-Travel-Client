import React from 'react'
import { MapPin, Calendar, Users, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardFooter, } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { TravelPlan } from '../../lib/mockData'
import { formatDate, formatCurrency } from '../../lib/utils'
import Image from 'next/image'
interface TravelCardProps {
  plan: TravelPlan
  onClick: () => void
}
export function TravelCard({ plan, onClick }: TravelCardProps) {
  return (
    <Card
      className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col cursor-pointer"
      onClick={onClick}
    >
      {/* Image Banner */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <Image
          src={plan.image}
          alt={plan.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          fill
        />
        <Badge
          variant="secondary"
          className="absolute top-4 right-4 z-20 backdrop-blur-md bg-white/20 border border-white/30 text-white"
        >
          {plan.type}
        </Badge>
        <div className="absolute bottom-4 left-4 z-20 text-white">
          <div className="flex items-center text-sm font-medium mb-1">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            {plan.destination}
          </div>
        </div>
      </div>

      <CardContent className="flex-1 p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {plan.title}
        </h3>

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Calendar className="h-4 w-4 mr-2 text-primary" />
          <span>
            {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
          </span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-medium text-gray-900">
            {formatCurrency(plan.budgetMin)} - {formatCurrency(plan.budgetMax)}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-1.5" />
            <span>
              {plan.members.length}/{plan.maxMembers}
            </span>
          </div>
        </div>

        <div className="flex items-center pt-4 border-t border-gray-100">
          <Avatar className="h-8 w-8 mr-2 border-2 border-white shadow-sm">
            <AvatarImage src={plan.host.avatar} />
            <AvatarFallback>{plan.host.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-xs text-gray-500">Hosted by</p>
            <p className="text-sm font-medium text-gray-900 line-clamp-1">
              {plan.host.name}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button
          className="w-full group-hover:bg-primary/90"
          variant="secondary"
        >
          View Details
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  )
}

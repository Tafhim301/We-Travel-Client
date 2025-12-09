/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import { TravelCard } from '@/components/shared/TravelCard'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'

export default function Explore() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('All')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/travelPlans`,
          { credentials: 'include' }
        )
        const json = await res.json()
        if (!res.ok || !json.success) throw new Error(json.message)
        setData(json.data)
      } catch (error: any) {
        toast.error(error.message || 'Failed to load travel plans')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const categories = ['All', "SOLO", "FAMILY", "FRIENDS", "COUPLE", 
  "BUSINESS", "ADVENTURE", "LEISURE", "EXCURSION"]

  const filteredPlans = useMemo(() => {
    return data.filter((plan) => {
      const matchesSearch =
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.destination.city
          .toLowerCase()
          .includes(searchTerm.toLowerCase())

      const matchesType =
        selectedType === 'All' || plan.travelType === selectedType

      return matchesSearch && matchesType
    })
  }, [data, searchTerm, selectedType])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar />

      <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Explore Adventures
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find your next trip and the perfect people to share it with.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-4 mb-8 sticky top-24 z-30">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Where do you want to go?"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-transparent border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedType(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                    selectedType === cat
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <Button variant="outline" className="hidden md:flex">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-xl bg-gray-200 dark:bg-slate-800 animate-pulse"
              />
            ))}
          </div>
        ) : filteredPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <TravelCard
                key={plan._id}
                plan={plan}
                onClick={() => {}}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
            No trips found
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

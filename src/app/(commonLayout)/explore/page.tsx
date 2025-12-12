/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { toast } from 'sonner'
import { TravelCard } from '@/components/shared/TravelCard'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/shared/Navbar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/lib/context/AuthContext'


const PAGE_SIZE = 9

export default function Explore() {
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])
  const [meta, setMeta] = useState<any>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [sort, setSort] = useState('-createdAt')
  const [page, setPage] = useState(1)

  const sortOptions = [
    { value: '-createdAt', label: 'Newest' },
    { value: 'createdAt', label: 'Oldest' },
    { value: 'startDate', label: 'Upcoming' },
    { value: '-startDate', label: 'Latest Starts' },
  ]

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()

      if (searchTerm) params.append('searchTerm', searchTerm.trim())
      if (selectedType !== 'All') params.append('travelType', selectedType)
      params.append('page', String(page))
      params.append('limit', String(PAGE_SIZE))
      params.append('sort', sort)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/travelPlans?${params.toString()}`,
        { credentials: 'include' }
      )

      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.message)

      setData(json.data)
      setMeta(json.meta)
    } catch (error: any) {
      toast.error(error.message || 'Failed to load travel plans')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [searchTerm, selectedType, sort, page])

  const categories = [
    'All',
    'SOLO',
    'FAMILY',
    'FRIENDS',
    'COUPLE',
    'BUSINESS',
    'ADVENTURE',
    'LEISURE',
    'EXCURSION',
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar />

      <div className="pt-28 pb-16 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Explore Adventures
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover trips & connect with travelers worldwide
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border mb-8 lg:sticky top-24 z-30">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                placeholder="Search by title..."
                className="w-full pl-9 py-2 rounded-lg border bg-transparent"
                value={searchTerm}
                onChange={(e) => {
                  setPage(1)
                  setSearchTerm(e.target.value)
                }}
              />
            </div>

            {/* Travel Type */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setPage(1)
                    setSelectedType(cat)
                  }}
                  className={`px-4 py-2 rounded-lg text-sm ${selectedType === cat
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-slate-800'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <Select
              value={sort}
              onValueChange={(value) => {
                setPage(1)
                setSort(value)
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <ExploreSkeleton />
        ) : data.length ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((plan) => (
                <TravelCard
                  key={plan._id}
                  plan={plan}
                  currentUser={user}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-10">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </Button>
              <Button disabled>
                Page {meta.page} / {meta.totalPage}
              </Button>
              <Button
                variant="outline"
                disabled={page === meta.totalPage}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <p className="text-center py-20 text-gray-500">
            No travel plans found
          </p>
        )}
      </div>


    </div>
  )
}

function ExploreSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-80 rounded-xl bg-gray-200 dark:bg-slate-800 animate-pulse"
        />
      ))}
    </div>
  )
}

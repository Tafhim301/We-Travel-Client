import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <div>    
       <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden 
    bg-linear-to-r from-primary/30 via-green-200  to-green-900/5 dark:from-primary-900 dark:via-blue-950 dark:to-slate-900">
     
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-linear-to-bl from-primary/10 dark:from-primary/5 to-transparent rounded-bl-[100px] opacity-60" />
      <div className="absolute bottom-0 left-0 -z-10 w-1/3 h-1/2 bg-linear-to-tr from-accent/10 dark:from-accent/5 to-transparent rounded-tr-[100px] opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary text-sm font-medium">
              <span className="flex h-2 w-2 rounded-full bg-primary dark:bg-primary mr-2"></span>
              The #1 Community for Travelers
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-[1.1] tracking-tight">
              Find Your Perfect <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">
                Travel Companion
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed">
              Connect with like-minded adventurers, plan unforgettable trips,
              and explore the world together. No more solo traveling unless
              you want to.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/explore">   <Button
                size="lg"
                className="text-lg px-8 h-14 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-1"

              >
                Start Exploring
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              </Link>
              <Link href="/how-it-works">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 h-14 rounded-full border-2 hover:bg-gray-50 dark:hover:bg-slate-900 dark:border-gray-600 dark:text-white"

                >
                  How it Works
                </Button>
              </Link>
            </div>

            <div className="flex items-center space-x-4 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-950 bg-gray-200 dark:bg-gray-700 overflow-hidden"
                  >
                    <Image
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt="User"
                      className="w-full h-full object-cover"
                      width={40}
                      height={40}
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-bold text-gray-900 dark:text-white">10,000+</span>{' '}
                travelers joined
              </div>
            </div>
          </div>

          <div className="relative lg:h-[600px] animate-slide-up hidden lg:block">
            {/* Abstract Composition */}
            <div className="absolute top-10 right-10 w-64 h-80 bg-gray-200 dark:bg-gray-700 rounded-4xl overflow-hidden shadow-2xl rotate-3 z-10">
              <Image
                src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Travel"
                className="w-full h-full object-cover"
                width={256}
                height={320}
              />
            </div>
            <div className="absolute top-40 left-10 w-64 h-80 bg-gray-200 dark:bg-gray-700 rounded-4xl overflow-hidden shadow-2xl -rotate-6 z-20">
              <Image
                src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Travel"
                className="w-full h-full object-cover"
                width={256}
                height={320}
              />
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-0 bg-white dark:bg-slate-900 dark:border dark:border-gray-700 p-4 rounded-2xl shadow-xl z-30 animate-bounce duration-3000">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Trip Status</p>
                  <p className="font-bold text-gray-900 dark:text-white">Confirmed</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-32 right-0 bg-white dark:bg-slate-900 dark:border dark:border-gray-700 p-4 rounded-2xl shadow-xl z-30 animate-bounce duration-4000">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Destination</p>
                  <p className="font-bold text-gray-900 dark:text-white">Bali, Indonesia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    </div>
  )
}

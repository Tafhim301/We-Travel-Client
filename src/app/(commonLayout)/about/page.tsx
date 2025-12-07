'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

export default function About() {
  return (
    <div className="bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 min-h-screen">
      {/* Hero / Intro Section */}
      <section className="relative overflow-hidden py-32 px-6 lg:py-48 bg-gradient-to-r from-primary/20 via-green-50 to-primary/10 dark:from-primary/900 dark:via-blue-950 dark:to-slate-900">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto text-center space-y-6"
        >
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">We-Travel</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We-Travel connects travelers worldwide, helping you find companions, join communities, and share experiences that make every journey unforgettable.
          </p>
          <Button className="mt-6 bg-primary text-white hover:bg-primary-700 px-8 py-4 rounded-full shadow-lg shadow-primary/30">
            Explore Communities
          </Button>
        </motion.div>
      </section>

      {/* Our Purpose */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32 flex flex-col-reverse md:flex-row items-center gap-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 space-y-6"
        >
          <h2 className="text-3xl font-semibold text-primary mb-4">Our Purpose</h2>
          <p className="text-lg text-secondary-500 leading-relaxed">
            Our goal is to foster meaningful connections among travelers. Whether you love hiking, photography, or foodie trips, you’ll find communities that share your passion and make your travels more exciting.
          </p>
          <ul className="space-y-3">
            {['Find travel companions easily', 'Join interest-based communities', 'Share your experiences', 'Discover unique adventures'].map((item, idx) => (
              <li key={idx} className="flex items-center space-x-3">
                <span className="text-primary dark:text-accent"><CheckCircle2 className="h-5 w-5" /></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 relative rounded-4xl overflow-hidden shadow-2xl"
        >
          <Image
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Our Purpose"
            className="w-full h-full object-cover"
            width={600}
            height={400}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </motion.div>
      </section>

      {/* Our Vision */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32 flex flex-col md:flex-row items-center gap-12">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 relative rounded-4xl overflow-hidden shadow-2xl"
        >
          <Image
            src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Our Vision"
            className="w-full h-full object-cover"
            width={600}
            height={400}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 space-y-6"
        >
          <h2 className="text-3xl font-semibold text-primary mb-4">Our Vision</h2>
          <p className="text-lg text-secondary-500 leading-relaxed">
            We envision a world where every traveler has a companion, a community, and a platform to share stories. Travel Buddy is not just an app—it’s a global travel community for explorers like you.
          </p>
          <ul className="space-y-3">
            {['Global traveler network', 'Inclusive communities', 'Story sharing platform', 'Memorable journeys'].map((item, idx) => (
              <li key={idx} className="flex items-center space-x-3">
                <span className="text-primary dark:text-accent"><CheckCircle2 className="h-5 w-5" /></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 text-center bg-gradient-to-r from-primary/10 via-green-50 to-primary/5 dark:from-primary/900 dark:via-blue-950 dark:to-slate-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          <h2 className="text-3xl font-semibold text-primary">Join the Adventure</h2>
          <p className="text-secondary-500 leading-relaxed">
            Start exploring communities, connecting with travelers, and making your next trip unforgettable.
          </p>
          <Button className="bg-primary text-white hover:bg-primary-700 px-10 py-4 rounded-full shadow-lg shadow-primary/30">
            Explore Communities
          </Button>
        </motion.div>
      </section>
    </div>
  )
}

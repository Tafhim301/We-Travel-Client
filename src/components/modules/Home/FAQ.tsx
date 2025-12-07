'use client'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'How do I find a travel companion?',
    answer:
      'You can search for travelers by destination, interests, and trip dates. Use our community filters to connect with like-minded adventurers.',
  },
  {
    question: 'Can I join multiple travel communities?',
    answer:
      'Yes! You can join as many communities as you like based on your interests such as hiking, photography, foodie trips, and more.',
  },
  {
    question: 'Is We-Travel free to use?',
    answer:
      'Yes, basic features are free. Premium features, like exclusive communities and advanced matching, are available through subscription plans.',
  },
  {
    question: 'How does We-Travel ensure safety?',
    answer:
      'We-Travel encourages verified profiles, community moderation, and user reviews to ensure safe and enjoyable travel experiences.',
  },
  {
    question: 'Can I share my travel stories?',
    answer:
      'Absolutely! You can post stories, photos, and tips in your communities to inspire and connect with other travelers.',
  },
]

export default function FAQSection() {
  return (
    <section className="bg-gray-50 dark:bg-slate-900 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* FAQ Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full h-[400px] lg:h-[500px] rounded-4xl overflow-hidden hidden lg:block shadow-2xl"
        >
          <Image
            src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Travel FAQ"
            className="object-cover w-full h-full hidden lg:block"
            fill
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
        </motion.div>

        {/* FAQ Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h2 className="text-4xl font-bold text-primary dark:text-accent">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-secondary-500 leading-relaxed">
            Get answers to the most common questions about connecting with travelers, joining communities, and planning your trips.
          </p>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Collapsible key={idx} className="border rounded-xl border-gray-200 dark:border-gray-700 shadow-sm">
                <CollapsibleTrigger className="flex justify-between items-center w-full p-4 text-left text-gray-900 dark:text-gray-100 font-medium text-lg hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                  {faq.question}
                  <ChevronDown className="ml-2 h-5 w-5 text-gray-400" />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6"
          >
            <p className="text-secondary-500 text-sm">
              Still have questions? Reach out to our support team for personalized help.
            </p>
            <Button className="mt-4 bg-primary text-white hover:bg-primary-700 px-8 py-3 rounded-full shadow-lg shadow-primary/30">
              Contact Support
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

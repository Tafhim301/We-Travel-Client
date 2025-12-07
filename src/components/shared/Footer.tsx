
import {
 
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
} from 'lucide-react'
import Logo from './Logo'

export function Footer() {
  return (
    <footer className="border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
             
                <Logo />
       
             
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Connect with like-minded travelers, plan unforgettable adventures,
              and explore the world together.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-primary text-sm transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-primary text-sm transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-primary text-sm transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-primary text-sm transition-colors"
                >
                  Press
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Explore</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-primary text-sm transition-colors"
                >
                  Find Partners
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-primary text-sm transition-colors"
                >
                  Destinations
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-primary text-sm transition-colors"
                >
                  Travel Guides
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-primary text-sm transition-colors"
                >
                  Safety
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-primary text-sm transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-primary text-sm transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-primary text-sm transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-primary text-sm transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-center items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} We-Travel. All rights reserved.
          </p>
          
        </div>
      </div>
    </footer>
  )
}

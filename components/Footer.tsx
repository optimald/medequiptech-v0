import Link from 'next/link'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <Image
                src="/logo.avif"
                alt="MedEquipTech"
                width={160}
                height={48}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Connecting medical equipment technicians and trainers with MedSpa practices, 
              dermatology clinics, and aesthetic centers nationwide for quick equipment 
              repair and comprehensive staff training.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/jobs" className="text-gray-300 hover:text-white transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/technicians" className="text-gray-300 hover:text-white transition-colors">
                  For Technicians
                </Link>
              </li>
              <li>
                <Link href="/trainers" className="text-gray-300 hover:text-white transition-colors">
                  For Trainers
                </Link>
              </li>
              <li>
                <Link href="/medspas" className="text-gray-300 hover:text-white transition-colors">
                  For MedSpa Practices
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="text-gray-300 hover:text-white transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-blue-400" />
                <span className="text-gray-300">(435) 731-8232</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-blue-400" />
                <span className="text-gray-300">support@medequiptech.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                <span className="text-gray-300">Nationwide Coverage</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-blue-400" />
                <span className="text-gray-300">24/7 Emergency Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 MedEquipTech. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

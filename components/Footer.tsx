import Link from 'next/link'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Description */}
          <p className="text-gray-300 mb-10 max-w-3xl mx-auto text-lg leading-relaxed">
            Connecting healthcare professionals with qualified medical equipment service providers nationwide. Find the right expertise for your medical equipment needs.
          </p>
          
          {/* Navigation Links */}
          <nav className="flex justify-center space-x-10 mb-10">
            <Link href="#" className="text-gray-300 hover:text-white transition-all duration-200 font-medium text-lg hover:scale-105">
              About
            </Link>
            <Link href="#" className="text-gray-300 hover:text-white transition-all duration-200 font-medium text-lg hover:scale-105">
              Contact us
            </Link>
            <Link href="/auth/signup" className="text-gray-300 hover:text-white transition-all duration-200 font-medium text-lg hover:scale-105">
              Sign Up
            </Link>
          </nav>
          
          {/* Social Media Icons */}
          <div className="flex justify-center space-x-6 mb-10">
            <a href="#" className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1" aria-label="Facebook">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1" aria-label="Instagram">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.49.49-1.078.875-1.766 1.164-.688.289-1.418.433-2.198.433s-1.51-.144-2.198-.433c-.688-.289-1.276-.674-1.766-1.164-.49-.49-.875-1.078-1.164-1.766C8.144 13.957 8 13.227 8 12.447s.144-1.51.433-2.198c.289-.688.674-1.276 1.164-1.766.49-.49 1.078-.875 1.766-1.164C10.937 6.8 11.667 6.656 12.447 6.656s1.51.144 2.198.433c.688.289 1.276.674 1.766 1.164.49.49.875 1.078 1.164 1.766.289.688.433 1.418.433 2.198s-.144 1.51-.433 2.198c-.289.688-.674 1.276-1.164 1.766z"/>
              </svg>
            </a>
            <a href="#" className="w-12 h-12 bg-blue-400 rounded-xl flex items-center justify-center hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1" aria-label="Twitter">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="#" className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1" aria-label="LinkedIn">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
          
          {/* Copyright */}
          <div className="border-t border-gray-700 pt-8">
            <p className="text-gray-400 text-sm font-medium">
              Copyrights ©2025 MedEquipTech Powered by MRP
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

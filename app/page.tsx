'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/auth-context'
import Footer from '@/components/Footer'
import ServiceIcon from '@/components/ServiceIcons'
import ProcessIcon from '@/components/ProcessIcons'
import FeatureIcon from '@/components/FeatureIcons'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Transparent Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-transparent border-b border-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Image
                src="/met-logo.png"
                alt="MedEquipTech"
                width={150}
                height={45}
                className="h-10 w-auto"
              />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-white hover:text-blue-300 font-medium transition-colors">
                Services
              </a>
              <a href="#how-it-works" className="text-white hover:text-blue-300 font-medium transition-colors">
                How It Works
              </a>
              <a href="#testimonials" className="text-white hover:text-blue-300 font-medium transition-colors">
                Testimonials
              </a>
              <a href="#pricing" className="text-white hover:text-blue-300 font-medium transition-colors">
                Pricing
              </a>
              <a href="/contact" className="text-white hover:text-blue-300 font-medium transition-colors">
                Contact
              </a>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Link
                  href="/dashboard"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="text-white hover:text-blue-300 px-4 py-2 text-sm font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/hero-banner.jpeg")',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Find Certified Medical Equipment
            <span className="block text-blue-300">Professionals Near You</span>
          </h1>
          <p className="text-2xl md:text-3xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed">
            Connect with vetted aesthetics service providers. Get expert equipment maintenance, 
            emergency repairs, and compliance support with 24-hour response times.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mb-12 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span className="text-lg font-semibold">500+ Certified Technicians</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span className="text-lg font-semibold">24-Hour Response</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span className="text-lg font-semibold">Licensed & Insured</span>
            </div>
          </div>
          
          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="bg-white hover:bg-gray-100 text-blue-900 px-8 py-4 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300">
              Search Services Now
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300">
              Emergency Service
            </button>
          </div>
        </div>
        
        {/* Enhanced Search Bar */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-40 w-full max-w-6xl px-4">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Service Type</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>All Services</option>
                  <option>Equipment Repair</option>
                  <option>Preventive Maintenance</option>
                  <option>Emergency Service</option>
                  <option>Training & Certification</option>
                  <option>Parts & Supplies</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input 
                  type="text" 
                  placeholder="Enter city, state, or ZIP"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search Now
                </button>
              </div>
            </div>
            
            {/* Quick Filters */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-3">
                <span className="text-sm text-gray-600 font-medium">Quick Filters:</span>
                <button className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200 transition-colors">
                  Emergency Service
                </button>
                <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors">
                  Same Day Available
                </button>
                <button className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition-colors">
                  Certified Technicians
                </button>
                <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors">
                  Licensed & Insured
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Browse by Service Provider Type Section */}
      <div className="py-32 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-6xl font-bold text-gray-900 mb-6">
              Browse by Service Provider Type
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Find the perfect service provider for your medical equipment needs. Each specialist brings unique expertise and certifications.
            </p>
            <a href="#" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-lg group">
              View all services
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
          
          {/* Service Provider Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {/* Technician Card */}
            <div className="group cursor-pointer">
              <div className="bg-white rounded-3xl p-8 text-center transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 border border-gray-100 hover:border-blue-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                    <ServiceIcon type="technician" className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-gray-900 font-bold text-xl mb-3 group-hover:text-blue-600 transition-colors">
                    Technician
                  </h3>
                  <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors mb-4">
                    Equipment repair & maintenance
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-blue-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Certified</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Trainer Card */}
            <div className="group cursor-pointer">
              <div className="bg-white rounded-3xl p-8 text-center transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 border border-gray-100 hover:border-green-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-700 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                    <ServiceIcon type="trainer" className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-gray-900 font-bold text-xl mb-3 group-hover:text-green-600 transition-colors">
                    Trainer
                  </h3>
                  <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors mb-4">
                    Staff training & certification
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-green-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Licensed</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Medical Director Card */}
            <div className="group cursor-pointer">
              <div className="bg-white rounded-3xl p-8 text-center transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 border border-gray-100 hover:border-purple-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-700 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                    <ServiceIcon type="medicalDirector" className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-gray-900 font-bold text-xl mb-3 group-hover:text-purple-600 transition-colors">
                    Medical Director
                  </h3>
                  <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors mb-4">
                    Clinical oversight & guidance
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-purple-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Board Certified</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Logistics Card */}
            <div className="group cursor-pointer">
              <div className="bg-white rounded-3xl p-8 text-center transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 border border-gray-100 hover:border-orange-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-700 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                    <ServiceIcon type="logistics" className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-gray-900 font-bold text-xl mb-3 group-hover:text-orange-600 transition-colors">
                    Logistics
                  </h3>
                  <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors mb-4">
                    Shipping & delivery services
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-orange-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Insured</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Parts Card */}
            <div className="group cursor-pointer">
              <div className="bg-white rounded-3xl p-8 text-center transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 border border-gray-100 hover:border-red-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                    <ServiceIcon type="parts" className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-gray-900 font-bold text-xl mb-3 group-hover:text-red-600 transition-colors">
                    Parts
                  </h3>
                  <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors mb-4">
                    Genuine replacement parts
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-red-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>OEM Quality</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Clinician Card */}
            <div className="group cursor-pointer">
              <div className="bg-white rounded-3xl p-8 text-center transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 border border-gray-100 hover:border-indigo-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                    <ServiceIcon type="clinician" className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-gray-900 font-bold text-xl mb-3 group-hover:text-indigo-600 transition-colors">
                    Clinician
                  </h3>
                  <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors mb-4">
                    Clinical consultation
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-indigo-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Expert</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom CTA */}
          <div className="text-center mt-20">
            <p className="text-gray-600 mb-6">Need a different type of service?</p>
            <Link
              href="/contact"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Contact Us
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what medical practices say about our service providers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <p className="text-gray-700 mb-6 italic">
                "The technician arrived within 2 hours and had our laser system running perfectly. 
                Professional, certified, and saved us thousands in downtime."
              </p>
              <div>
                <p className="font-semibold text-gray-900">Dr. Sarah Johnson</p>
                <p className="text-sm text-gray-600">MedSpa Aesthetics, Miami</p>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Our staff training was comprehensive and compliant. The trainer was knowledgeable 
                about all our equipment and safety protocols."
              </p>
              <div>
                <p className="font-semibold text-gray-900">Michael Chen</p>
                <p className="text-sm text-gray-600">Advanced Dermatology, LA</p>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Emergency service at 2 AM when our main system failed. They had us back online 
                in under 3 hours. Incredible response time!"
              </p>
              <div>
                <p className="font-semibold text-gray-900">Dr. Emily Rodriguez</p>
                <p className="text-sm text-gray-600">Premier Aesthetics, NYC</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              How MedEquipTech Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get connected with qualified service providers in 3 simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 text-white text-3xl font-bold">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Describe Your Equipment Issue
              </h3>
              <p className="text-gray-600 mb-6">
                Tell us what's wrong with your medical equipment - whether it's a malfunctioning 
                laser, calibration issues, or preventive maintenance needs.
              </p>
              <div className="flex justify-center">
                <ProcessIcon type="step1" className="w-16 h-16 text-blue-600" />
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-8 text-white text-3xl font-bold">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Get Matched with Certified Providers
              </h3>
              <p className="text-gray-600 mb-6">
                Our AI matches you with vetted technicians, trainers, and specialists who have 
                experience with your specific equipment and are available in your area.
              </p>
              <div className="flex justify-center">
                <ProcessIcon type="step2" className="w-16 h-16 text-green-600" />
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 text-white text-3xl font-bold">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Connect & Get Service
              </h3>
              <p className="text-gray-600 mb-6">
                Review provider profiles, certifications, and pricing. Schedule service immediately 
                or get emergency assistance within hours.
              </p>
              <div className="flex justify-center">
                <ProcessIcon type="step3" className="w-16 h-16 text-purple-600" />
              </div>
            </div>
          </div>
          
          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <p className="text-gray-600 mb-6">Ready to get started?</p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Equipment Help Now
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Become a MET Provider Section - Using the correct image */}
      <div className="py-24 bg-gradient-to-r from-gray-800 to-gray-900 text-white relative overflow-hidden"
           style={{
             backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/tech.jpeg')`,
             backgroundSize: 'cover',
             backgroundPosition: 'center',
             backgroundRepeat: 'no-repeat'
           }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-5xl font-bold mb-10">Become a MET Provider: Access New Opportunities.</h2>
            <div className="space-y-4 mb-12">
              <p className="text-2xl">Medical Directors</p>
              <p className="text-2xl">Trainers</p>
              <p className="text-2xl">Technicians/Engineers</p>
              <p className="text-2xl">Sprinter Van Drivers</p>
              <p className="text-2xl">Part Suppliers</p>
            </div>
            <Link
              href="/auth/signup"
              className="inline-block bg-white text-gray-900 px-12 py-5 rounded-2xl font-bold transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg"
            >
              Signup to work with MET
            </Link>
          </div>
        </div>
      </div>

      {/* Find Expert Professionals Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl font-bold text-gray-900 mb-10">
                Find expert professionals tailored for your medical equipment.
              </h2>
              <p className="text-2xl text-gray-600 mb-12">
                Connect with a network of thoroughly vetted and qualified service providers across all medical equipment categories, ensuring reliable maintenance and optimal performance for your practice.
              </p>
              
              {/* Left side image - woman receiving facial treatment */}
              <div className="mb-10">
                <Image
                  src="/featured-2.jpeg"
                  alt="Woman receiving facial treatment"
                  width={400}
                  height={400}
                  className="rounded-2xl w-full shadow-xl"
                />
              </div>
              
              {/* Mobile image for small screens */}
              <div className="lg:hidden mb-10">
                <Image
                  src="/featured-2.jpeg"
                  alt="Medical Equipment Service"
                  width={500}
                  height={400}
                  className="rounded-3xl w-full shadow-2xl"
                />
              </div>
            </div>
            
            <div className="relative">
              <div className="relative">
                <Image
                  src="/featured-1.jpeg"
                  alt="Medical Facility"
                  width={700}
                  height={500}
                  className="rounded-3xl w-full shadow-2xl"
                />
                <div className="absolute top-8 right-8 bg-blue-600 rounded-2xl p-8 shadow-2xl">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-white">10K+</div>
                    <div className="text-lg text-blue-100 font-semibold">Total Connections</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8 mt-12">
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                  <div className="flex items-start space-x-5">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-inner">
                      <FeatureIcon type="verified" className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 text-lg">Verified Professionals</h4>
                      <p className="text-gray-600">All service providers are thoroughly vetted and certified for quality assurance.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                  <div className="flex items-start space-x-5">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-inner">
                      <FeatureIcon type="noFees" className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 text-lg">No Service Fees</h4>
                      <p className="text-gray-600">Connect directly with providers without any hidden fees or commissions.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                  <div className="flex items-start space-x-5">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-inner">
                      <FeatureIcon type="secure" className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 text-lg">Secure Platform</h4>
                      <p className="text-gray-600">Your data and communications are protected with enterprise-grade security.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                  <div className="flex items-start space-x-5">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-inner">
                      <FeatureIcon type="guarantee" className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 text-lg">Satisfaction Guarantee</h4>
                      <p className="text-gray-600">We ensure you're completely satisfied with your service provider match.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-12">Find Your Ideal Service Provider. Begin Your Search.</h2>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <Link
              href="/equipment-help"
              className="inline-block bg-white text-blue-600 px-12 py-5 rounded-2xl font-bold transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-2 border-white hover:border-blue-100 text-lg"
            >
              Contact Us →
            </Link>
            <Link
              href="/auth/signup"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-2xl font-bold transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-2 border-blue-600 hover:border-blue-700 text-lg"
            >
              Sign Up Now →
            </Link>
          </div>
        </div>
      </div>
      
      {/* Trust & Credibility Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Why Choose MedEquipTech?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We ensure every service provider meets the highest standards for medical equipment services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Certification */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Certified Technicians</h3>
              <p className="text-gray-600 text-sm">
                All providers are certified in medical equipment maintenance and safety protocols
              </p>
            </div>
            
            {/* Insurance */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fully Insured</h3>
              <p className="text-gray-600 text-sm">
                Comprehensive liability and professional insurance coverage for all services
              </p>
            </div>
            
            {/* Licensing */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Licensed & Compliant</h3>
              <p className="text-gray-600 text-sm">
                State-licensed professionals meeting all regulatory requirements
              </p>
            </div>
            
            {/* Response Time */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">24-Hour Response</h3>
              <p className="text-gray-600 text-sm">
                Emergency service available with guaranteed response times
              </p>
            </div>
          </div>
          
          {/* Pricing Transparency */}
          <div className="mt-20 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-12 text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Transparent Pricing
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Get upfront quotes with no hidden fees. Starting rates for common services:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-2">Equipment Repair</h4>
                <p className="text-3xl font-bold text-blue-600 mb-2">$150+</p>
                <p className="text-sm text-gray-600">Per hour + parts</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-2">Preventive Maintenance</h4>
                <p className="text-3xl font-bold text-green-600 mb-2">$200+</p>
                <p className="text-sm text-gray-600">Per service visit</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-2">Emergency Service</h4>
                <p className="text-3xl font-bold text-red-600 mb-2">$300+</p>
                <p className="text-sm text-gray-600">After hours rate</p>
              </div>
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Detailed Quote
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-24 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Join thousands of healthcare professionals who trust MedEquipTech for their medical equipment needs. 
            Get connected with certified providers in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/auth/signup"
              className="bg-white hover:bg-gray-100 text-blue-900 px-8 py-4 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Get Equipment Help Now
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-2xl text-xl font-bold transition-all duration-300"
            >
              Contact Sales Team
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

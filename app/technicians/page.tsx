'use client'

import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Wrench, 
  Clock, 
  MapPin, 
  DollarSign, 
  Users, 
  Shield, 
  Zap, 
  Truck,
  Phone,
  Mail,
  Calendar,
  Star
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function TechniciansPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Image
                src="/logo.avif"
                alt="MedEquipTech"
                width={200}
                height={60}
                className="h-12 w-auto"
              />
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Link href="/dashboard">
                  <Button variant="outline">Go to Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/signin">
                    <Button variant="outline">Sign In</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button>Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Aesthetic Equipment Repair & Maintenance
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Join our network of qualified technicians dispatched to fix laser equipment, 
              aesthetic devices, and medical aesthetics technology across the country.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Join Our Network
                </Button>
              </Link>
              <Link href="/jobs?job_type=tech">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  View Available Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* What We Do */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What We Do
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We connect qualified technicians with MedSpa practices, dermatology clinics, 
              and tattoo removal shops that need immediate equipment repair to minimize downtime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wrench className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Equipment Repair</h3>
                <p className="text-gray-600">
                  Fix laser equipment, aesthetic devices, and medical aesthetics technology
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quick Dispatch</h3>
                <p className="text-gray-600">
                  Get dispatched to urgent repair calls within hours, not days
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Nationwide Coverage</h3>
                <p className="text-gray-600">
                  Work with practices across the country, expand your client base
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Equipment Types */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Equipment We Repair
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specialize in the latest aesthetic and medical equipment technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Laser Equipment', icon: Zap, color: 'bg-red-100 text-red-600' },
              { name: 'IPL Devices', icon: Zap, color: 'bg-orange-100 text-orange-600' },
              { name: 'RF Machines', icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
              { name: 'Ultrasound', icon: Zap, color: 'bg-green-100 text-green-600' },
              { name: 'Cryotherapy', icon: Zap, color: 'bg-blue-100 text-blue-600' },
              { name: 'Microdermabrasion', icon: Zap, color: 'bg-purple-100 text-purple-600' },
              { name: 'Hydrafacial', icon: Zap, color: 'bg-pink-100 text-pink-600' },
              { name: 'LED Therapy', icon: Zap, color: 'bg-indigo-100 text-indigo-600' }
            ].map((equipment, index) => (
              <Card key={index} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 ${equipment.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <equipment.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-medium text-gray-900">{equipment.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Our Dispatch System Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From job posting to completion, we handle the logistics so you can focus on repairs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Job Posted',
                description: 'MedSpa reports equipment issue and posts urgent repair job',
                icon: Calendar
              },
              {
                step: '2',
                title: 'Quick Dispatch',
                description: 'You receive notification and can accept the job immediately',
                icon: Zap
              },
              {
                step: '3',
                title: 'On-Site Repair',
                description: 'Travel to location, diagnose, and repair the equipment',
                icon: Wrench
              },
              {
                step: '4',
                title: 'Payment & Rating',
                description: 'Get paid quickly and build your reputation',
                icon: Star
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Join Our Network?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {[
                'Consistent job flow with urgent repair calls',
                'Competitive rates and quick payment processing',
                'Professional support and logistics coordination',
                'Build long-term relationships with MedSpa practices',
                'Expand your service area nationwide',
                'Access to specialized equipment training'
              ].map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              {[
                'Flexible scheduling - work when you want',
                'Professional liability coverage included',
                'Technical support and troubleshooting assistance',
                'Marketing materials and business cards provided',
                'Regular training on new equipment',
                'Community of experienced technicians'
              ].map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Fixing Equipment?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our network of qualified technicians and start receiving dispatch calls 
            for urgent equipment repairs across the country.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Join Our Network
              </Button>
            </Link>
            <Link href="/jobs?job_type=tech">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Browse Available Jobs
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>(435) 731-8232</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>support@medequiptech.com</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/jobs?job_type=tech" className="block text-gray-300 hover:text-white">
                  View Tech Jobs
                </Link>
                <Link href="/auth/signup" className="block text-gray-300 hover:text-white">
                  Sign Up
                </Link>
                <Link href="/auth/signin" className="block text-gray-300 hover:text-white">
                  Sign In
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <p className="text-gray-300">
                Connecting qualified technicians with MedSpa practices nationwide 
                for quick equipment repair and maintenance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

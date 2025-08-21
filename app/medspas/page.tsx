'use client'

import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  Wrench, 
  GraduationCap, 
  Clock, 
  MapPin, 
  DollarSign, 
  Truck, 
  Phone,
  Mail,
  Calendar,
  Star,
  CheckCircle,
  AlertTriangle,
  Zap,
  Shield,
  Users
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function MedSpasPage() {
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
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Quick Equipment Repair & Staff Training
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Get your aesthetic equipment back online quickly with qualified technicians 
              and comprehensive training for your staff. Minimize downtime, maximize revenue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/medspa-request">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  Get Equipment Help
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Alert */}
      <div className="bg-red-50 border-b border-red-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
            <span className="text-red-800 text-sm font-medium">
              If this is urgent, please call <strong className="whitespace-nowrap">(435) 731-8232</strong>
            </span>
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
              We connect MedSpa practices, dermatology clinics, and tattoo removal shops 
              with qualified technicians and trainers to keep your equipment running smoothly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wrench className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Equipment Repair</h3>
                <p className="text-gray-600">
                  Quick dispatch of qualified technicians to fix your aesthetic equipment
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Staff Training</h3>
                <p className="text-gray-600">
                  Comprehensive training for your staff on equipment operation and safety
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Logistics Support</h3>
                <p className="text-gray-600">
                  Equipment pickup and delivery coordination when on-site repair isn't possible
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
              Equipment We Service
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              All major brands and types of aesthetic and medical equipment
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
              How Our Service Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From equipment issue to resolution, we handle everything efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Report Issue',
                description: 'Contact us with your equipment problem or training need',
                icon: Phone
              },
              {
                step: '2',
                title: 'Quick Assessment',
                description: 'We assess the issue and determine the best solution',
                icon: Shield
              },
              {
                step: '3',
                title: 'Service Dispatch',
                description: 'Technician dispatched or logistics arranged within hours',
                icon: Truck
              },
              {
                step: '4',
                title: 'Resolution',
                description: 'Equipment fixed or staff trained, minimal downtime',
                icon: CheckCircle
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Options */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Service Options
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the service that best fits your needs and timeline
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-2 border-blue-200">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wrench className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">On-Site Repair</CardTitle>
                <CardDescription className="text-lg">
                  Qualified technician dispatched to your location
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>Same-day dispatch available</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>No equipment removal needed</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>Immediate diagnosis and repair</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>Minimal disruption to operations</span>
                  </div>
                </div>
                <div className="pt-4">
                  <Link href="/medspa-request">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Request On-Site Repair
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Equipment Pickup & Repair</CardTitle>
                <CardDescription className="text-lg">
                  When on-site repair isn't possible
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>Professional pickup coordination</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>Secure transport to repair facility</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>Thorough repair and testing</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>Quick return delivery</span>
                  </div>
                </div>
                <div className="pt-4">
                  <Link href="/medspa-request">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Arrange Pickup
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Training Services */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Staff Training Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ensure your staff is properly trained on all equipment for safety and efficiency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'New Equipment Training',
                description: 'Comprehensive training when you purchase new devices',
                icon: GraduationCap,
                color: 'bg-blue-100 text-blue-600'
              },
              {
                title: 'Refresher Training',
                description: 'Update existing staff on new protocols and safety measures',
                icon: Users,
                color: 'bg-green-100 text-green-600'
              },
              {
                title: 'New Staff Onboarding',
                description: 'Train new employees on your existing equipment',
                icon: Shield,
                color: 'bg-purple-100 text-purple-600'
              }
            ].map((service, index) => (
              <Card key={index} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className={`w-16 h-16 ${service.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <service.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <Link href="/medspa-request">
                    <Button variant="outline" className="w-full">
                      Request Training
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose MedEquipTech?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {[
                'Quick response times - same-day dispatch available',
                'Qualified, certified technicians and trainers',
                'Nationwide coverage and support',
                'Competitive pricing and transparent quotes',
                'Professional logistics coordination',
                'Ongoing support and maintenance plans'
              ].map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              {[
                'Minimize equipment downtime and revenue loss',
                'Ensure staff safety and compliance',
                'Extend equipment lifespan and performance',
                'Professional documentation and warranties',
                'Emergency support and priority scheduling',
                'Comprehensive service history tracking'
              ].map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Your Equipment Fixed?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Don't let equipment downtime cost you revenue. Get quick, professional 
            repair and training services from our qualified network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/medspa-request">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                Get Equipment Help
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                Create Account
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
                <Link href="/medspa-request" className="block text-gray-300 hover:text-white">
                  Get Equipment Help
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
                Connecting MedSpa practices with qualified technicians and trainers 
                for quick equipment repair and comprehensive staff training.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  GraduationCap, 
  Users, 
  Clock, 
  MapPin, 
  DollarSign, 
  Shield, 
  BookOpen, 
  Award,
  Phone,
  Mail,
  Calendar,
  Star,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function TrainersPage() {
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
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Staff Training & Equipment Certification
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Share your expertise with MedSpa staff, conduct comprehensive training sessions, 
              and establish yourself as a trusted industry educator.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                  Join Our Network
                </Button>
              </Link>
              <Link href="/jobs?job_type=trainer">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  View Training Jobs
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
              We connect qualified trainers with MedSpa practices, dermatology clinics, 
              and aesthetic centers that need comprehensive staff training on their equipment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Staff Training</h3>
                <p className="text-gray-600">
                  Train MedSpa staff on proper equipment operation and safety protocols
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Certification</h3>
                <p className="text-gray-600">
                  Provide official certification for staff on specific equipment types
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ongoing Support</h3>
                <p className="text-gray-600">
                  Offer follow-up training and support for new staff members
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Training Programs */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Training Programs We Offer
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive training covering all aspects of aesthetic equipment operation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                name: 'Laser Safety & Operation', 
                description: 'Comprehensive laser safety protocols and operation training',
                icon: Shield,
                color: 'bg-red-100 text-red-600'
              },
              { 
                name: 'IPL Device Training', 
                description: 'Intense Pulsed Light device operation and safety',
                icon: BookOpen,
                color: 'bg-orange-100 text-orange-600'
              },
              { 
                name: 'RF Machine Certification', 
                description: 'Radio Frequency device operation and protocols',
                icon: Award,
                color: 'bg-yellow-100 text-yellow-600'
              },
              { 
                name: 'Ultrasound Equipment', 
                description: 'Ultrasound device operation and maintenance',
                icon: BookOpen,
                color: 'bg-green-100 text-green-600'
              },
              { 
                name: 'Cryotherapy Training', 
                description: 'Cryotherapy device operation and safety',
                icon: Shield,
                color: 'bg-blue-100 text-blue-600'
              },
              { 
                name: 'General Aesthetics', 
                description: 'Overview of all aesthetic equipment types',
                icon: GraduationCap,
                color: 'bg-purple-100 text-purple-600'
              }
            ].map((program, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow h-full">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${program.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <program.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-center mb-2">{program.name}</h3>
                  <p className="text-gray-600 text-center text-sm">{program.description}</p>
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
              How Our Training System Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From initial contact to certification completion, we handle the coordination
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Training Request',
                description: 'MedSpa requests staff training for specific equipment',
                icon: Calendar
              },
              {
                step: '2',
                title: 'Trainer Assignment',
                description: 'You receive notification and can accept the training job',
                icon: Users
              },
              {
                step: '3',
                title: 'On-Site Training',
                description: 'Conduct comprehensive training sessions at the facility',
                icon: GraduationCap
              },
              {
                step: '4',
                title: 'Certification & Payment',
                description: 'Issue certifications and receive payment for services',
                icon: Award
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
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
              Why Become a Trainer?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {[
                'Share your expertise and help others succeed',
                'Flexible scheduling - train when it works for you',
                'Competitive rates for training sessions',
                'Build your reputation in the industry',
                'Access to new clients and facilities',
                'Professional development opportunities'
              ].map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              {[
                'Professional liability coverage included',
                'Training materials and curriculum provided',
                'Ongoing support and mentorship',
                'Marketing materials and business cards',
                'Regular updates on new equipment',
                'Community of experienced trainers'
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

      {/* Training Requirements */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trainer Requirements
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              What you need to become a certified trainer in our network
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Education</h3>
                <ul className="text-gray-600 space-y-2 text-center">
                  <li>• Relevant technical degree</li>
                  <li>• Equipment manufacturer training</li>
                  <li>• Industry certifications</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Experience</h3>
                <ul className="text-gray-600 space-y-2 text-center">
                  <li>• 3+ years equipment experience</li>
                  <li>• Training/teaching experience</li>
                  <li>• Customer service skills</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Certifications</h3>
                <ul className="text-gray-600 space-y-2 text-center">
                  <li>• Safety certifications</li>
                  <li>• Equipment-specific training</li>
                  <li>• Continuing education</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Training Staff?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our network of qualified trainers and start helping MedSpa practices 
            get the most out of their equipment investment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                Join Our Network
              </Button>
            </Link>
            <Link href="/jobs?job_type=trainer">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                Browse Training Jobs
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
                <Link href="/jobs?job_type=trainer" className="block text-gray-300 hover:text-white">
                  View Training Jobs
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
                Connecting qualified trainers with MedSpa practices nationwide 
                for comprehensive staff training and equipment certification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

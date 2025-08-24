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
  Star,
  CheckCircle,
  ArrowRight,
  Quote
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/components/Footer'

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

      {/* Hero Section - Updated with new headline */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Join the Future of Aesthetic Device Support
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto opacity-90">
              Be part of the most advanced network of qualified technicians dispatched to fix laser equipment, 
              aesthetic devices, and medical aesthetics technology across the country.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#apply-now">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 text-lg font-semibold">
                  Apply Now - Join Our Network
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/jobs?job_type=tech">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold bg-transparent">
                  Browse Available Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Who We're Looking For */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Who We're Looking For
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experienced technicians who are passionate about keeping aesthetic equipment running at peak performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-lg">
              <CardContent className="pt-8">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Certified & Experienced</h3>
                <p className="text-gray-600 text-lg">
                  Minimum 3+ years experience with laser equipment, aesthetic devices, and medical aesthetics technology
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-lg">
              <CardContent className="pt-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Truck className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Mobile & Available</h3>
                <p className="text-gray-600 text-lg">
                  Willing to travel to client locations and respond to urgent repair calls within hours
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-purple-100 hover:border-purple-300 transition-all hover:shadow-lg">
              <CardContent className="pt-8">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Professional & Reliable</h3>
                <p className="text-gray-600 text-lg">
                  Excellent customer service skills and a commitment to quality workmanship
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Why Partner with MET */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Partner with MET?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're not just another job board - we're your partner in building a successful equipment repair business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {[
                'Consistent job flow with urgent repair calls nationwide',
                'Competitive rates and quick payment processing (within 48 hours)',
                'Professional support and logistics coordination',
                'Build long-term relationships with MedSpa practices',
                'Expand your service area without marketing costs',
                'Access to specialized equipment training and certifications'
              ].map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 text-lg">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              {[
                'Flexible scheduling - work when you want, where you want',
                'Professional liability coverage included in partnership',
                'Technical support and troubleshooting assistance',
                'Marketing materials and business cards provided',
                'Regular training on new equipment and technology',
                'Referral bonuses for bringing other qualified techs'
              ].map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700 text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works - 3-Step Flow */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple 3-step process from application to your first repair job
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Apply & Get Approved',
                description: 'Submit your application with experience details. We review and approve qualified technicians within 48 hours.',
                icon: CheckCircle,
                color: 'bg-blue-600'
              },
              {
                step: '2',
                title: 'Receive Job Alerts',
                description: 'Get notified of urgent repair jobs in your area. Accept jobs that fit your schedule and expertise.',
                icon: Zap,
                color: 'bg-green-600'
              },
              {
                step: '3',
                title: 'Complete & Get Paid',
                description: 'Travel to location, repair equipment, and get paid quickly. Build your reputation and client base.',
                icon: Star,
                color: 'bg-purple-600'
              }
            ].map((step, index) => (
              <div key={index} className="text-center relative">
                <div className={`w-24 h-24 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold`}>
                  {step.step}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{step.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
                
                {/* Arrow connector */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 -right-4 w-8 h-0.5 bg-gray-300">
                    <div className="absolute right-0 top-0 w-0 h-0 border-l-8 border-l-gray-300 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Equipment Types */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Equipment We Support
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
              <Card key={index} className="text-center hover:shadow-lg transition-all hover:scale-105 border-2 border-transparent hover:border-gray-200">
                <CardContent className="pt-6">
                  <div className={`w-16 h-16 ${equipment.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <equipment.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">{equipment.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials/Spotlights */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from technicians who've transformed their careers with MET
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Mike Rodriguez",
                location: "Dallas, TX",
                experience: "5+ years experience",
                quote: "MET has completely changed my business. I went from struggling to find clients to having more work than I can handle. The support team is incredible.",
                rating: 5
              },
              {
                name: "Sarah Chen",
                location: "Los Angeles, CA",
                experience: "3+ years experience",
                quote: "The referral bonus program is amazing. I've earned over $2,000 just by referring other qualified technicians to the platform.",
                rating: 5
              },
              {
                name: "David Thompson",
                location: "Miami, FL",
                experience: "8+ years experience",
                quote: "I love the flexibility. I can work when I want, where I want, and the payment processing is lightning fast. Best decision I made for my career.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Quote className="w-8 h-8 text-blue-600 mr-2" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                      <p className="text-gray-600 text-sm">{testimonial.location} • {testimonial.experience}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How quickly can I start receiving job alerts?",
                answer: "Once approved, you'll start receiving job alerts immediately. Most technicians get their first job within 24-48 hours of approval."
              },
              {
                question: "What are the payment terms?",
                answer: "We process payments within 48 hours of job completion. You'll receive payment via direct deposit or check, depending on your preference."
              },
              {
                question: "Do I need my own insurance?",
                answer: "We provide professional liability coverage for all approved technicians. However, we recommend maintaining your own business insurance for additional protection."
              },
              {
                question: "How does the referral bonus program work?",
                answer: "Earn $200 for every qualified technician you refer who gets approved and completes their first job. There's no limit to how many referrals you can make!"
              },
              {
                question: "What if I'm not available for a job?",
                answer: "No problem! You're never obligated to accept any job. Simply decline and we'll find another technician. You only work when it's convenient for you."
              }
            ].map((faq, index) => (
              <Card key={index} className="hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div id="apply-now" className="py-20 bg-blue-600 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Join hundreds of successful technicians who've built thriving businesses with MET. 
            Apply now and start receiving job alerts within 48 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup?type=technician">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-4 text-xl font-bold">
                Apply Now - Join Our Network
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </Link>
            <Link href="/jobs?job_type=tech">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold bg-transparent">
                Browse Available Jobs
              </Button>
            </Link>
          </div>
          <p className="text-sm opacity-75 mt-4">
            Application takes less than 5 minutes • No commitment required • Start earning within 48 hours
          </p>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

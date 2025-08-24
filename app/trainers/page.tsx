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
  CheckCircle,
  ArrowRight,
  Quote
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

      {/* Hero Section - Updated with new headline */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Join the Future of Aesthetic Device Support
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto opacity-90">
              Share your expertise with MedSpa staff, conduct comprehensive training sessions, 
              and establish yourself as a trusted industry educator in the most advanced training network.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#apply-now">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-10 py-4 text-lg font-semibold">
                  Apply Now - Join Our Network
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/jobs?job_type=trainer">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg font-semibold bg-transparent">
                  View Training Jobs
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
              Experienced trainers who are passionate about educating staff on proper equipment operation and safety
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-lg">
              <CardContent className="pt-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <GraduationCap className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Certified & Educated</h3>
                <p className="text-gray-600 text-lg">
                  Relevant technical degree, manufacturer training, and industry certifications
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-lg">
              <CardContent className="pt-8">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Experienced & Skilled</h3>
                <p className="text-gray-600 text-lg">
                  3+ years equipment experience with proven training and teaching abilities
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-purple-100 hover:border-purple-300 transition-all hover:shadow-lg">
              <CardContent className="pt-8">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Safety-Focused</h3>
                <p className="text-gray-600 text-lg">
                  Strong emphasis on safety protocols and ongoing continuing education
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
              We're not just another training platform - we're your partner in building a successful training business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {[
                'Share your expertise and help others succeed in the industry',
                'Flexible scheduling - train when it works for you',
                'Competitive rates for training sessions and certifications',
                'Build your reputation as a trusted industry educator',
                'Access to new clients and facilities nationwide',
                'Professional development and exclusive opportunities'
              ].map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700 text-lg">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              {[
                'Professional liability coverage included in partnership',
                'Training materials and curriculum provided',
                'Ongoing support and mentorship opportunities',
                'Marketing materials and business cards',
                'Regular updates on new equipment and technology',
                'Referral bonuses for bringing other qualified trainers'
              ].map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
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
              Simple 3-step process from application to your first training session
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Apply & Get Approved',
                description: 'Submit your application with experience and certifications. We review and approve qualified trainers within 48 hours.',
                icon: CheckCircle,
                color: 'bg-green-600'
              },
              {
                step: '2',
                title: 'Receive Training Requests',
                description: 'Get notified of training requests in your area. Accept sessions that fit your schedule and expertise.',
                icon: Users,
                color: 'bg-blue-600'
              },
              {
                step: '3',
                title: 'Train & Get Paid',
                description: 'Conduct comprehensive training sessions, issue certifications, and receive payment quickly.',
                icon: Award,
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

      {/* Training Programs */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Training Programs We Offer
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive training covering all aspects of aesthetic equipment operation and safety
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
              <Card key={index} className="hover:shadow-lg transition-all hover:scale-105 border-2 border-transparent hover:border-gray-200 h-full">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 ${program.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <program.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-center mb-2">{program.name}</h3>
                  <p className="text-gray-600 text-center text-sm">{program.description}</p>
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
              Hear from trainers who've built successful careers with MET
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Jennifer Martinez",
                location: "Phoenix, AZ",
                experience: "10+ years experience",
                quote: "MET has given me the platform to reach so many more facilities. I've trained over 200 staff members this year alone. The referral program is incredible.",
                rating: 5
              },
              {
                name: "Robert Kim",
                location: "Seattle, WA",
                experience: "6+ years experience",
                quote: "The exclusive train-the-trainer opportunities have been game-changing. I've expanded my expertise and doubled my income in just 8 months.",
                rating: 5
              },
              {
                name: "Lisa Thompson",
                location: "Austin, TX",
                experience: "4+ years experience",
                quote: "I love the flexibility and the quality of clients. Every training session is professionally organized and the payment process is seamless.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Quote className="w-8 h-8 text-green-600 mr-2" />
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
                question: "How quickly can I start receiving training requests?",
                answer: "Once approved, you'll start receiving training requests immediately. Most trainers get their first session within 24-48 hours of approval."
              },
              {
                question: "What are the payment terms?",
                answer: "We process payments within 48 hours of training completion. You'll receive payment via direct deposit or check, depending on your preference."
              },
              {
                question: "Do I need my own insurance?",
                answer: "We provide professional liability coverage for all approved trainers. However, we recommend maintaining your own business insurance for additional protection."
              },
              {
                question: "How does the referral bonus program work?",
                answer: "Earn $200 for every qualified trainer you refer who gets approved and completes their first training session. There's no limit to referrals!"
              },
              {
                question: "What if I'm not available for a training request?",
                answer: "No problem! You're never obligated to accept any training request. Simply decline and we'll find another trainer. You only work when it's convenient for you."
              },
              {
                question: "What are the exclusive train-the-trainer opportunities?",
                answer: "We offer special programs where experienced trainers can train other trainers on new equipment and advanced techniques, often at premium rates."
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
      <div id="apply-now" className="py-20 bg-green-600 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Training Career?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Join hundreds of successful trainers who've built thriving businesses with MET. 
            Apply now and start receiving training requests within 48 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup?type=trainer">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-12 py-4 text-xl font-bold">
                Apply Now - Join Our Network
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </Link>
            <Link href="/jobs?job_type=trainer">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg font-semibold bg-transparent">
                Browse Training Jobs
              </Button>
            </Link>
          </div>
          <p className="text-sm opacity-75 mt-4">
            Application takes less than 5 minutes • No commitment required • Start earning within 48 hours
          </p>
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

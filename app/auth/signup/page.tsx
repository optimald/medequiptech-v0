'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import Image from 'next/image'
import { LASER_MANUFACTURERS, US_STATES } from '@/lib/constants'

type TabType = 'tech' | 'trainer' | 'medspa'

export default function SignUp() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>('tech')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Tech form data
  const [techFormData, setTechFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    companyName: '',
    baseCity: '',
    baseState: '',
    serviceRadius: 50,
    manufacturers: [] as string[]
  })

  // Trainer form data
  const [trainerFormData, setTrainerFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    companyName: '',
    baseCity: '',
    baseState: '',
    serviceRadius: 50,
    manufacturers: [] as string[]
  })

  // MedSpa Practice form data
  const [medspaFormData, setMedspaFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    practiceName: '',
    contactName: '',
    phone: '',
    baseCity: '',
    baseState: '',
    issueDescription: '',
    primaryManufacturer: '',
    website: ''
  })

  const handleTechSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (techFormData.password !== techFormData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (techFormData.manufacturers.length === 0) {
      setError('Please select at least one manufacturer you specialize in')
      setLoading(false)
      return
    }

    try {
      const { error } = await signUp(techFormData.email, techFormData.password, {
        full_name: techFormData.fullName,
        phone: techFormData.phone,
        role_tech: true,
        role_trainer: false,
        company_name: techFormData.companyName,
        base_city: techFormData.baseCity,
        base_state: techFormData.baseState,
        service_radius_mi: techFormData.serviceRadius,
        manufacturers: techFormData.manufacturers
      })

      if (error) {
        setError(error.message)
      } else {
        router.push('/auth/verify-email')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleTrainerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (trainerFormData.password !== trainerFormData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (trainerFormData.manufacturers.length === 0) {
      setError('Please select at least one manufacturer you specialize in')
      setLoading(false)
      return
    }

    try {
      const { error } = await signUp(trainerFormData.email, trainerFormData.password, {
        full_name: trainerFormData.fullName,
        phone: trainerFormData.phone,
        role_tech: false,
        role_trainer: true,
        company_name: trainerFormData.companyName,
        base_city: trainerFormData.baseCity,
        base_state: trainerFormData.baseState,
        service_radius_mi: trainerFormData.serviceRadius,
        manufacturers: trainerFormData.manufacturers
      })

      if (error) {
        setError(error.message)
      } else {
        router.push('/auth/verify-email')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleMedspaSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (medspaFormData.password !== medspaFormData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const { error } = await signUp(medspaFormData.email, medspaFormData.password, {
        full_name: medspaFormData.contactName,
        phone: medspaFormData.phone,
        role_tech: false,
        role_trainer: false,
        practice_name: medspaFormData.practiceName,
        base_city: medspaFormData.baseCity,
        base_state: medspaFormData.baseState,
        issue_description: medspaFormData.issueDescription,
        primary_manufacturer: medspaFormData.primaryManufacturer,
        website: medspaFormData.website
      })

      if (error) {
        setError(error.message)
      } else {
        router.push('/auth/verify-email')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleTechChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setTechFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setTechFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleTrainerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setTrainerFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setTrainerFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleMedspaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setMedspaFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleManufacturerToggle = (manufacturer: string, formType: 'tech' | 'trainer') => {
    if (formType === 'tech') {
      setTechFormData(prev => ({
        ...prev,
        manufacturers: prev.manufacturers.includes(manufacturer)
          ? prev.manufacturers.filter(m => m !== manufacturer)
          : [...prev.manufacturers, manufacturer]
      }))
    } else {
      setTrainerFormData(prev => ({
        ...prev,
        manufacturers: prev.manufacturers.includes(manufacturer)
          ? prev.manufacturers.filter(m => m !== manufacturer)
          : [...prev.manufacturers, manufacturer]
      }))
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Link href="/">
              <Image
                src="/logo.avif"
                alt="MED Equipment Tech Logo"
                width={80}
                height={80}
                className="rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
              />
            </Link>
          </div>
          <h2 className="text-3xl font-bold text-foreground">Create Account</h2>
          <p className="mt-2 text-muted-foreground">
            Join MED Equipment Tech to start bidding on jobs or get help with your equipment
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('tech')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'tech'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Technicians
          </button>
          <button
            onClick={() => setActiveTab('trainer')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'trainer'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Trainers
          </button>
          <button
            onClick={() => setActiveTab('medspa')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'medspa'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            MedSpa Practices
          </button>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Tech Form */}
        {activeTab === 'tech' && (
          <form className="space-y-6" onSubmit={handleTechSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="techEmail" className="block text-sm font-medium text-foreground">
                  Email Address
                </label>
                <input
                  id="techEmail"
                  name="email"
                  type="email"
                  required
                  value={techFormData.email}
                  onChange={handleTechChange}
                  className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="techFullName" className="block text-sm font-medium text-foreground">
                  Full Name
                </label>
                <input
                  id="techFullName"
                  name="fullName"
                  type="text"
                  required
                  value={techFormData.fullName}
                  onChange={handleTechChange}
                  className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="techPhone" className="block text-sm font-medium text-foreground">
                  Phone Number
                </label>
                <input
                  id="techPhone"
                  name="phone"
                  type="tel"
                  value={techFormData.phone}
                  onChange={handleTechChange}
                  className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label htmlFor="techCompany" className="block text-sm font-medium text-foreground">
                  Company Name
                </label>
                <input
                  id="techCompany"
                  name="companyName"
                  type="text"
                  required
                  value={techFormData.companyName}
                  onChange={handleTechChange}
                  className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label htmlFor="techServiceRadius" className="block text-sm font-medium text-foreground">
                  Service Radius (miles)
                </label>
                <input
                  id="techServiceRadius"
                  name="serviceRadius"
                  type="number"
                  min="1"
                  max="500"
                  value={techFormData.serviceRadius}
                  onChange={handleTechChange}
                  className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="techCity" className="block text-sm font-medium text-foreground">
                  City
                </label>
                <input
                  id="techCity"
                  name="baseCity"
                  type="text"
                  value={techFormData.baseCity}
                  onChange={handleTechChange}
                  className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="City"
                />
              </div>

              <div>
                <label htmlFor="techState" className="block text-sm font-medium text-foreground">
                  State
                </label>
                <select
                  id="techState"
                  name="baseState"
                  value={techFormData.baseState}
                  onChange={handleTechChange}
                  className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select State</option>
                  {US_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Manufacturers You Specialize In
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-input rounded-md p-3">
                {LASER_MANUFACTURERS.map(manufacturer => (
                  <label key={manufacturer} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={techFormData.manufacturers.includes(manufacturer)}
                      onChange={() => handleManufacturerToggle(manufacturer, 'tech')}
                      className="h-4 w-4 text-primary focus:ring-primary border-input rounded mr-2"
                    />
                    <span className="truncate">{manufacturer}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="techPassword" className="block text-sm font-medium text-foreground">
                  Password
                </label>
                <input
                  id="techPassword"
                  name="password"
                  type="password"
                  required
                  value={techFormData.password}
                  onChange={handleTechChange}
                  className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Create a password"
                />
              </div>

              <div>
                <label htmlFor="techConfirmPassword" className="block text-sm font-medium text-foreground">
                  Confirm Password
                </label>
                <input
                  id="techConfirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={techFormData.confirmPassword}
                  onChange={handleTechChange}
                  className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Technician Account'}
            </button>
          </form>
        )}

        {/* Trainer Form */}
        {activeTab === 'trainer' && (
          <form className="space-y-6" onSubmit={handleTrainerSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="trainerEmail" className="block text-sm font-medium text-foreground">
                  Email Address
                </label>
                <input
                  id="trainerEmail"
                  name="email"
                  type="email"
                  required
                  value={trainerFormData.email}
                  onChange={handleTrainerChange}
                  className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="trainerFullName" className="block text-sm font-medium text-foreground">
                  Full Name
                </label>
                <input
                  id="trainerFullName"
                  name="fullName"
                  type="text"
                  required
                  value={trainerFormData.fullName}
                  onChange={handleTrainerChange}
                  className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="trainerPhone" className="block text-sm font-medium text-foreground">
                  Phone Number
                </label>
                <input
                  id="trainerPhone"
                  name="phone"
                  type="tel"
                  value={trainerFormData.phone}
                  onChange={handleTrainerChange}
                  className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label htmlFor="trainerCompany" className="block text-sm font-medium text-foreground">
                  Company Name
                </label>
                <input
                  id="trainerCompany"
                  name="companyName"
                  type="text"
                  required
                  value={trainerFormData.companyName}
                  onChange={handleTrainerChange}
                  className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label htmlFor="trainerServiceRadius" className="block text-sm font-medium text-foreground">
                  Service Radius (miles)
                </label>
                <input
                  id="trainerServiceRadius"
                  name="serviceRadius"
                  type="number"
                  min="1"
                  max="500"
                  value={trainerFormData.serviceRadius}
                  onChange={handleTrainerChange}
                  className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="trainerCity" className="block text-sm font-medium text-foreground">
                  City
                </label>
                <input
                  id="trainerCity"
                  name="baseCity"
                  type="text"
                  value={trainerFormData.baseCity}
                  onChange={handleTrainerChange}
                  className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="City"
                />
              </div>

              <div>
                <label htmlFor="trainerState" className="block text-sm font-medium text-foreground">
                  State
                </label>
                <select
                  id="trainerState"
                  name="baseState"
                  value={trainerFormData.baseState}
                  onChange={handleTrainerChange}
                  className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select State</option>
                  {US_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Manufacturers You Specialize In
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-input rounded-md p-3">
                {LASER_MANUFACTURERS.map(manufacturer => (
                  <label key={manufacturer} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={trainerFormData.manufacturers.includes(manufacturer)}
                      onChange={() => handleManufacturerToggle(manufacturer, 'trainer')}
                      className="h-4 w-4 text-primary focus:ring-primary border-input rounded mr-2"
                    />
                    <span className="truncate">{manufacturer}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="trainerPassword" className="block text-sm font-medium text-foreground">
                  Password
                </label>
                <input
                  id="trainerPassword"
                  name="password"
                  type="password"
                  required
                  value={trainerFormData.password}
                  onChange={handleTrainerChange}
                  className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Create a password"
                />
              </div>

              <div>
                <label htmlFor="trainerConfirmPassword" className="block text-sm font-medium text-foreground">
                  Confirm Password
                </label>
                <input
                  id="trainerConfirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={trainerFormData.confirmPassword}
                  onChange={handleTrainerChange}
                  className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Trainer Account'}
            </button>
          </form>
        )}

        {/* MedSpa Practice Form */}
        {activeTab === 'medspa' && (
          <form className="space-y-6" onSubmit={handleMedspaSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="medspaEmail" className="block text-sm font-medium text-foreground">
                  Email Address
                </label>
                <input
                  id="medspaEmail"
                  name="email"
                  type="email"
                  required
                  value={medspaFormData.email}
                  onChange={handleMedspaChange}
                  className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter practice email"
                />
              </div>

              <div>
                <label htmlFor="practiceName" className="block text-sm font-medium text-foreground">
                  Practice Name
                </label>
                <input
                  id="practiceName"
                  name="practiceName"
                  type="text"
                  required
                  value={medspaFormData.practiceName}
                  onChange={handleMedspaChange}
                  className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter practice name"
                />
              </div>

              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-foreground">
                  Contact Person
                </label>
                <input
                  id="contactName"
                  name="contactName"
                  type="text"
                  required
                  value={medspaFormData.contactName}
                  onChange={handleMedspaChange}
                  className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter contact name"
                />
              </div>

              <div>
                <label htmlFor="medspaPhone" className="block text-sm font-medium text-foreground">
                  Phone Number
                </label>
                <input
                  id="medspaPhone"
                  name="phone"
                  type="tel"
                  value={medspaFormData.phone}
                  onChange={handleMedspaChange}
                  className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter practice phone"
                />
              </div>

              <div>
                <label htmlFor="medspaCity" className="block text-sm font-medium text-foreground">
                  City
                </label>
                <input
                  id="medspaCity"
                  name="baseCity"
                  type="text"
                  value={medspaFormData.baseCity}
                  onChange={handleMedspaChange}
                  className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label htmlFor="medspaState" className="block text-sm font-medium text-foreground">
                  State
                </label>
                <select
                  id="medspaState"
                  name="baseState"
                  value={medspaFormData.baseState}
                  onChange={handleMedspaChange}
                  className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select State</option>
                  {US_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="primaryManufacturer" className="block text-sm font-medium text-foreground">
                  Primary Laser Manufacturer
                </label>
                <select
                  id="primaryManufacturer"
                  name="primaryManufacturer"
                  value={medspaFormData.primaryManufacturer}
                  onChange={handleMedspaChange}
                  className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select Manufacturer</option>
                  {LASER_MANUFACTURERS.map(manufacturer => (
                    <option key={manufacturer} value={manufacturer}>{manufacturer}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-foreground">
                  Website (Optional)
                </label>
                <input
                  id="website"
                  name="website"
                  type="url"
                  value={medspaFormData.website}
                  onChange={handleMedspaChange}
                  className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="issueDescription" className="block text-sm font-medium text-foreground">
                Describe Your Equipment Issue
              </label>
              <textarea
                id="issueDescription"
                name="issueDescription"
                rows={4}
                required
                value={medspaFormData.issueDescription}
                onChange={handleMedspaChange}
                className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Please describe the issue you're experiencing with your laser equipment..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="medspaPassword" className="block text-sm font-medium text-foreground">
                  Password
                </label>
                <input
                  id="medspaPassword"
                  name="password"
                  type="password"
                  required
                  value={medspaFormData.password}
                  onChange={handleMedspaChange}
                  className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Create a password"
                />
              </div>

              <div>
                <label htmlFor="medspaConfirmPassword" className="block text-sm font-medium text-foreground">
                  Confirm Password
                </label>
                <input
                  id="medspaConfirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={medspaFormData.confirmPassword}
                  onChange={handleMedspaChange}
                  className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Practice Account'}
            </button>
          </form>
        )}

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/signin" className="font-medium text-primary hover:text-primary/90">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

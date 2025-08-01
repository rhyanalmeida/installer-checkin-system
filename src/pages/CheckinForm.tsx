import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { 
  User, 
  MapPin, 
  Building, 
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { CheckinFormData } from '@/lib/supabase'
import { validateEmail, validatePhone, generateCheckinId } from '@/lib/utils'

export default function CheckinForm() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<CheckinFormData>({
    mode: 'onChange',
  })

  const watchedValues = watch()

  const onSubmit = async (data: CheckinFormData) => {
    setIsSubmitting(true)
    
    try {
      // Create installer record
      const { data: installer, error: installerError } = await supabase
        .from('installers')
        .insert({
          name: data.installer.name,
          email: data.installer.email,
          phone: data.installer.phone,
          company: data.installer.company,
        })
        .select()
        .single()

      if (installerError) throw installerError

      // Create check-in record
      const checkinId = generateCheckinId()
      const { error: checkinError } = await supabase
        .from('checkins')
        .insert({
          id: checkinId,
          installer_id: installer.id,
          location: `${data.location.address}, ${data.location.city}, ${data.location.state} ${data.location.zip}`,
          project_name: data.project.name,
          checkin_time: new Date().toISOString(),
          status: 'in_progress',
          notes: data.project.description,
        })

      if (checkinError) throw checkinError

      toast.success('Check-in completed successfully!')
      navigate('/checklist', { 
        state: { 
          checkinId,
          installerData: data.installer,
          projectData: data.project 
        } 
      })
    } catch (error) {
      console.error('Error creating check-in:', error)
      toast.error('Failed to create check-in. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { id: 1, title: 'Installer Information', icon: User },
    { id: 2, title: 'Location Details', icon: MapPin },
    { id: 3, title: 'Project Information', icon: Building },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Installer Check-in
        </h1>
        <p className="text-gray-600">
          Complete your check-in information to begin the installation process
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'bg-white border-gray-300 text-gray-500'
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{step.title}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Step 1: Installer Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="card-header">
                <h2 className="card-title">Installer Information</h2>
                <p className="card-subtitle">
                  Please provide your contact and company information
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register('installer.name', { 
                      required: 'Name is required',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' }
                    })}
                    className={`input ${errors.installer?.name ? 'border-error-500' : ''}`}
                    placeholder="Enter your full name"
                  />
                  {errors.installer?.name && (
                    <p className="mt-1 text-sm text-error-600">
                      {errors.installer.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register('installer.email', { 
                      required: 'Email is required',
                      validate: (value: string) => validateEmail(value) || 'Please enter a valid email'
                    })}
                    className={`input ${errors.installer?.email ? 'border-error-500' : ''}`}
                    placeholder="Enter your email address"
                  />
                  {errors.installer?.email && (
                    <p className="mt-1 text-sm text-error-600">
                      {errors.installer.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...register('installer.phone', { 
                      required: 'Phone number is required',
                      validate: (value: string) => validatePhone(value) || 'Please enter a valid phone number'
                    })}
                    className={`input ${errors.installer?.phone ? 'border-error-500' : ''}`}
                    placeholder="Enter your phone number"
                  />
                  {errors.installer?.phone && (
                    <p className="mt-1 text-sm text-error-600">
                      {errors.installer.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    {...register('installer.company', { 
                      required: 'Company name is required'
                    })}
                    className={`input ${errors.installer?.company ? 'border-error-500' : ''}`}
                    placeholder="Enter your company name"
                  />
                  {errors.installer?.company && (
                    <p className="mt-1 text-sm text-error-600">
                      {errors.installer.company.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  disabled={!watchedValues.installer?.name || !watchedValues.installer?.email || !watchedValues.installer?.phone || !watchedValues.installer?.company}
                  className="btn btn-primary"
                >
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Location Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="card-header">
                <h2 className="card-title">Location Details</h2>
                <p className="card-subtitle">
                  Provide the installation location information
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    {...register('location.address', { 
                      required: 'Address is required'
                    })}
                    className={`input ${errors.location?.address ? 'border-error-500' : ''}`}
                    placeholder="Enter street address"
                  />
                  {errors.location?.address && (
                    <p className="mt-1 text-sm text-error-600">
                      {errors.location.address.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      {...register('location.city', { 
                        required: 'City is required'
                      })}
                      className={`input ${errors.location?.city ? 'border-error-500' : ''}`}
                      placeholder="Enter city"
                    />
                    {errors.location?.city && (
                      <p className="mt-1 text-sm text-error-600">
                        {errors.location.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      {...register('location.state', { 
                        required: 'State is required'
                      })}
                      className={`input ${errors.location?.state ? 'border-error-500' : ''}`}
                      placeholder="Enter state"
                    />
                    {errors.location?.state && (
                      <p className="mt-1 text-sm text-error-600">
                        {errors.location.state.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      {...register('location.zip', { 
                        required: 'ZIP code is required',
                        pattern: { value: /^\d{5}(-\d{4})?$/, message: 'Please enter a valid ZIP code' }
                      })}
                      className={`input ${errors.location?.zip ? 'border-error-500' : ''}`}
                      placeholder="Enter ZIP code"
                    />
                    {errors.location?.zip && (
                      <p className="mt-1 text-sm text-error-600">
                        {errors.location.zip.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="btn btn-secondary"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  disabled={!watchedValues.location?.address || !watchedValues.location?.city || !watchedValues.location?.state || !watchedValues.location?.zip}
                  className="btn btn-primary"
                >
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Project Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="card-header">
                <h2 className="card-title">Project Information</h2>
                <p className="card-subtitle">
                  Provide details about the installation project
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    {...register('project.name', { 
                      required: 'Project name is required'
                    })}
                    className={`input ${errors.project?.name ? 'border-error-500' : ''}`}
                    placeholder="Enter project name"
                  />
                  {errors.project?.name && (
                    <p className="mt-1 text-sm text-error-600">
                      {errors.project.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    {...register('project.client', { 
                      required: 'Client name is required'
                    })}
                    className={`input ${errors.project?.client ? 'border-error-500' : ''}`}
                    placeholder="Enter client name"
                  />
                  {errors.project?.client && (
                    <p className="mt-1 text-sm text-error-600">
                      {errors.project.client.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Description
                  </label>
                  <textarea
                    {...register('project.description')}
                    rows={4}
                    className="input"
                    placeholder="Enter project description (optional)"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="btn btn-secondary"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="btn btn-success"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Complete Check-in
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
} 
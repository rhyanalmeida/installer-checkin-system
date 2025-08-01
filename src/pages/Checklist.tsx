import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { 
  CheckCircle, 
  Circle, 
  AlertCircle, 
  Camera, 
  Video,
  Save,
  Send,
  ArrowLeft,
  Clock,
  User,
  MapPin,
  PenTool
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { ChecklistItem } from '@/lib/supabase'
import { calculateProgress, formatDate } from '@/lib/utils'

interface ChecklistState {
  [key: string]: {
    completed: boolean
    notes: string
    photos: string[]
    videos: string[]
    signature?: string
    installerName?: string
    completionDate?: string
    timestamp?: string
  }
}

// Updated checklist items based on user requirements
const defaultChecklistItems: ChecklistItem[] = [
  { id: '1', item_name: 'Check materials in the warehouse with photos and videos', category: 'Materials', is_required: true, description: 'Document all materials in warehouse with photos and videos', sort_order: 1, created_at: '' },
  { id: '2', item_name: 'Scan QR code and change the status of any moved materials', category: 'Inventory', is_required: true, description: 'Scan QR codes and update material status', sort_order: 2, created_at: '' },
  { id: '3', item_name: 'Record checking materials with the client in the van and confirm payment method', category: 'Client', is_required: true, description: 'Verify materials with client and confirm payment', sort_order: 3, created_at: '' },
  { id: '4', item_name: 'Record the entire house, including the basement, before placing the drop cloths', category: 'Documentation', is_required: true, description: 'Document entire house condition before work begins', sort_order: 4, created_at: '' },
  { id: '5', item_name: 'Show drop cloths placed and furniture covered with plastic, if necessary', category: 'Protection', is_required: true, description: 'Document protection measures in place', sort_order: 5, created_at: '' },
  { id: '6', item_name: 'Videos of water temperature test and 5-gallon bucket', category: 'Testing', is_required: true, description: 'Record water temperature testing process', sort_order: 6, created_at: '' },
  { id: '7', item_name: 'Video after demolition', category: 'Documentation', is_required: true, description: 'Record post-demolition state', sort_order: 7, created_at: '' },
  { id: '8', item_name: 'Photos and videos before closing the walls with plywood', category: 'Construction', is_required: true, description: 'Document before plywood installation', sort_order: 8, created_at: '' },
  { id: '9', item_name: 'Photos and videos before closing the walls with acrylic', category: 'Construction', is_required: true, description: 'Document before acrylic installation', sort_order: 9, created_at: '' },
  { id: '10', item_name: 'Photos and videos of new drain and valve', category: 'Plumbing', is_required: true, description: 'Document new drain and valve installation', sort_order: 10, created_at: '' },
  { id: '11', item_name: 'Client pointing out where they want the accessories', category: 'Client', is_required: true, description: 'Record client preferences for accessories', sort_order: 11, created_at: '' },
  { id: '12', item_name: 'Video showing silicone application, slowly', category: 'Construction', is_required: true, description: 'Record silicone application process', sort_order: 12, created_at: '' },
  { id: '13', item_name: 'Final water and bucket test', category: 'Testing', is_required: true, description: 'Perform final water and bucket testing', sort_order: 13, created_at: '' },
  { id: '14', item_name: 'Show the completed work to the client', category: 'Client', is_required: true, description: 'Present completed work to client', sort_order: 14, created_at: '' },
  { id: '15', item_name: 'Photos of clean bathroom, hallway, and driveway', category: 'Documentation', is_required: true, description: 'Document final clean state', sort_order: 15, created_at: '' },
  { id: '16', item_name: 'COC (Certificate of Completion)', category: 'Administrative', is_required: true, description: 'Complete Certificate of Completion', sort_order: 16, created_at: '' },
  { id: '17', item_name: 'Flush shower valve', category: 'Plumbing', is_required: true, description: 'Flush and test shower valve', sort_order: 17, created_at: '' },
]

export default function Checklist() {
  const location = useLocation()
  const navigate = useNavigate()
  const [checklistState, setChecklistState] = useState<ChecklistState>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [checklistItems] = useState<ChecklistItem[]>(defaultChecklistItems)
  const [installerName, setInstallerName] = useState('')
  const [showSignatureModal, setShowSignatureModal] = useState(false)
  const [currentSignatureItem, setCurrentSignatureItem] = useState('')

  const { checkinId, installerData, projectData } = location.state || {}

  useEffect(() => {
    if (!checkinId) {
      toast.error('No check-in data found. Please start from the beginning.')
      navigate('/')
      return
    }

    // Initialize checklist state
    const initialState: ChecklistState = {}
    checklistItems.forEach(item => {
      initialState[item.id] = {
        completed: false,
        notes: '',
        photos: [],
        videos: [],
      }
    })
    setChecklistState(initialState)
    setInstallerName(installerData?.name || '')
  }, [checkinId, checklistItems, navigate, installerData])

  const handleItemToggle = (itemId: string) => {
    setChecklistState(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        completed: !prev[itemId]?.completed,
        timestamp: !prev[itemId]?.completed ? new Date().toISOString() : undefined,
        installerName: installerName,
        completionDate: !prev[itemId]?.completed ? new Date().toISOString() : undefined,
      }
    }))
  }

  const handleNotesChange = (itemId: string, notes: string) => {
    setChecklistState(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        notes,
      }
    }))
  }

  const handlePhotoUpload = (itemId: string) => {
    // Simulate photo upload - in real implementation, this would upload to Supabase Storage
    const photoUrl = `photo_${itemId}_${Date.now()}.jpg`
    setChecklistState(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        photos: [...(prev[itemId]?.photos || []), photoUrl],
      }
    }))
    toast.success('Photo uploaded successfully!')
  }

  const handleVideoUpload = (itemId: string) => {
    // Simulate video upload - in real implementation, this would upload to Supabase Storage
    const videoUrl = `video_${itemId}_${Date.now()}.mp4`
    setChecklistState(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        videos: [...(prev[itemId]?.videos || []), videoUrl],
      }
    }))
    toast.success('Video uploaded successfully!')
  }

  const handleSignatureCapture = (itemId: string) => {
    setCurrentSignatureItem(itemId)
    setShowSignatureModal(true)
  }

  const handleSignatureSave = (signature: string) => {
    setChecklistState(prev => ({
      ...prev,
      [currentSignatureItem]: {
        ...prev[currentSignatureItem],
        signature,
      }
    }))
    setShowSignatureModal(false)
    setCurrentSignatureItem('')
    toast.success('Signature saved successfully!')
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('checkins')
        .update({
          checklist_data: checklistState,
        })
        .eq('id', checkinId)

      if (error) throw error
      toast.success('Progress saved successfully!')
    } catch (error) {
      console.error('Error saving progress:', error)
      toast.error('Failed to save progress. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleComplete = async () => {
    setIsSubmitting(true)
    try {
      // Update check-in status
      const { error: checkinError } = await supabase
        .from('checkins')
        .update({
          status: 'completed',
          completion_time: new Date().toISOString(),
          checklist_data: checklistState,
        })
        .eq('id', checkinId)

      if (checkinError) throw checkinError

      // Send email notification
      await sendEmailNotification()

      toast.success('Checklist completed successfully!')
      navigate('/print', { 
        state: { 
          checkinId,
          installerData,
          projectData,
          checklistData: checklistState
        } 
      })
    } catch (error) {
      console.error('Error completing checklist:', error)
      toast.error('Failed to complete checklist. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const sendEmailNotification = async () => {
    try {
      const { error } = await supabase.functions.invoke('send-completion-email', {
        body: {
          checkinId,
          installerData,
          projectData,
          checklistData: checklistState,
        }
      })

      if (error) throw error
    } catch (error) {
      console.error('Error sending email:', error)
      // Don't fail the completion if email fails
    }
  }

  const completedCount = Object.values(checklistState).filter(item => item.completed).length
  const progress = calculateProgress(completedCount, checklistItems.length)
  const allRequiredCompleted = checklistItems
    .filter(item => item.is_required)
    .every(item => checklistState[item.id]?.completed)

  if (!checkinId) {
    return null
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/')}
            className="btn btn-secondary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Check-in
          </button>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn btn-secondary"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Progress'}
            </button>
            <button
              onClick={handleComplete}
              disabled={isSubmitting || !allRequiredCompleted}
              className="btn btn-success"
            >
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Completing...' : 'Complete Installation'}
            </button>
          </div>
        </div>

        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {installerData?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {installerData?.company}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {projectData?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {projectData?.client}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Check-in ID
                </p>
                <p className="text-sm text-gray-500">
                  {checkinId}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">
            Installation Checklist
          </h2>
          <span className="text-sm text-gray-600">
            {completedCount} of {checklistItems.length} completed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-primary-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-4">
        {checklistItems.map((item) => {
          const itemState = checklistState[item.id]
          const isCompleted = itemState?.completed || false
          const hasPhotos = itemState?.photos && itemState.photos.length > 0
          const hasVideos = itemState?.videos && itemState.videos.length > 0
          const hasSignature = itemState?.signature

          return (
            <div
              key={item.id}
              className={`card transition-all duration-200 ${
                isCompleted ? 'border-success-200 bg-success-50' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <button
                  onClick={() => handleItemToggle(item.id)}
                  className={`flex-shrink-0 mt-1 ${
                    isCompleted ? 'text-success-600' : 'text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <Circle className="h-6 w-6" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.item_name}
                        {item.is_required && (
                          <span className="ml-2 text-xs bg-error-100 text-error-800 px-2 py-1 rounded-full">
                            Required
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500">
                          Category: {item.category}
                        </span>
                        {isCompleted && itemState?.timestamp && (
                          <span className="text-xs text-success-600">
                            Completed: {formatDate(itemState.timestamp)}
                          </span>
                        )}
                        {isCompleted && itemState?.installerName && (
                          <span className="text-xs text-primary-600">
                            By: {itemState.installerName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Media Upload Section */}
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => handlePhotoUpload(item.id)}
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Add Photo
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => handleVideoUpload(item.id)}
                      >
                        <Video className="mr-2 h-4 w-4" />
                        Add Video
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => handleSignatureCapture(item.id)}
                      >
                        <PenTool className="mr-2 h-4 w-4" />
                        Add Signature
                      </button>
                    </div>

                    {/* Media Status */}
                    <div className="flex items-center space-x-4 text-xs">
                      {hasPhotos && (
                        <span className="text-success-600">
                          📷 {itemState.photos.length} photo(s)
                        </span>
                      )}
                      {hasVideos && (
                        <span className="text-success-600">
                          🎥 {itemState.videos.length} video(s)
                        </span>
                      )}
                      {hasSignature && (
                        <span className="text-success-600">
                          ✍️ Signature captured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={itemState?.notes || ''}
                      onChange={(e) => handleNotesChange(item.id, e.target.value)}
                      rows={3}
                      className="input"
                      placeholder="Add notes about this step..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Completion Warning */}
      {!allRequiredCompleted && (
        <div className="mt-8 p-4 bg-warning-50 border border-warning-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-warning-600 mr-2" />
            <p className="text-warning-800">
              All required items must be completed before finishing the installation.
            </p>
          </div>
        </div>
      )}

      {/* Signature Modal */}
      {showSignatureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Capture Signature
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Installer Name
                </label>
                <input
                  type="text"
                  value={installerName}
                  onChange={(e) => setInstallerName(e.target.value)}
                  className="input"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Signature
                </label>
                <div className="border-2 border-gray-300 rounded-lg h-32 bg-gray-50 flex items-center justify-center">
                  <p className="text-gray-500">Signature capture area</p>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowSignatureModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSignatureSave('signature_data')}
                  className="btn btn-primary"
                >
                  Save Signature
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
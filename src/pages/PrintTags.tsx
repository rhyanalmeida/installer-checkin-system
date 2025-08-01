import { useLocation, useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { toast } from 'react-hot-toast'
import { 
  Printer, 
  Download, 
  ArrowLeft,
  CheckCircle,
  User,
  MapPin,
  Calendar,
  Clock
} from 'lucide-react'
import QRCode from 'qrcode.react'
import { generateQRCodeData, formatDate } from '@/lib/utils'

export default function PrintTags() {
  const location = useLocation()
  const navigate = useNavigate()
  const printRef = useRef<HTMLDivElement>(null)

  const { checkinId, installerData, projectData, checklistData } = location.state || {}

  if (!checkinId) {
    toast.error('No check-in data found. Please start from the beginning.')
    navigate('/')
    return null
  }

  const handlePrint = () => {
    if (printRef.current) {
      window.print()
    }
  }

  const handleDownloadPDF = () => {
    toast('PDF download feature coming soon!')
  }

  const completedItems = Object.values(checklistData || {}).filter((item: any) => item.completed).length
  const totalItems = Object.keys(checklistData || {}).length
  const completionPercentage = Math.round((completedItems / totalItems) * 100)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/checklist')}
            className="btn btn-secondary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Checklist
          </button>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleDownloadPDF}
              className="btn btn-secondary"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </button>
            <button
              onClick={handlePrint}
              className="btn btn-primary"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print Tags
            </button>
          </div>
        </div>

        <div className="card">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Installation Completion Tags
            </h1>
            <p className="text-gray-600">
              Professional tags for completed installation
            </p>
          </div>
        </div>
      </div>

      {/* Print Content */}
      <div ref={printRef} className="space-y-6">
        {/* Main Tag */}
        <div className="card print-only">
          <div className="border-2 border-gray-300 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Side - Information */}
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    INSTALLATION COMPLETE
                  </h2>
                  <div className="w-16 h-1 bg-success-600 mx-auto mb-4"></div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Installer
                      </p>
                      <p className="text-sm text-gray-600">
                        {installerData?.name} - {installerData?.company}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Project
                      </p>
                      <p className="text-sm text-gray-600">
                        {projectData?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {projectData?.client}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Completion Date
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDate(new Date())}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Check-in ID
                      </p>
                      <p className="text-sm text-gray-600 font-mono">
                        {checkinId}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-success-600" />
                    <span className="text-sm font-medium text-success-600">
                      {completedItems} of {totalItems} items completed ({completionPercentage}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side - QR Code */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Scan for Details
                  </h3>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <QRCode
                      value={generateQRCodeData(checkinId)}
                      size={120}
                      level="M"
                      includeMargin={true}
                    />
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Scan to view complete installation details
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Small Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 print-only">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="card">
              <div className="border border-gray-300 rounded-lg p-4">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-6 w-6 text-success-600" />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      INSTALLATION COMPLETE
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {installerData?.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {projectData?.name}
                    </p>
                  </div>

                  <div className="text-xs text-gray-500">
                    <p>ID: {checkinId}</p>
                    <p>{formatDate(new Date())}</p>
                  </div>

                  <div className="w-16 h-8 bg-white border border-gray-200 rounded flex items-center justify-center mx-auto">
                    <QRCode
                      value={generateQRCodeData(checkinId)}
                      size={60}
                      level="L"
                      includeMargin={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Certificate Style */}
        <div className="card print-only">
          <div className="border-4 border-gray-300 rounded-lg p-8 bg-gradient-to-br from-gray-50 to-white">
            <div className="text-center space-y-6">
              <div className="border-b-2 border-gray-300 pb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  CERTIFICATE OF COMPLETION
                </h1>
                <p className="text-gray-600">
                  Professional Installation Services
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-lg text-gray-700">
                  This certifies that the installation project has been completed
                  according to professional standards and all required checklist items
                  have been verified.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Project Details</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Project:</span> {projectData?.name}</p>
                      <p><span className="font-medium">Client:</span> {projectData?.client}</p>
                      <p><span className="font-medium">Installer:</span> {installerData?.name}</p>
                      <p><span className="font-medium">Company:</span> {installerData?.company}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Completion Summary</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Check-in ID:</span> {checkinId}</p>
                      <p><span className="font-medium">Completion Date:</span> {formatDate(new Date())}</p>
                      <p><span className="font-medium">Items Completed:</span> {completedItems}/{totalItems}</p>
                      <p><span className="font-medium">Completion Rate:</span> {completionPercentage}%</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-300">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-24 h-24 bg-white border-2 border-gray-300 rounded flex items-center justify-center">
                      <QRCode
                        value={generateQRCodeData(checkinId)}
                        size={80}
                        level="M"
                        includeMargin={true}
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-600">
                        Scan QR code to access complete installation details
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Valid for 1 year from completion date
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Instructions */}
      <div className="mt-8 card no-print">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Print Instructions
          </h3>
          <p className="text-gray-600 mb-4">
            Click the print button to generate professional installation tags and certificates.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Main Tag</h4>
              <p>Large format tag with QR code for main installation area</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Small Tags</h4>
              <p>Multiple small tags for equipment and access points</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Certificate</h4>
              <p>Professional certificate for client records</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
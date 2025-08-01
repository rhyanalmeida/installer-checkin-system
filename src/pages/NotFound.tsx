import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="card">
          <div className="mb-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-error-100 mb-4">
              <span className="text-2xl font-bold text-error-600">404</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Page Not Found
            </h1>
            <p className="text-gray-600">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              to="/"
              className="btn btn-primary w-full"
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="btn btn-secondary w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              If you believe this is an error, please contact support.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 
import { Link, useLocation } from 'react-router-dom'
import { 
  ClipboardCheck, 
  Printer, 
  BarChart3,
  Home
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Check-in', href: '/', icon: Home },
  { name: 'Checklist', href: '/checklist', icon: ClipboardCheck },
  { name: 'Print Tags', href: '/print', icon: Printer },
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
]

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">
                  Installer Check-in
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Professional Installation System
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors',
                    isActive
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>&copy; 2024 Installer Check-in System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 
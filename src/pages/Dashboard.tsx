import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { 
  BarChart3, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Search,
  Download,
  Eye
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatDate, getStatusColor } from '@/lib/utils'

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  // Fetch check-ins data
  const { data: checkins, isLoading, error } = useQuery({
    queryKey: ['checkins'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('checkins')
        .select(`
          *,
          installers (
            name,
            company,
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
  })

  // Calculate statistics
  const totalCheckins = checkins?.length || 0
  const completedCheckins = checkins?.filter((c: any) => c.status === 'completed').length || 0
  const inProgressCheckins = checkins?.filter((c: any) => c.status === 'in_progress').length || 0
  const completionRate = totalCheckins > 0 ? Math.round((completedCheckins / totalCheckins) * 100) : 0

  // Filter check-ins based on search and filters
  const filteredCheckins = checkins?.filter((checkin: any) => {
    const matchesSearch = searchTerm === '' || 
      checkin.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checkin.installers?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checkin.installers?.company.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || checkin.status === statusFilter
    const matchesDate = dateFilter === 'all' || 
      (dateFilter === 'today' && new Date(checkin.created_at).toDateString() === new Date().toDateString()) ||
      (dateFilter === 'week' && new Date(checkin.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (dateFilter === 'month' && new Date(checkin.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))

    return matchesSearch && matchesStatus && matchesDate
  }) || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-error-600">Error loading dashboard data. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Overview of installation check-ins and performance metrics
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Check-ins</p>
              <p className="text-2xl font-bold text-gray-900">{totalCheckins}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-success-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedCheckins}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-warning-100 rounded-lg">
              <Clock className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{inProgressCheckins}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by project, installer, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Check-ins Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Check-ins ({filteredCheckins.length})
          </h2>
          <button className="btn btn-secondary">
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Installer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-in Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCheckins.map((checkin: any) => (
                <tr key={checkin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {checkin.project_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {checkin.location}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {checkin.installers?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {checkin.installers?.company}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge badge-${getStatusColor(checkin.status)}`}>
                      {checkin.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(checkin.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCheckins.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No check-ins found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {checkins?.slice(0, 5).map((checkin: any) => (
              <div key={checkin.id} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full bg-${getStatusColor(checkin.status)}-500`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {checkin.project_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {checkin.installers?.name} • {formatDate(checkin.created_at)}
                  </p>
                </div>
                <span className={`badge badge-${getStatusColor(checkin.status)}`}>
                  {checkin.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Completion Time</span>
              <span className="text-sm font-medium text-gray-900">2.5 hours</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Most Active Installer</span>
              <span className="text-sm font-medium text-gray-900">John Smith</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">This Week's Check-ins</span>
              <span className="text-sm font-medium text-gray-900">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Completion Rate</span>
              <span className="text-sm font-medium text-gray-900">{completionRate}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
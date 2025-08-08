'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  Shield, 
  BarChart3,
  UserPlus,
  Activity,
  Globe,
  CreditCard,
  FileText,
  Zap,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Analytics, AdminSettings, User } from '@/types';

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    if (isLoaded) {
      setTimeout(() => {
        setAnalytics({
          totalCourses: 1250,
          totalGenerations: 3420,
          totalUsers: 890,
          revenue: {
            monthly: 15420,
            total: 125000
          },
          popularTopics: [
            { topic: 'React Development', count: 156 },
            { topic: 'Python Programming', count: 142 },
            { topic: 'Digital Marketing', count: 98 },
            { topic: 'Data Science', count: 87 }
          ],
          userGrowth: [
            { date: '2024-01', users: 650 },
            { date: '2024-02', users: 720 },
            { date: '2024-03', users: 890 }
          ]
        });

        setSettings({
          siteName: 'CourseGenie AI',
          logo: '/logo.png',
          primaryColor: '#3B82F6',
          secondaryColor: '#8B5CF6',
          aiModels: [
            { id: 'gpt-4', name: 'GPT-4', provider: 'openai', model: 'gpt-4', maxTokens: 4000, costPerToken: 0.03, isActive: true },
            { id: 'gpt-3.5', name: 'GPT-3.5 Turbo', provider: 'openai', model: 'gpt-3.5-turbo', maxTokens: 4000, costPerToken: 0.002, isActive: true },
            { id: 'gemini', name: 'Gemini Pro', provider: 'google', model: 'gemini-pro', maxTokens: 4000, costPerToken: 0.001, isActive: true },
            { id: 'claude', name: 'Claude 3', provider: 'anthropic', model: 'claude-3-sonnet', maxTokens: 4000, costPerToken: 0.015, isActive: true }
          ],
          paymentGateways: {
            stripe: {
              enabled: true,
              publishableKey: 'pk_test_...',
              secretKey: 'sk_test_...'
            },
            razorpay: {
              enabled: true,
              keyId: 'rzp_test_...',
              keySecret: 'test_secret_...'
            }
          },
          limits: {
            freeGenerationsPerDay: 3,
            freeExportsPerMonth: 2
          }
        });

        setUsers([
          { id: '1', email: 'john@example.com', name: 'John Doe', role: 'pro', subscriptionStatus: 'active', createdAt: new Date('2024-01-15'), lastLogin: new Date() },
          { id: '2', email: 'jane@example.com', name: 'Jane Smith', role: 'free', subscriptionStatus: 'active', createdAt: new Date('2024-02-01'), lastLogin: new Date() },
          { id: '3', email: 'bob@example.com', name: 'Bob Johnson', role: 'enterprise', subscriptionStatus: 'active', createdAt: new Date('2024-01-20'), lastLogin: new Date() }
        ]);

        setLoading(false);
      }, 1000);
    }
  }, [isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check if user is admin (you would implement proper admin check)
  if (!user?.emailAddresses?.some(email => email.emailAddress === 'admin@coursegenie.ai')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-300">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Manage your CourseGenie AI platform
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-8 mb-8 border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'settings', label: 'Settings', icon: Settings },
            { id: 'security', label: 'Security', icon: Shield }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && analytics && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalUsers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                      <BookOpen className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Courses</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalCourses}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <Zap className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Generations</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalGenerations}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                      <DollarSign className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">${analytics.revenue.monthly.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Popular Topics */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Course Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.popularTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">{topic.topic}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{topic.count} courses</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-300">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'enterprise' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                            user.role === 'pro' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.subscriptionStatus === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {user.subscriptionStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {user.createdAt.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && settings && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Site Name"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                />
                <Input
                  label="Primary Color"
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                />
                <Input
                  label="Secondary Color"
                  type="color"
                  value={settings.secondaryColor}
                  onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Model Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {settings.aiModels.map((model) => (
                    <div key={model.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{model.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-300">{model.provider}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500 dark:text-gray-300">
                          ${model.costPerToken}/token
                        </span>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={model.isActive}
                            onChange={(e) => {
                              const updatedModels = settings.aiModels.map(m =>
                                m.id === model.id ? { ...m, isActive: e.target.checked } : m
                              );
                              setSettings({ ...settings, aiModels: updatedModels });
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Active</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Gateway Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Stripe</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-300">Global payment processing</p>
                    </div>
                  </div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.paymentGateways.stripe.enabled}
                      onChange={(e) => {
                        setSettings({
                          ...settings,
                          paymentGateways: {
                            ...settings.paymentGateways,
                            stripe: { ...settings.paymentGateways.stripe, enabled: e.target.checked }
                          }
                        });
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enabled</span>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Razorpay</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-300">Popular in India and Asia</p>
                    </div>
                  </div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.paymentGateways.razorpay.enabled}
                      onChange={(e) => {
                        setSettings({
                          ...settings,
                          paymentGateways: {
                            ...settings.paymentGateways,
                            razorpay: { ...settings.paymentGateways.razorpay, enabled: e.target.checked }
                          }
                        });
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enabled</span>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-300">Require 2FA for all users</p>
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enabled</span>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Rate Limiting</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-300">Limit API requests per user</p>
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enabled</span>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Audit Logging</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-300">Log all admin actions</p>
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enabled</span>
                </label>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 
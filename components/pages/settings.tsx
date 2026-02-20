"use client"

import { Bell, Lock, User, Database, Download, LogOut } from "lucide-react"

interface SettingsPageProps {
  userRole?: string
  onLogout?: () => void
}

export function Settings({ userRole, onLogout }: SettingsPageProps) {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and system preferences</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Account Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <User className="text-primary" size={24} />
              <h2 className="text-2xl font-bold text-foreground">Account Settings</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Username</label>
                <input
                  type="text"
                  value={userRole || "Admin User"}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">User Role</label>
                <input
                  type="text"
                  value={
                    userRole === "admin"
                      ? "Admin / Owner"
                      : userRole === "operator-produksi"
                        ? "Operator Produksi"
                        : "Operator Inventaris"
                  }
                  readOnly
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-foreground"
                />
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="text-primary" size={24} />
              <h2 className="text-2xl font-bold text-foreground">Security</h2>
            </div>
            <div className="space-y-4">
              <button className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Change Password
              </button>
              <p className="text-sm text-muted-foreground">Last password changed: Never</p>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="text-primary" size={24} />
              <h2 className="text-2xl font-bold text-foreground">Notifications</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Production Alerts</label>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Stock Notifications</label>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Order Updates</label>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Database className="text-primary" size={24} />
              <h2 className="text-2xl font-bold text-foreground">System</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Language</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg text-foreground bg-white">
                  <option>Indonesian</option>
                  <option>English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Date Format</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg text-foreground bg-white">
                  <option>DD-MM-YYYY</option>
                  <option>MM-DD-YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Download className="text-primary" size={24} />
              <h2 className="text-2xl font-bold text-foreground">Data Management</h2>
            </div>
            <div className="space-y-4">
              <button className="w-full sm:w-auto px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2">
                <Download size={18} />
                Export Data
              </button>
              <p className="text-sm text-muted-foreground">Download all your production and inventory data as CSV</p>
            </div>
          </div>

          {/* Logout */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <LogOut className="text-red-600" size={24} />
              <h2 className="text-2xl font-bold text-red-600">Logout</h2>
            </div>
            <button
              onClick={onLogout}
              className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Logout from Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

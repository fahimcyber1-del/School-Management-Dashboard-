import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Save, School, Shield } from 'lucide-react';

export default function SettingsModule() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <School className="w-5 h-5 text-primary" />
              <CardTitle>School Profile</CardTitle>
            </div>
            <CardDescription>Update your school's basic information and branding.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">School Name</label>
                <Input defaultValue="Dhaka Model School & College" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">EIIN Number</label>
                <Input defaultValue="108254" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Email</label>
                <Input defaultValue="info@dhakamodel.edu.bd" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input defaultValue="+880 1711-000000" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Address</label>
                <Input defaultValue="Mirpur 10, Dhaka, Bangladesh" />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              <CardTitle>Academic Configuration</CardTitle>
            </div>
            <CardDescription>Configure academic year, grading rules, and promotion criteria.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Session</label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  <option>2023-2024</option>
                  <option>2024-2025</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Grading System</label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  <option>Bangladesh National Board (GPA 5.0)</option>
                  <option>Custom Grading</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Minimum Attendance for Exam (%)</label>
                <Input type="number" defaultValue="75" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Pass Marks</label>
                <Input type="number" defaultValue="33" />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button>
                <Save className="w-4 h-4 mr-2" />
                Save Configuration
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <CardTitle>Roles & Permissions</CardTitle>
            </div>
            <CardDescription>Manage access control for different user roles.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Super Admin</h4>
                  <p className="text-sm text-muted-foreground">Full access to all modules and settings.</p>
                </div>
                <Button variant="outline" size="sm">Manage Users</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Teacher</h4>
                  <p className="text-sm text-muted-foreground">Access to assigned classes, attendance, and marks entry.</p>
                </div>
                <Button variant="outline" size="sm">Edit Permissions</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Accountant</h4>
                  <p className="text-sm text-muted-foreground">Access to fee collection, expenses, and financial reports.</p>
                </div>
                <Button variant="outline" size="sm">Edit Permissions</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

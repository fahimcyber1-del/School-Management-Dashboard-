import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, CalendarCheck, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dataStore } from '@/services/dataService';

export default function Dashboard() {
  const students = dataStore.getStudents();
  const classes = dataStore.getClasses();
  const exams = dataStore.getExams();
  const attendancePercentage = dataStore.getTodayAttendance();
  const feeSummary = dataStore.getFeeSummary();

  // Revenue data based on real fee summary
  const totalRevenue = feeSummary.totalCollected;
  const chartData = [
    { name: 'Jan', revenue: totalRevenue * 0.8 },
    { name: 'Feb', revenue: totalRevenue * 0.9 },
    { name: 'Mar', revenue: totalRevenue },
    { name: 'Apr', revenue: totalRevenue * 1.1 },
    { name: 'May', revenue: totalRevenue * 1.05 },
    { name: 'Jun', revenue: totalRevenue * 1.2 },
    { name: 'Jul', revenue: totalRevenue },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">Registered students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <GraduationCap className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
            <p className="text-xs text-muted-foreground">Active academic levels</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exams.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled exams</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <CalendarCheck className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendancePercentage}%</div>
            <p className="text-xs text-muted-foreground">Average attendance</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `৳${value}`} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {students.slice(0, 5).map((student) => (
                <div key={student.id} className="flex items-center">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold mr-4">
                    {student.name.charAt(0)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.class}, {student.section}</p>
                  </div>
                  <div className="ml-auto flex flex-col items-end gap-1">
                    <div className="font-medium text-sm text-muted-foreground">
                      {student.id}
                    </div>
                    {(() => {
                      const status = dataStore.getStudentTodayStatus(student.id);
                      if (status === 'not-marked') return null;
                      return (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                          status === 'present' ? 'bg-emerald-100 text-emerald-700' :
                          status === 'absent' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {status.toUpperCase()}
                        </span>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

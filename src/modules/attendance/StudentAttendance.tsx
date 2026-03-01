import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar as CalendarIcon, Check, X, Clock, Search } from 'lucide-react';
import { format } from 'date-fns';
import { dataStore, Student } from '@/services/dataService';
import { toast } from 'sonner';

export default function StudentAttendance() {
  const [activeTab, setActiveTab] = useState<'mark' | 'summary'>('mark');
  const [date, setDate] = useState<Date>(new Date());
  const [filterClass, setFilterClass] = useState('Class 9');
  const [filterSection, setFilterSection] = useState('A');
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({});

  const dateKey = format(date, 'yyyy-MM-dd');

  useEffect(() => {
    // Load students for the current filter
    const allStudents = dataStore.getStudents();
    const filtered = allStudents.filter(s => s.class === filterClass && s.section === filterSection);
    setStudents(filtered);

    // Load existing attendance for the date
    const savedAttendance = dataStore.getDailyAttendance(dateKey);

    // Merge saved attendance with default 'present' for new students in the list
    setAttendance(prev => {
      const next = { ...savedAttendance };
      filtered.forEach(s => {
        if (!next[s.id]) next[s.id] = 'present';
      });
      return next;
    });
  }, [dateKey, filterClass, filterSection]);

  const markAttendance = (id: string, status: 'present' | 'absent' | 'late') => {
    setAttendance(prev => ({ ...prev, [id]: status }));
  };

  const handleSave = () => {
    dataStore.saveDailyAttendance(dateKey, attendance);
    toast.success(`Attendance for ${format(date, 'MMM d')} saved successfully!`);
  };

  const markAll = (status: 'present' | 'absent' | 'late') => {
    const next = { ...attendance };
    students.forEach(s => {
      next[s.id] = status;
    });
    setAttendance(next);
  };

  const getStudentSummary = (studentId: string) => {
    const history = dataStore.getStudentAttendanceHistory(studentId);
    const summary = {
      present: 0,
      absent: 0,
      late: 0,
      total: history.length
    };

    history.forEach(record => {
      if (record.status === 'present') summary.present++;
      else if (record.status === 'absent') summary.absent++;
      else if (record.status === 'late') summary.late++;
    });

    const percentage = summary.total > 0
      ? Math.round(((summary.present + summary.late) / summary.total) * 100)
      : 0;

    return { ...summary, percentage };
  };

  const classes = [...new Set(dataStore.getClasses().map(c => c.name))];
  const sections = ['A', 'B', 'C'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Student Attendance</h2>
          <p className="text-muted-foreground text-sm">Mark and track daily student presence</p>
        </div>
        <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-lg border">
          <Button
            variant={activeTab === 'mark' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('mark')}
            className="text-xs h-8 px-4"
          >
            Mark Attendance
          </Button>
          <Button
            variant={activeTab === 'summary' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('summary')}
            className="text-xs h-8 px-4"
          >
            Attendance Summary
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 p-4 bg-card border rounded-lg shadow-sm">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Select Class</label>
          <select
            className="flex h-10 w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
          >
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Select Section</label>
          <select
            className="flex h-10 w-36 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
          >
            {sections.map(sec => (
              <option key={sec} value={sec}>Section {sec}</option>
            ))}
          </select>
        </div>
        {activeTab === 'mark' && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Attendance Date</label>
            <div className="flex items-center gap-2 border rounded-md px-3 h-10 bg-background shadow-xs">
              <CalendarIcon className="w-4 h-4 text-primary" />
              <input
                type="date"
                className="bg-transparent border-none text-sm font-medium focus:outline-none"
                value={dateKey}
                onChange={(e) => setDate(new Date(e.target.value))}
              />
            </div>
          </div>
        )}
        <div className="flex-1" />
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">Present</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-muted-foreground">Absent</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-muted-foreground">Late</span>
          </div>
        </div>
      </div>

      {activeTab === 'mark' ? (
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b">
            <div>
              <CardTitle className="text-xl">Mark Daily Attendance</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {format(date, 'EEEE, MMMM d, yyyy')} | {students.length} Students
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => markAll('present')} className="text-xs">Mark All Present</Button>
              <Button variant="outline" size="sm" onClick={() => markAll('absent')} className="text-xs">Mark All Absent</Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[80px]">Roll</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Action Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-semibold">{student.roll}</TableCell>
                    <TableCell className="font-mono text-xs">{student.id}</TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant={attendance[student.id] === 'present' ? 'default' : 'outline'}
                          className={attendance[student.id] === 'present' ? 'bg-emerald-500 hover:bg-emerald-600 border-none px-4' : 'px-4'}
                          onClick={() => markAttendance(student.id, 'present')}
                        >
                          <Check className="w-4 h-4 mr-1" /> Present
                        </Button>
                        <Button
                          size="sm"
                          variant={attendance[student.id] === 'absent' ? 'destructive' : 'outline'}
                          className={attendance[student.id] === 'absent' ? 'px-4' : 'px-4'}
                          onClick={() => markAttendance(student.id, 'absent')}
                        >
                          <X className="w-4 h-4 mr-1" /> Absent
                        </Button>
                        <Button
                          size="sm"
                          variant={attendance[student.id] === 'late' ? 'default' : 'outline'}
                          className={attendance[student.id] === 'late' ? 'bg-amber-500 hover:bg-amber-600 border-none px-4' : 'px-4'}
                          onClick={() => markAttendance(student.id, 'late')}
                        >
                          <Clock className="w-4 h-4 mr-1" /> Late
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {students.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                      No students found for the selected class and section.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {students.length > 0 && (
              <div className="mt-8 flex justify-end">
                <Button size="lg" onClick={handleSave} className="px-12 shadow-lg hover:shadow-xl transition-all">Save Attendance</Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-4 border-b">
            <CardTitle className="text-xl">Academic Year Attendance Summary</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Cumulative statistics for {filterClass} - Section {filterSection}
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[80px]">Roll</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-center">Present</TableHead>
                  <TableHead className="text-center">Absent</TableHead>
                  <TableHead className="text-center">Late</TableHead>
                  <TableHead className="text-center">Total Days</TableHead>
                  <TableHead className="text-right">Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => {
                  const summary = getStudentSummary(student.id);
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-semibold">{student.roll}</TableCell>
                      <TableCell className="font-mono text-xs">{student.id}</TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell className="text-center text-emerald-600 font-bold">{summary.present}</TableCell>
                      <TableCell className="text-center text-red-600 font-bold">{summary.absent}</TableCell>
                      <TableCell className="text-center text-amber-600 font-bold">{summary.late}</TableCell>
                      <TableCell className="text-center font-medium">{summary.total}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-sm font-bold ${summary.percentage >= 90 ? 'text-emerald-600' :
                              summary.percentage >= 75 ? 'text-amber-600' : 'text-red-600'
                            }`}>
                            {summary.percentage}%
                          </span>
                          <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${summary.percentage >= 90 ? 'bg-emerald-500' :
                                  summary.percentage >= 75 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                              style={{ width: `${summary.percentage}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {students.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                      No students found for summary.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

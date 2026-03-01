import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Plus, FileBarChart, Download, X, Search, Save, Eye, BarChart3 } from 'lucide-react';
import { dataStore, Exam, Student, ClassInfo, ExamResult } from '@/services/dataService';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { jsPDF } from 'jspdf';

export default function ExamsModule() {
  const [exams, setExams] = useState<Exam[]>(dataStore.getExams());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMarksModalOpen, setIsMarksModalOpen] = useState(false);
  const [isResultsViewOpen, setIsResultsViewOpen] = useState(false);
  const [isPerformanceReportOpen, setIsPerformanceReportOpen] = useState(false);
  
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [viewResultsExam, setViewResultsExam] = useState<Exam | null>(null);
  const [reportExam, setReportExam] = useState<Exam | null>(null);

  const refreshExams = () => {
    setExams([...dataStore.getExams()]);
  };
  const [newExam, setNewExam] = useState({
    name: '',
    class: 'Class 9',
    date: '',
    status: 'Upcoming'
  });

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    dataStore.addExam(newExam);
    refreshExams();
    setIsModalOpen(false);
    setNewExam({ name: '', class: 'Class 9', date: '', status: 'Upcoming' });
  };

  const handleStatusChange = (examId: string, newStatus: string) => {
    dataStore.updateExam(examId, { status: newStatus });
    refreshExams();
    toast.success(`Exam status updated to ${newStatus}`);
  };

  const handleOpenMarksModal = (exam: Exam) => {
    setSelectedExam(exam);
    setIsMarksModalOpen(true);
    setSelectedStudent(null);
    setStudentSearchTerm('');
    setMarks({});
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    // Load existing marks if any
    const existingResults = dataStore.getExamResults(selectedExam?.id);
    const studentResult = existingResults.find(r => r.studentId === student.id);
    if (studentResult) {
      const stringMarks: Record<string, string> = {};
      Object.entries(studentResult.marks).forEach(([sub, val]) => {
        stringMarks[sub] = val.toString();
      });
      setMarks(stringMarks);
    } else {
      setMarks({});
    }
  };

  const calculateGrade = (percentage: number) => {
    if (percentage >= 80) return { grade: 'A+', gpa: 5.0 };
    if (percentage >= 70) return { grade: 'A', gpa: 4.0 };
    if (percentage >= 60) return { grade: 'A-', gpa: 3.5 };
    if (percentage >= 50) return { grade: 'B', gpa: 3.0 };
    if (percentage >= 40) return { grade: 'C', gpa: 2.0 };
    if (percentage >= 33) return { grade: 'D', gpa: 1.0 };
    return { grade: 'F', gpa: 0.0 };
  };

  const handleSaveMarks = () => {
    if (!selectedExam || !selectedStudent) return;

    const numericMarks: Record<string, number> = {};
    let total = 0;
    let count = 0;
    Object.entries(marks).forEach(([sub, val]) => {
      const m = parseFloat(val as string) || 0;
      numericMarks[sub] = m;
      total += m;
      count++;
    });

    const percentage = count > 0 ? (total / (count * 100)) * 100 : 0;
    const { grade, gpa } = calculateGrade(percentage);

    dataStore.saveExamResult({
      examId: selectedExam.id,
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      marks: numericMarks,
      totalMarks: total,
      percentage,
      grade,
      gpa
    });

    toast.success(`Marks saved for ${selectedStudent.name}`);
    setIsMarksModalOpen(false);
  };

  const handleViewResults = (exam: Exam) => {
    setViewResultsExam(exam);
    setIsResultsViewOpen(true);
  };

  const handleViewPerformanceReport = (exam: Exam) => {
    setReportExam(exam);
    setIsPerformanceReportOpen(true);
  };

  const downloadPerformanceReport = (exam: Exam, stats: any) => {
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(22);
      doc.setTextColor(40, 40, 40);
      doc.text("EXAM PERFORMANCE REPORT", 105, 20, { align: "center" });
      
      doc.setFontSize(16);
      doc.text(exam.name.toUpperCase(), 105, 30, { align: "center" });
      doc.setFontSize(12);
      doc.text(`Class: ${exam.class} | Date: ${new Date().toLocaleDateString()}`, 105, 38, { align: "center" });
      
      doc.setLineWidth(0.5);
      doc.line(20, 42, 190, 42);
      
      // Summary Stats
      doc.setFontSize(14);
      doc.text("Executive Summary", 20, 55);
      
      doc.setFontSize(11);
      doc.text(`Total Students: ${stats.totalStudents}`, 30, 65);
      doc.text(`Passed Students: ${stats.passedStudents}`, 30, 72);
      doc.text(`Pass Rate: ${stats.passRate.toFixed(1)}%`, 30, 79);
      doc.text(`Average Score: ${stats.averagePercentage.toFixed(1)}%`, 30, 86);
      
      // Grade Distribution Table
      doc.setFontSize(14);
      doc.text("Grade Distribution", 20, 105);
      
      let currentY = 115;
      doc.setFontSize(11);
      doc.text("Grade", 30, currentY);
      doc.text("Count", 80, currentY);
      doc.text("Percentage", 130, currentY);
      
      doc.line(20, currentY + 2, 190, currentY + 2);
      currentY += 10;
      
      Object.entries(stats.gradeDist).forEach(([grade, count]: [string, any]) => {
        const percentage = ((count / stats.totalStudents) * 100).toFixed(1);
        doc.text(grade, 30, currentY);
        doc.text(count.toString(), 80, currentY);
        doc.text(`${percentage}%`, 130, currentY);
        currentY += 8;
      });
      
      doc.line(20, currentY + 2, 190, currentY + 2);
      
      // Footer
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Generated by School Management System", 105, 280, { align: "center" });
      
      doc.save(`Performance_Report_${exam.name.replace(/\s+/g, '_')}.pdf`);
      toast.success("Performance report downloaded successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF report");
    }
  };

  const calculatePerformanceStats = (examId: string) => {
    const results = dataStore.getExamResults(examId);
    if (results.length === 0) return null;

    const totalStudents = results.length;
    const passedStudents = results.filter(r => r.grade !== 'F').length;
    const passRate = (passedStudents / totalStudents) * 100;
    
    const totalPercentage = results.reduce((sum, r) => sum + r.percentage, 0);
    const averagePercentage = totalPercentage / totalStudents;

    const gradeDist: Record<string, number> = { 'A+': 0, 'A': 0, 'A-': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 };
    results.forEach(r => {
      if (gradeDist[r.grade] !== undefined) gradeDist[r.grade]++;
    });

    const chartData = Object.entries(gradeDist).map(([name, value]) => ({ name, value }));
    
    return {
      totalStudents,
      passedStudents,
      passRate,
      averagePercentage,
      gradeDist,
      chartData
    };
  };

  const stats = reportExam ? calculatePerformanceStats(reportExam.id) : null;

  const COLORS = ['#10b981', '#3b82f6', '#6366f1', '#8b5cf6', '#f59e0b', '#f97316', '#ef4444'];

  const filteredStudents = dataStore.getStudents().filter(s => 
    s.class === selectedExam?.class && 
    (s.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) || s.id.toLowerCase().includes(studentSearchTerm.toLowerCase()))
  );

  const examClassInfo = dataStore.getClasses().find(c => c.name === selectedExam?.class);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Exams & Results</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => alert('Generating report cards for all students...')}>
            <FileBarChart className="w-4 h-4 mr-2" />
            Generate Report Cards
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Exam
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exams.length}</div>
            <p className="text-xs text-muted-foreground">This academic year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Ongoing Exams</CardTitle>
            <FileText className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exams.filter(e => e.status === 'Ongoing').length}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Results Published</CardTitle>
            <FileText className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exams.filter(e => e.status === 'Completed').length}</div>
            <p className="text-xs text-muted-foreground">Exams completed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exam Schedule & Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.name}</TableCell>
                  <TableCell>{exam.class}</TableCell>
                  <TableCell>{exam.date}</TableCell>
                  <TableCell>
                    <select
                      value={exam.status}
                      onChange={(e) => handleStatusChange(exam.id, e.target.value)}
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold border-none focus:ring-0 cursor-pointer ${
                        exam.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 
                        exam.status === 'Ongoing' ? 'bg-amber-100 text-amber-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenMarksModal(exam)}>Enter Marks</Button>
                      <Button variant="ghost" size="sm" onClick={() => handleViewResults(exam)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Results
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleViewPerformanceReport(exam)}>
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Report
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => alert(`Downloading schedule for ${exam.name}...`)}>
                        <Download className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Exam Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <CardTitle>Create New Exam</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleCreateExam} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Exam Name</label>
                  <Input 
                    required 
                    placeholder="e.g. Final Exam 2024"
                    value={newExam.name}
                    onChange={e => setNewExam({...newExam, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Class</label>
                    <select 
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={newExam.class}
                      onChange={e => setNewExam({...newExam, class: e.target.value})}
                    >
                      {dataStore.getClasses().map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Date</label>
                    <Input 
                      required 
                      type="date"
                      value={newExam.date}
                      onChange={e => setNewExam({...newExam, date: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Initial Status</label>
                  <select 
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={newExam.status}
                    onChange={e => setNewExam({...newExam, status: e.target.value})}
                  >
                    <option>Upcoming</option>
                    <option>Ongoing</option>
                    <option>Completed</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit">Create Exam</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enter Marks Modal */}
      {isMarksModalOpen && selectedExam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <div>
                <CardTitle>Enter Marks: {selectedExam.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{selectedExam.class}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsMarksModalOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      placeholder="Search student..." 
                      className="pl-9"
                      value={studentSearchTerm}
                      onChange={e => setStudentSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="border rounded-md max-h-[300px] overflow-y-auto">
                    {filteredStudents.map(student => (
                      <button
                        key={student.id}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors border-b last:border-0 ${selectedStudent?.id === student.id ? 'bg-primary/10 font-semibold' : ''}`}
                        onClick={() => handleSelectStudent(student)}
                      >
                        <div className="flex justify-between items-center">
                          <span>{student.name}</span>
                          <span className="text-xs text-muted-foreground">Roll: {student.roll}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground">{student.id}</div>
                      </button>
                    ))}
                    {filteredStudents.length === 0 && (
                      <div className="p-4 text-center text-sm text-muted-foreground">No students found for this class.</div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedStudent ? (
                    <>
                      <div className="p-3 bg-primary/5 rounded-md border border-primary/10">
                        <p className="text-sm font-semibold">{selectedStudent.name}</p>
                        <p className="text-xs text-muted-foreground">ID: {selectedStudent.id} | Roll: {selectedStudent.roll}</p>
                      </div>
                      <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
                        {examClassInfo?.subjects.map(subject => (
                          <div key={subject} className="flex items-center justify-between gap-4">
                            <label className="text-sm font-medium flex-1">{subject}</label>
                            <Input 
                              type="number" 
                              className="w-20 h-8" 
                              placeholder="0-100"
                              value={marks[subject] || ''}
                              onChange={e => setMarks({...marks, [subject]: e.target.value})}
                            />
                          </div>
                        ))}
                      </div>
                      <Button className="w-full" onClick={handleSaveMarks}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Marks
                      </Button>
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm italic border-2 border-dashed rounded-md p-8 text-center">
                      Select a student from the list to enter marks.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* View Results Modal */}
      {isResultsViewOpen && viewResultsExam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <div>
                <CardTitle>Results: {viewResultsExam.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{viewResultsExam.class}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsResultsViewOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-center">Total Marks</TableHead>
                      <TableHead className="text-center">Percentage</TableHead>
                      <TableHead className="text-center">Grade</TableHead>
                      <TableHead className="text-center">GPA</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataStore.getExamResults(viewResultsExam.id).map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-mono text-xs">{result.studentId}</TableCell>
                        <TableCell className="font-medium">{result.studentName}</TableCell>
                        <TableCell className="text-center">{result.totalMarks}</TableCell>
                        <TableCell className="text-center">{result.percentage.toFixed(1)}%</TableCell>
                        <TableCell className="text-center">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            result.grade === 'F' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {result.grade}
                          </span>
                        </TableCell>
                        <TableCell className="text-center font-bold">{result.gpa.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    {dataStore.getExamResults(viewResultsExam.id).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground italic">
                          No results found for this exam. Enter marks to see them here.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end pt-6">
                <Button variant="outline" onClick={() => setIsResultsViewOpen(false)}>Close</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance Report Modal */}
      {isPerformanceReportOpen && reportExam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-5xl bg-white max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4 sticky top-0 bg-white z-10">
              <div>
                <CardTitle>Performance Report: {reportExam.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{reportExam.class}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => stats && downloadPerformanceReport(reportExam, stats)}>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsPerformanceReportOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              {!stats ? (
                <div className="p-12 text-center text-muted-foreground italic">
                  No data available to generate a report. Please enter marks for students first.
                </div>
              ) : (
                <>
                  <div className="grid gap-4 md:grid-cols-4">
                    <Card className="bg-primary/5 border-none">
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{stats.totalStudents}</div>
                        <p className="text-xs text-muted-foreground">Total Students</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-emerald-50 border-none">
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-emerald-600">{stats.passRate.toFixed(1)}%</div>
                        <p className="text-xs text-muted-foreground">Pass Rate</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-blue-50 border-none">
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-blue-600">{stats.averagePercentage.toFixed(1)}%</div>
                        <p className="text-xs text-muted-foreground">Average Score</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-amber-50 border-none">
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-amber-600">{stats.passedStudents}</div>
                        <p className="text-xs text-muted-foreground">Students Passed</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Grade Distribution</CardTitle>
                      </CardHeader>
                      <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={stats.chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip 
                              cursor={{fill: 'transparent'}}
                              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                              {stats.chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Pass vs Fail Ratio</CardTitle>
                      </CardHeader>
                      <CardContent className="h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Passed', value: stats.passedStudents },
                                { name: 'Failed', value: stats.totalStudents - stats.passedStudents }
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              <Cell fill="#10b981" />
                              <Cell fill="#ef4444" />
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold">{stats.passRate.toFixed(0)}%</span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Pass Rate</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Detailed Grade Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
                        {Object.entries(stats.gradeDist).map(([grade, count], index) => (
                          <div key={grade} className="flex flex-col items-center p-3 rounded-lg border bg-muted/10">
                            <span className="text-lg font-bold" style={{ color: COLORS[index] }}>{grade}</span>
                            <span className="text-2xl font-bold">{count}</span>
                            <span className="text-[10px] text-muted-foreground">Students</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
              <div className="flex justify-end pt-4">
                <Button variant="outline" onClick={() => setIsPerformanceReportOpen(false)}>Close Report</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Filter, Contact, Upload, User, X, Edit2 } from 'lucide-react';
import IDCardGenerator from './IDCardGenerator';
import { dataStore, Student } from '@/services/dataService';

export default function StudentsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('All');
  const [filterSection, setFilterSection] = useState('All');
  const [filterGroup, setFilterGroup] = useState('All');
  const [students, setStudents] = useState<Student[]>(dataStore.getStudents());
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [isBulkPhotoModalOpen, setIsBulkPhotoModalOpen] = useState(false);
  const [bulkUploadStatus, setBulkUploadStatus] = useState<{success: number, failed: number} | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSectionFilterOpen, setIsSectionFilterOpen] = useState(false);
  const [isGroupFilterOpen, setIsGroupFilterOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingForId, setUploadingForId] = useState<string | null>(null);

  const refreshStudents = () => {
    setStudents([...dataStore.getStudents()]);
  };

  // New Student Form State
  const [newStudent, setNewStudent] = useState({
    name: '',
    class: 'Class 6',
    section: 'A',
    group: 'N/A',
    roll: '',
    phone: '',
    fatherName: '',
    motherName: '',
    guardianPhone: '',
    guardianEmail: '',
    previousSchool: '',
    lastYearGPA: '',
    lastYearGrade: '',
    academicHistory: ''
  });

  const [editFormData, setEditFormData] = useState({
    name: '',
    class: '',
    section: '',
    group: '',
    roll: '',
    phone: '',
    fatherName: '',
    motherName: '',
    guardianPhone: '',
    guardianEmail: '',
    previousSchool: '',
    lastYearGPA: '',
    lastYearGrade: '',
    academicHistory: ''
  });

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         student.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === 'All' || student.class === filterClass;
    const matchesSection = filterSection === 'All' || student.section === filterSection;
    const matchesGroup = filterGroup === 'All' || student.group === filterGroup;
    return matchesSearch && matchesClass && matchesSection && matchesGroup;
  });

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && uploadingForId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        dataStore.updateStudent(uploadingForId, { photo: base64String });
        refreshStudents();
        setUploadingForId(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = (id: string) => {
    setUploadingForId(id);
    fileInputRef.current?.click();
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    dataStore.addStudent({
      ...newStudent,
      roll: parseInt(newStudent.roll) || 0,
      photo: null
    });
    refreshStudents();
    setIsAdmissionModalOpen(false);
    setNewStudent({
      name: '',
      class: 'Class 6',
      section: 'A',
      group: 'N/A',
      roll: '',
      phone: '',
      fatherName: '',
      motherName: '',
      guardianPhone: '',
      guardianEmail: '',
      previousSchool: '',
      lastYearGPA: '',
      lastYearGrade: '',
      academicHistory: ''
    });
  };

  const handleOpenEditModal = (student: Student) => {
    setEditingStudent(student);
    setEditFormData({
      name: student.name,
      class: student.class,
      section: student.section,
      group: student.group,
      roll: student.roll.toString(),
      phone: student.phone,
      fatherName: student.fatherName || '',
      motherName: student.motherName || '',
      guardianPhone: student.guardianPhone || '',
      guardianEmail: student.guardianEmail || '',
      previousSchool: student.previousSchool || '',
      lastYearGPA: student.lastYearGPA || '',
      lastYearGrade: student.lastYearGrade || '',
      academicHistory: student.academicHistory || ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    dataStore.updateStudent(editingStudent.id, {
      ...editFormData,
      roll: parseInt(editFormData.roll) || 0
    });

    refreshStudents();
    setIsEditModalOpen(false);
    setEditingStudent(null);
  };

  const toggleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map(s => s.id));
    }
  };

  const toggleSelectStudent = (id: string) => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(selectedStudentIds.filter(sid => sid !== id));
    } else {
      setSelectedStudentIds([...selectedStudentIds, id]);
    }
  };

  const handleBulkPhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    let success = 0;
    let failed = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const studentId = file.name.split('.')[0].toUpperCase(); // Expecting ST1001.jpg
      
      const student = dataStore.getStudents().find(s => s.id === studentId);
      if (student) {
        const reader = new FileReader();
        const promise = new Promise((resolve) => {
          reader.onloadend = () => {
            dataStore.updateStudent(studentId, { photo: reader.result as string });
            success++;
            resolve(true);
          };
          reader.readAsDataURL(file);
        });
        await promise;
      } else {
        failed++;
      }
    }

    setBulkUploadStatus({ success, failed });
    refreshStudents();
  };

  return (
    <div className="space-y-6">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handlePhotoUpload}
      />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Students</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsBulkPhotoModalOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Bulk Photo Upload
          </Button>
          <Button onClick={() => setIsAdmissionModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Admission
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Student Directory</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search by name or ID..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Class Filter Dropdown */}
              <div className="relative">
                <Button variant="outline" size="sm" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                  <Filter className="w-3 h-3 mr-2" />
                  {filterClass === 'All' ? 'All Classes' : filterClass}
                </Button>
                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-20 p-1">
                    {['All', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map((cls) => (
                      <button
                        key={cls}
                        className={`w-full text-left px-3 py-1.5 text-xs rounded-sm transition-colors ${
                          filterClass === cls ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                        }`}
                        onClick={() => {
                          setFilterClass(cls);
                          setIsFilterOpen(false);
                        }}
                      >
                        {cls === 'All' ? 'All Classes' : cls}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Section Filter Dropdown */}
              <div className="relative">
                <Button variant="outline" size="sm" onClick={() => setIsSectionFilterOpen(!isSectionFilterOpen)}>
                  <Filter className="w-3 h-3 mr-2" />
                  {filterSection === 'All' ? 'All Sections' : `Sec: ${filterSection}`}
                </Button>
                {isSectionFilterOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-20 p-1">
                    {['All', 'A', 'B', 'C'].map((sec) => (
                      <button
                        key={sec}
                        className={`w-full text-left px-3 py-1.5 text-xs rounded-sm transition-colors ${
                          filterSection === sec ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                        }`}
                        onClick={() => {
                          setFilterSection(sec);
                          setIsSectionFilterOpen(false);
                        }}
                      >
                        {sec === 'All' ? 'All Sections' : `Section ${sec}`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Group Filter Dropdown */}
              <div className="relative">
                <Button variant="outline" size="sm" onClick={() => setIsGroupFilterOpen(!isGroupFilterOpen)}>
                  <Filter className="w-3 h-3 mr-2" />
                  {filterGroup === 'All' ? 'All Groups' : `Grp: ${filterGroup}`}
                </Button>
                {isGroupFilterOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-20 p-1">
                    {['All', 'Science', 'Commerce', 'Humanities', 'N/A'].map((grp) => (
                      <button
                        key={grp}
                        className={`w-full text-left px-3 py-1.5 text-xs rounded-sm transition-colors ${
                          filterGroup === grp ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                        }`}
                        onClick={() => {
                          setFilterGroup(grp);
                          setIsGroupFilterOpen(false);
                        }}
                      >
                        {grp === 'All' ? 'All Groups' : grp}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {(filterClass !== 'All' || filterSection !== 'All' || filterGroup !== 'All' || searchTerm !== '') && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setFilterClass('All');
                    setFilterSection('All');
                    setFilterGroup('All');
                    setSearchTerm('');
                  }}
                  className="text-xs text-muted-foreground hover:text-primary"
                >
                  <X className="w-3 h-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300"
                    checked={selectedStudentIds.length === filteredStudents.length && filteredStudents.length > 0}
                    onChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-[80px]">Photo</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Roll</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Today's Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id} className={selectedStudentIds.includes(student.id) ? 'bg-primary/5' : ''}>
                  <TableCell>
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300"
                      checked={selectedStudentIds.includes(student.id)}
                      onChange={() => toggleSelectStudent(student.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
                      {student.photo ? (
                        <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.roll}</TableCell>
                  <TableCell>{student.group}</TableCell>
                  <TableCell>
                    {(() => {
                      const status = dataStore.getStudentTodayStatus(student.id);
                      switch (status) {
                        case 'present':
                          return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">Present</span>;
                        case 'absent':
                          return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Absent</span>;
                        case 'late':
                          return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">Late</span>;
                        default:
                          return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">Not Marked</span>;
                      }
                    })()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setViewingStudent(student)}
                        title="View Profile"
                      >
                        <User className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => triggerUpload(student.id)}
                        title="Upload Photo"
                      >
                        <Upload className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleOpenEditModal(student)}
                        title="Edit Student"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedStudent(student)}
                        title="Generate ID Card"
                      >
                        <Contact className="w-4 h-4 mr-2" />
                        ID Card
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    No students found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bulk Photo Upload Modal */}
      {isBulkPhotoModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <CardTitle>Bulk Photo Upload</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => {
                setIsBulkPhotoModalOpen(false);
                setBulkUploadStatus(null);
              }}>
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="p-8 border-2 border-dashed rounded-lg text-center space-y-4 bg-muted/20">
                <Upload className="w-10 h-10 mx-auto text-muted-foreground opacity-50" />
                <div>
                  <p className="text-sm font-medium">Upload multiple student photos</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Filenames must match Student IDs (e.g., ST1001.jpg)
                  </p>
                </div>
                <Button onClick={() => document.getElementById('bulk-photo-input')?.click()}>
                  Select Files
                </Button>
                <input 
                  id="bulk-photo-input"
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleBulkPhotoUpload}
                />
              </div>

              {bulkUploadStatus && (
                <div className={`p-4 rounded-md text-sm ${bulkUploadStatus.failed === 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
                  <p className="font-semibold">Upload Complete</p>
                  <p>Successfully updated: {bulkUploadStatus.success}</p>
                  {bulkUploadStatus.failed > 0 && (
                    <p className="text-red-600">Failed (ID not found): {bulkUploadStatus.failed}</p>
                  )}
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button variant="outline" onClick={() => {
                  setIsBulkPhotoModalOpen(false);
                  setBulkUploadStatus(null);
                }}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Student Profile View Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl bg-white overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4 bg-primary/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20">
                  {viewingStudent.photo ? (
                    <img src={viewingStudent.photo} alt={viewingStudent.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-xl">{viewingStudent.name}</CardTitle>
                  <p className="text-xs text-muted-foreground font-mono">{viewingStudent.id}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setViewingStudent(null)}>
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider border-b pb-1">Academic Info</h4>
                  <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <span className="text-muted-foreground">Class:</span>
                    <span className="font-medium">{viewingStudent.class}</span>
                    <span className="text-muted-foreground">Section:</span>
                    <span className="font-medium">{viewingStudent.section}</span>
                    <span className="text-muted-foreground">Roll:</span>
                    <span className="font-medium">{viewingStudent.roll}</span>
                    <span className="text-muted-foreground">Group:</span>
                    <span className="font-medium">{viewingStudent.group}</span>
                  </div>
                </div>

                {/* Guardian Info */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider border-b pb-1">Guardian Details</h4>
                  <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <span className="text-muted-foreground">Father:</span>
                    <span className="font-medium">{viewingStudent.fatherName || 'N/A'}</span>
                    <span className="text-muted-foreground">Mother:</span>
                    <span className="font-medium">{viewingStudent.motherName || 'N/A'}</span>
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">{viewingStudent.guardianPhone || viewingStudent.phone}</span>
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium truncate" title={viewingStudent.guardianEmail}>{viewingStudent.guardianEmail || 'N/A'}</span>
                  </div>
                </div>

                {/* Academic History */}
                <div className="md:col-span-2 space-y-4">
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider border-b pb-1">Academic History & Performance</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Previous School:</span>
                        <span className="font-medium">{viewingStudent.previousSchool || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Year GPA:</span>
                        <span className="font-medium text-emerald-600">{viewingStudent.lastYearGPA || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Year Grade:</span>
                        <span className="font-medium text-emerald-600">{viewingStudent.lastYearGrade || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase">History Summary</span>
                      <p className="text-sm bg-muted/30 p-3 rounded border italic">
                        {viewingStudent.academicHistory || 'No history recorded.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Attendance Summary */}
                <div className="md:col-span-2 pt-4 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Recent Attendance</h4>
                    <span className="text-xs text-muted-foreground">Last 5 records</span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {dataStore.getStudentAttendanceHistory(viewingStudent.id).slice(0, 5).map((record) => (
                      <div key={record.date} className="flex-shrink-0 flex flex-col items-center p-3 bg-muted/50 rounded-lg border min-w-[100px]">
                        <span className="text-[10px] font-medium text-muted-foreground mb-1">{record.date}</span>
                        <span className={`text-xs font-bold uppercase ${
                          record.status === 'present' ? 'text-emerald-600' : 
                          record.status === 'absent' ? 'text-red-600' : 'text-amber-600'
                        }`}>
                          {record.status}
                        </span>
                      </div>
                    ))}
                    {dataStore.getStudentAttendanceHistory(viewingStudent.id).length === 0 && (
                      <p className="text-xs text-muted-foreground italic w-full text-center py-4">No attendance records found.</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-8 border-t mt-6">
                <Button variant="outline" onClick={() => {
                  setViewingStudent(null);
                  handleOpenEditModal(viewingStudent);
                }}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button onClick={() => setViewingStudent(null)}>Close</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* New Admission Modal */}
      {isAdmissionModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <CardTitle>New Student Admission</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsAdmissionModalOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Student Name</label>
                    <Input 
                      required 
                      placeholder="Full Name"
                      value={newStudent.name}
                      onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Class</label>
                    <select 
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={newStudent.class}
                      onChange={e => setNewStudent({...newStudent, class: e.target.value})}
                    >
                      {dataStore.getClasses().map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Section</label>
                    <select 
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={newStudent.section}
                      onChange={e => setNewStudent({...newStudent, section: e.target.value})}
                    >
                      <option>A</option>
                      <option>B</option>
                      <option>C</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Roll Number</label>
                    <Input 
                      required 
                      type="number" 
                      placeholder="Roll"
                      value={newStudent.roll}
                      onChange={e => setNewStudent({...newStudent, roll: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Group</label>
                    <select 
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={newStudent.group}
                      onChange={e => setNewStudent({...newStudent, group: e.target.value})}
                    >
                      <option>N/A</option>
                      <option>Science</option>
                      <option>Commerce</option>
                      <option>Humanities</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Guardian Phone</label>
                    <Input 
                      required 
                      placeholder="017..."
                      value={newStudent.guardianPhone}
                      onChange={e => setNewStudent({...newStudent, guardianPhone: e.target.value, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold mb-3">Guardian Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Father's Name</label>
                      <Input 
                        placeholder="Father's Name"
                        value={newStudent.fatherName}
                        onChange={e => setNewStudent({...newStudent, fatherName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Mother's Name</label>
                      <Input 
                        placeholder="Mother's Name"
                        value={newStudent.motherName}
                        onChange={e => setNewStudent({...newStudent, motherName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Guardian Email</label>
                      <Input 
                        type="email"
                        placeholder="Email (Optional)"
                        value={newStudent.guardianEmail}
                        onChange={e => setNewStudent({...newStudent, guardianEmail: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold mb-3">Academic History & Performance</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Previous School</label>
                      <Input 
                        placeholder="Previous School Name"
                        value={newStudent.previousSchool}
                        onChange={e => setNewStudent({...newStudent, previousSchool: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Last GPA</label>
                        <Input 
                          placeholder="5.00"
                          value={newStudent.lastYearGPA}
                          onChange={e => setNewStudent({...newStudent, lastYearGPA: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Grade</label>
                        <Input 
                          placeholder="A+"
                          value={newStudent.lastYearGrade}
                          onChange={e => setNewStudent({...newStudent, lastYearGrade: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium">Academic History Summary</label>
                      <Input 
                        placeholder="e.g. Class 5 (Primary School), Class 4..."
                        value={newStudent.academicHistory}
                        onChange={e => setNewStudent({...newStudent, academicHistory: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAdmissionModalOpen(false)}>Cancel</Button>
                  <Button type="submit">Complete Admission</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Student Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <CardTitle>Edit Student: {editingStudent?.id}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsEditModalOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleUpdateStudent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Student Name</label>
                    <Input 
                      required 
                      placeholder="Full Name"
                      value={editFormData.name}
                      onChange={e => setEditFormData({...editFormData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Class</label>
                    <select 
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={editFormData.class}
                      onChange={e => setEditFormData({...editFormData, class: e.target.value})}
                    >
                      {dataStore.getClasses().map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Section</label>
                    <select 
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={editFormData.section}
                      onChange={e => setEditFormData({...editFormData, section: e.target.value})}
                    >
                      <option>A</option>
                      <option>B</option>
                      <option>C</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Roll Number</label>
                    <Input 
                      required 
                      type="number" 
                      placeholder="Roll"
                      value={editFormData.roll}
                      onChange={e => setEditFormData({...editFormData, roll: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Group</label>
                    <select 
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={editFormData.group}
                      onChange={e => setEditFormData({...editFormData, group: e.target.value})}
                    >
                      <option>N/A</option>
                      <option>Science</option>
                      <option>Commerce</option>
                      <option>Humanities</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Guardian Phone</label>
                    <Input 
                      required 
                      placeholder="017..."
                      value={editFormData.guardianPhone}
                      onChange={e => setEditFormData({...editFormData, guardianPhone: e.target.value, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold mb-3">Guardian Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Father's Name</label>
                      <Input 
                        placeholder="Father's Name"
                        value={editFormData.fatherName}
                        onChange={e => setEditFormData({...editFormData, fatherName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Mother's Name</label>
                      <Input 
                        placeholder="Mother's Name"
                        value={editFormData.motherName}
                        onChange={e => setEditFormData({...editFormData, motherName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Guardian Email</label>
                      <Input 
                        type="email"
                        placeholder="Email (Optional)"
                        value={editFormData.guardianEmail}
                        onChange={e => setEditFormData({...editFormData, guardianEmail: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold mb-3">Academic History & Performance</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Previous School</label>
                      <Input 
                        placeholder="Previous School Name"
                        value={editFormData.previousSchool}
                        onChange={e => setEditFormData({...editFormData, previousSchool: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Last GPA</label>
                        <Input 
                          placeholder="5.00"
                          value={editFormData.lastYearGPA}
                          onChange={e => setEditFormData({...editFormData, lastYearGPA: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Grade</label>
                        <Input 
                          placeholder="A+"
                          value={editFormData.lastYearGrade}
                          onChange={e => setEditFormData({...editFormData, lastYearGrade: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium">Academic History Summary</label>
                      <Input 
                        placeholder="e.g. Class 5 (Primary School), Class 4..."
                        value={editFormData.academicHistory}
                        onChange={e => setEditFormData({...editFormData, academicHistory: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Attendance History */}
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-semibold mb-3">Recent Attendance History</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                    {dataStore.getStudentAttendanceHistory(editingStudent?.id || '').length > 0 ? (
                      dataStore.getStudentAttendanceHistory(editingStudent?.id || '').map((record) => (
                        <div key={record.date} className="flex items-center justify-between text-xs p-2 bg-muted/50 rounded">
                          <span className="font-medium">{record.date}</span>
                          <span className={`capitalize ${
                            record.status === 'present' ? 'text-emerald-600' : 
                            record.status === 'absent' ? 'text-red-600' : 'text-amber-600'
                          }`}>
                            {record.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No attendance records found for this student.</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedStudent && (
        <IDCardGenerator 
          student={selectedStudent} 
          onClose={() => setSelectedStudent(null)} 
        />
      )}
    </div>
  );
}

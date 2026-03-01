import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Filter, User, X, Edit2, Upload, BookOpen, Award, Users, ExternalLink } from 'lucide-react';
import { dataStore, Teacher } from '@/services/dataService';

export default function TeachersModule() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSubject, setFilterSubject] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [teachers, setTeachers] = useState<Teacher[]>(dataStore.getTeachers());
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
    const [isSubjectFilterOpen, setIsSubjectFilterOpen] = useState(false);
    const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingForId, setUploadingForId] = useState<string | null>(null);

    const refreshTeachers = () => {
        setTeachers([...dataStore.getTeachers()]);
    };

    // New Teacher Form State
    const emptyForm = {
        name: '',
        designation: 'Assistant Teacher',
        subject: 'Bangla',
        phone: '',
        email: '',
        nid: '',
        joiningDate: '',
        qualification: '',
        experience: '',
        address: '',
        assignedClasses: '',
        status: 'Active' as 'Active' | 'On Leave' | 'Inactive',
        academicHistory: '',
        certifications: '',
        workHistory: '',
    };

    const [newTeacher, setNewTeacher] = useState({ ...emptyForm });
    const [editFormData, setEditFormData] = useState({ ...emptyForm });

    // Collect all unique subjects for filter
    const allSubjects = Array.from(new Set(teachers.flatMap(t => t.subjects)));

    const filteredTeachers = teachers.filter(teacher => {
        const matchesSearch =
            teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.phone.includes(searchTerm);
        const matchesSubject =
            filterSubject === 'All' || teacher.subjects.includes(filterSubject);
        const matchesStatus =
            filterStatus === 'All' || teacher.status === filterStatus;
        return matchesSearch && matchesSubject && matchesStatus;
    });

    // Stats
    const totalTeachers = teachers.length;
    const activeTeachers = teachers.filter(t => t.status === 'Active').length;
    const onLeaveTeachers = teachers.filter(t => t.status === 'On Leave').length;
    const totalSubjectsCovered = allSubjects.length;

    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && uploadingForId) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                dataStore.updateTeacher(uploadingForId, { photo: base64String });
                refreshTeachers();
                setUploadingForId(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerUpload = (id: string) => {
        setUploadingForId(id);
        fileInputRef.current?.click();
    };

    const handleAddTeacher = (e: React.FormEvent) => {
        e.preventDefault();
        dataStore.addTeacher({
            name: newTeacher.name,
            designation: newTeacher.designation,
            subjects: [newTeacher.subject],
            phone: newTeacher.phone,
            email: newTeacher.email,
            nid: newTeacher.nid,
            joiningDate: newTeacher.joiningDate,
            qualification: newTeacher.qualification,
            experience: newTeacher.experience,
            address: newTeacher.address,
            assignedClasses: newTeacher.assignedClasses.split(',').map(s => s.trim()).filter(Boolean),
            status: newTeacher.status,
            photo: null,
            academicHistory: newTeacher.academicHistory.split(',').map(s => s.trim()).filter(Boolean),
            certifications: newTeacher.certifications.split(',').map(s => s.trim()).filter(Boolean),
            workHistory: newTeacher.workHistory.split(',').map(s => s.trim()).filter(Boolean),
        });
        refreshTeachers();
        setIsAddModalOpen(false);
        setNewTeacher({ ...emptyForm });
    };

    const handleOpenEditModal = (teacher: Teacher) => {
        setEditingTeacher(teacher);
        setEditFormData({
            name: teacher.name,
            designation: teacher.designation,
            subject: teacher.subjects[0] || '',
            phone: teacher.phone,
            email: teacher.email,
            nid: teacher.nid,
            joiningDate: teacher.joiningDate,
            qualification: teacher.qualification,
            experience: teacher.experience,
            address: teacher.address,
            assignedClasses: teacher.assignedClasses.join(', '),
            status: teacher.status,
            academicHistory: teacher.academicHistory?.join(', ') || '',
            certifications: teacher.certifications?.join(', ') || '',
            workHistory: teacher.workHistory?.join(', ') || '',
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateTeacher = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTeacher) return;

        dataStore.updateTeacher(editingTeacher.id, {
            name: editFormData.name,
            designation: editFormData.designation,
            subjects: [editFormData.subject],
            phone: editFormData.phone,
            email: editFormData.email,
            nid: editFormData.nid,
            joiningDate: editFormData.joiningDate,
            qualification: editFormData.qualification,
            experience: editFormData.experience,
            address: editFormData.address,
            assignedClasses: editFormData.assignedClasses.split(',').map(s => s.trim()).filter(Boolean),
            status: editFormData.status,
            academicHistory: editFormData.academicHistory.split(',').map(s => s.trim()).filter(Boolean),
            certifications: editFormData.certifications.split(',').map(s => s.trim()).filter(Boolean),
            workHistory: editFormData.workHistory.split(',').map(s => s.trim()).filter(Boolean),
        });

        refreshTeachers();
        setIsEditModalOpen(false);
        setEditingTeacher(null);
    };

    const selectClass = 'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

    const subjectOptions = [
        'Bangla', 'English', 'Math', 'Physics', 'Chemistry', 'Biology',
        'Religion', 'BGS', 'ICT', 'Accounting', 'Business Ent.', 'Finance',
        'Science', 'General Knowledge', 'Drawing', 'History', 'Geography',
    ];

    const renderFormFields = (
        formData: typeof emptyForm,
        setFormData: (val: typeof emptyForm) => void
    ) => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <input
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        required
                        placeholder="Teacher's Full Name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Designation</label>
                    <select
                        className={selectClass}
                        value={formData.designation}
                        onChange={e => setFormData({ ...formData, designation: e.target.value })}
                    >
                        <option>Head Teacher</option>
                        <option>Senior Teacher</option>
                        <option>Assistant Teacher</option>
                        <option>Junior Teacher</option>
                        <option>Part-Time Teacher</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Primary Subject</label>
                    <select
                        className={selectClass}
                        value={formData.subject}
                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    >
                        {subjectOptions.map(s => (
                            <option key={s}>{s}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <select
                        className={selectClass}
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    >
                        <option>Active</option>
                        <option>On Leave</option>
                        <option>Inactive</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                        required
                        placeholder="017..."
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
            </div>

            <div className="border-t pt-4">
                <h4 className="text-sm font-semibold mb-3">Professional Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">NID Number</label>
                        <Input
                            placeholder="National ID"
                            value={formData.nid}
                            onChange={e => setFormData({ ...formData, nid: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Joining Date</label>
                        <Input
                            type="date"
                            value={formData.joiningDate}
                            onChange={e => setFormData({ ...formData, joiningDate: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Qualification</label>
                        <Input
                            placeholder="e.g. M.Sc in Physics"
                            value={formData.qualification}
                            onChange={e => setFormData({ ...formData, qualification: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Years of Experience</label>
                        <Input
                            placeholder="e.g. 12"
                            value={formData.experience}
                            onChange={e => setFormData({ ...formData, experience: e.target.value })}
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-medium">Assigned Classes (comma separated)</label>
                        <Input
                            placeholder="Class 9, Class 10"
                            value={formData.assignedClasses}
                            onChange={e => setFormData({ ...formData, assignedClasses: e.target.value })}
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-medium">Academic History (comma separated)</label>
                        <textarea
                            className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            placeholder="Degree, Institution (Year)"
                            value={formData.academicHistory}
                            onChange={e => setFormData({ ...formData, academicHistory: e.target.value })}
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-medium">Certifications (comma separated)</label>
                        <textarea
                            className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            placeholder="Cert Name, Another Cert"
                            value={formData.certifications}
                            onChange={e => setFormData({ ...formData, certifications: e.target.value })}
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-medium">Work History (comma separated)</label>
                        <textarea
                            className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            placeholder="Role at School (Year-Year)"
                            value={formData.workHistory}
                            onChange={e => setFormData({ ...formData, workHistory: e.target.value })}
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-medium">Address</label>
                        <Input
                            placeholder="Full Address"
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <div className="space-y-6">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handlePhotoUpload}
            />

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-3xl font-bold tracking-tight">Teachers</h2>
                <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Teacher
                </Button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Users className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Teachers</p>
                                <p className="text-2xl font-bold">{totalTeachers}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                                <Award className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Active</p>
                                <p className="text-2xl font-bold text-emerald-600">{activeTeachers}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                                <User className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">On Leave</p>
                                <p className="text-2xl font-bold text-amber-600">{onLeaveTeachers}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-violet-100 flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-violet-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Subjects Covered</p>
                                <p className="text-2xl font-bold text-violet-600">{totalSubjectsCovered}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Teacher Directory Table */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle>Teacher Directory</CardTitle>
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="relative w-full md:w-64">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, ID or phone..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Subject Filter */}
                            <div className="relative">
                                <Button variant="outline" size="sm" onClick={() => setIsSubjectFilterOpen(!isSubjectFilterOpen)}>
                                    <Filter className="w-3 h-3 mr-2" />
                                    {filterSubject === 'All' ? 'All Subjects' : filterSubject}
                                </Button>
                                {isSubjectFilterOpen && (
                                    <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-20 p-1 max-h-60 overflow-y-auto">
                                        {['All', ...subjectOptions].map(sub => (
                                            <button
                                                key={sub}
                                                className={`w-full text-left px-3 py-1.5 text-xs rounded-sm transition-colors ${filterSubject === sub
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'hover:bg-muted'
                                                    }`}
                                                onClick={() => {
                                                    setFilterSubject(sub);
                                                    setIsSubjectFilterOpen(false);
                                                }}
                                            >
                                                {sub === 'All' ? 'All Subjects' : sub}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Status Filter */}
                            <div className="relative">
                                <Button variant="outline" size="sm" onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}>
                                    <Filter className="w-3 h-3 mr-2" />
                                    {filterStatus === 'All' ? 'All Status' : filterStatus}
                                </Button>
                                {isStatusFilterOpen && (
                                    <div className="absolute right-0 mt-2 w-36 bg-white border rounded-md shadow-lg z-20 p-1">
                                        {['All', 'Active', 'On Leave', 'Inactive'].map(st => (
                                            <button
                                                key={st}
                                                className={`w-full text-left px-3 py-1.5 text-xs rounded-sm transition-colors ${filterStatus === st
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'hover:bg-muted'
                                                    }`}
                                                onClick={() => {
                                                    setFilterStatus(st);
                                                    setIsStatusFilterOpen(false);
                                                }}
                                            >
                                                {st === 'All' ? 'All Status' : st}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {(filterSubject !== 'All' || filterStatus !== 'All' || searchTerm !== '') && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setFilterSubject('All');
                                        setFilterStatus('All');
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
                                <TableHead className="w-[80px]">Photo</TableHead>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Designation</TableHead>
                                <TableHead>Subject(s)</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTeachers.map(teacher => (
                                <TableRow key={teacher.id}>
                                    <TableCell>
                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
                                            {teacher.photo ? (
                                                <img src={teacher.photo} alt={teacher.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-5 h-5 text-muted-foreground" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium font-mono text-xs">{teacher.id}</TableCell>
                                    <TableCell className="font-medium">{teacher.name}</TableCell>
                                    <TableCell className="text-sm">{teacher.designation}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {teacher.subjects.map(sub => (
                                                <span
                                                    key={sub}
                                                    className="inline-flex items-center rounded-md bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium ring-1 ring-inset ring-primary/20"
                                                >
                                                    {sub}
                                                </span>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">{teacher.phone}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${teacher.status === 'Active'
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : teacher.status === 'On Leave'
                                                    ? 'bg-amber-100 text-amber-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {teacher.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="sm" asChild title="View Profile">
                                                <Link to={`/teachers/${teacher.id}`}>
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => triggerUpload(teacher.id)} title="Upload Photo">
                                                <Upload className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleOpenEditModal(teacher)} title="Edit Teacher">
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredTeachers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                                        No teachers found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* ---- Add Teacher Modal ---- */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-lg bg-white max-h-[90vh] overflow-y-auto">
                        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                            <CardTitle>Add New Teacher</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setIsAddModalOpen(false)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleAddTeacher} className="space-y-4">
                                {renderFormFields(newTeacher, setNewTeacher)}
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">Add Teacher</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ---- Edit Teacher Modal ---- */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-lg bg-white max-h-[90vh] overflow-y-auto">
                        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                            <CardTitle>Edit Teacher — {editingTeacher?.name}</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setIsEditModalOpen(false)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleUpdateTeacher} className="space-y-4">
                                {renderFormFields(editFormData, setEditFormData)}
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">Update Teacher</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

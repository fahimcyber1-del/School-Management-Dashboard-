import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    User,
    Mail,
    Phone,
    BookOpen,
    Calendar,
    ArrowLeft,
    MapPin,
    Award,
    Briefcase,
    CreditCard,
    Edit2,
    Clock,
    CheckCircle2,
    AlertCircle,
    XCircle,
    GraduationCap,
    ScrollText,
    History
} from 'lucide-react';
import { dataStore, Teacher } from '@/services/dataService';

export default function TeacherProfile() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [teacher, setTeacher] = useState<Teacher | null>(null);

    useEffect(() => {
        if (id) {
            const foundTeacher = dataStore.getTeachers().find(t => t.id === id);
            if (foundTeacher) {
                setTeacher(foundTeacher);
            }
        }
    }, [id]);

    if (!teacher) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <AlertCircle className="w-12 h-12 text-muted-foreground opacity-50" />
                <h2 className="text-2xl font-semibold text-muted-foreground">Teacher Not Found</h2>
                <Button onClick={() => navigate('/teachers')}>Back to Teachers List</Button>
            </div>
        );
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Active': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            case 'On Leave': return <Clock className="w-4 h-4 text-amber-500" />;
            case 'Inactive': return <XCircle className="w-4 h-4 text-red-500" />;
            default: return null;
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'On Leave': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'Inactive': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-slate-50 text-slate-700 border-slate-100';
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <Button variant="ghost" asChild>
                    <Link to="/teachers" className="flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Teachers
                    </Link>
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Edit2 className="w-4 h-4" />
                        Edit Profile
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="lg:col-span-1 h-fit">
                    <CardContent className="pt-8">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-4 border-background shadow-xl scale-110">
                                    {teacher.photo ? (
                                        <img src={teacher.photo} alt={teacher.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-16 h-16 text-primary/40" />
                                    )}
                                </div>
                                <div className={`absolute bottom-0 right-0 p-1.5 rounded-full border-2 border-background shadow-sm ${getStatusClass(teacher.status)}`}>
                                    {getStatusIcon(teacher.status)}
                                </div>
                            </div>

                            <div className="pt-4">
                                <h2 className="text-2xl font-bold">{teacher.name}</h2>
                                <p className="text-primary font-medium">{teacher.designation}</p>
                                <p className="text-xs text-muted-foreground font-mono mt-1">{teacher.id}</p>
                            </div>

                            <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusClass(teacher.status)}`}>
                                {teacher.status}
                            </div>

                            <div className="w-full pt-6 border-t space-y-4 text-sm text-left">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Phone</p>
                                        <p className="font-medium">{teacher.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Email</p>
                                        <p className="font-medium truncate">{teacher.email || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Address</p>
                                        <p className="font-medium leading-relaxed">{teacher.address || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Details Section */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="border-b bg-muted/30">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Award className="w-5 h-5 text-primary" />
                                Professional Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                        <Briefcase className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Qualification</span>
                                    </div>
                                    <p className="font-semibold text-lg">{teacher.qualification || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Experience</span>
                                    </div>
                                    <p className="font-semibold text-lg">{teacher.experience ? `${teacher.experience} Years` : 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Joining Date</span>
                                    </div>
                                    <p className="font-semibold text-lg">{teacher.joiningDate || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                        <CreditCard className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-wider">NID Number</span>
                                    </div>
                                    <p className="font-semibold text-lg font-mono tracking-tight">{teacher.nid || 'N/A'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader className="border-b bg-muted/30 py-3">
                                <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
                                    <BookOpen className="w-4 h-4" />
                                    Subjects Taught
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="flex flex-wrap gap-2">
                                    {teacher.subjects.map(sub => (
                                        <div key={sub} className="px-3 py-1.5 rounded-lg bg-primary/5 text-primary border border-primary/10 text-sm font-medium">
                                            {sub}
                                        </div>
                                    ))}
                                    {teacher.subjects.length === 0 && <p className="text-sm text-muted-foreground italic">No subjects assigned.</p>}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="border-b bg-muted/30 py-3">
                                <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
                                    <User className="w-4 h-4" />
                                    Assigned Classes
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="flex flex-wrap gap-2">
                                    {teacher.assignedClasses.map(cls => (
                                        <div key={cls} className="px-3 py-1.5 rounded-lg bg-violet-50 text-violet-700 border border-violet-100 text-sm font-medium">
                                            {cls}
                                        </div>
                                    ))}
                                    {teacher.assignedClasses.length === 0 && <p className="text-sm text-muted-foreground italic">No classes assigned.</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* New Sections */}
                    <Card>
                        <CardHeader className="border-b bg-muted/30 py-3">
                            <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
                                <GraduationCap className="w-4 h-4" />
                                Academic History
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <ul className="space-y-3">
                                {teacher.academicHistory?.map((item, index) => (
                                    <li key={index} className="flex gap-3">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                        <span className="text-sm font-medium">{item}</span>
                                    </li>
                                ))}
                                {(!teacher.academicHistory || teacher.academicHistory.length === 0) && (
                                    <p className="text-sm text-muted-foreground italic">No academic history records found.</p>
                                )}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="border-b bg-muted/30 py-3">
                            <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
                                <ScrollText className="w-4 h-4" />
                                Certifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="flex flex-wrap gap-2">
                                {teacher.certifications?.map((cert, index) => (
                                    <div key={index} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 text-sm font-medium flex items-center gap-2">
                                        <Award className="w-3 h-3" />
                                        {cert}
                                    </div>
                                ))}
                                {(!teacher.certifications || teacher.certifications.length === 0) && (
                                    <p className="text-sm text-muted-foreground italic">No certifications found.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="border-b bg-muted/30 py-3">
                            <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
                                <History className="w-4 h-4" />
                                Professional Experience
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="space-y-4 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-muted">
                                {teacher.workHistory?.map((work, index) => (
                                    <div key={index} className="pl-6 relative">
                                        <div className="absolute left-0 top-1.5 w-[16px] h-[16px] rounded-full bg-background border-2 border-primary z-10" />
                                        <p className="text-sm font-semibold">{work}</p>
                                    </div>
                                ))}
                                {(!teacher.workHistory || teacher.workHistory.length === 0) && (
                                    <p className="text-sm text-muted-foreground italic ml-0 pl-0 before:hidden">No previous work history records found.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="border-b bg-muted/30 py-3">
                            <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                Daily Schedule
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="bg-muted/20 border rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4 opacity-70">
                                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                    <Calendar className="w-8 h-8 text-muted-foreground/40" />
                                </div>
                                <div>
                                    <p className="font-semibold">Class Schedule Feed</p>
                                    <p className="text-sm text-muted-foreground max-w-xs">Detailed routine and classroom assignments will appear here once configured in the Academic module.</p>
                                </div>
                                <Button variant="outline" size="sm" disabled>Configure Schedule</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

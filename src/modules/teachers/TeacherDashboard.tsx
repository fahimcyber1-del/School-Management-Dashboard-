import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    BookOpen,
    Calendar,
    Bell,
    CheckCircle2,
    Clock,
    Users,
    ArrowUpRight,
    ClipboardList,
    TrendingUp,
    AlertTriangle,
    Plus,
    ChevronDown,
    LogOut,
    Search
} from 'lucide-react';
import { dataStore, Teacher, Announcement, Exam, Student } from '@/services/dataService';
import { format } from 'date-fns';

export default function TeacherDashboard() {
    const navigate = useNavigate();
    const allTeachers = dataStore.getTeachers();
    const [selectedTeacherId, setSelectedTeacherId] = useState(allTeachers[0].id);
    const [currentTeacher, setCurrentTeacher] = useState<Teacher>(allTeachers[0]);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);

    useEffect(() => {
        const teacher = allTeachers.find(t => t.id === selectedTeacherId);
        if (teacher) {
            setCurrentTeacher(teacher);
        }
    }, [selectedTeacherId, allTeachers]);

    const assignedClasses = currentTeacher.assignedClasses;
    const announcements = dataStore.getAnnouncements().slice(0, 4);
    const upcomingExams = dataStore.getExams().filter(e =>
        (e.status === 'Upcoming' || e.status === 'Ongoing') &&
        assignedClasses.includes(e.class)
    ).slice(0, 4);

    // Calculate dynamic stats
    const totalStudentsInClasses = assignedClasses.length * 40; // Simplified estimation
    const attendancePercentage = 94 + (parseInt(currentTeacher.id.slice(-1)) % 5); // Just to make it vary per teacher

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'text-red-600 bg-red-50 border-red-100';
            case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100';
            case 'Low': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            default: return 'text-slate-600 bg-slate-50 border-slate-100';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header with Teacher Selector */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20 shrink-0">
                        {currentTeacher.photo ? (
                            <img src={currentTeacher.photo} alt={currentTeacher.name} className="w-full h-full object-cover" />
                        ) : (
                            <Users className="w-8 h-8 text-primary" />
                        )}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Teacher Dashboard</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Portal for:</span>
                            <div className="relative">
                                <button
                                    onClick={() => setIsSelectorOpen(!isSelectorOpen)}
                                    className="flex items-center gap-2 text-primary font-bold hover:underline"
                                >
                                    {currentTeacher.name}
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                                {isSelectorOpen && (
                                    <div className="absolute left-0 mt-2 w-64 bg-white border rounded-xl shadow-xl z-50 p-2 max-h-80 overflow-y-auto">
                                        <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b mb-1">Switch Teacher Profile</div>
                                        {allTeachers.map(t => (
                                            <button
                                                key={t.id}
                                                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-3 ${selectedTeacherId === t.id ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-muted font-medium'}`}
                                                onClick={() => {
                                                    setSelectedTeacherId(t.id);
                                                    setIsSelectorOpen(false);
                                                }}
                                            >
                                                <div className="w-6 h-6 rounded-full bg-muted shrink-0 overflow-hidden border">
                                                    {t.photo && <img src={t.photo} className="w-full h-full object-cover" />}
                                                </div>
                                                {t.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                    <Button variant="outline" className="gap-2 flex-1 lg:flex-none border-primary/20 text-primary hover:bg-primary/5 shadow-sm" onClick={() => navigate('/attendance')}>
                        <Calendar className="w-4 h-4" />
                        Record Attendance
                    </Button>
                    <Button className="gap-2 flex-1 lg:flex-none shadow-lg shadow-primary/20" onClick={() => navigate('/exams')}>
                        <ClipboardList className="w-4 h-4" />
                        Manage Exams
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-indigo-400 text-white border-none shadow-xl overflow-hidden relative">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest">Next Period</p>
                                <h3 className="text-2xl font-bold">{assignedClasses[0] || 'No Classes'}</h3>
                                <p className="text-indigo-100 text-xs flex items-center gap-1.5 font-medium bg-white/10 w-fit px-2 py-1 rounded-full backdrop-blur-sm">
                                    <Clock className="w-3 h-3" /> 10:30 AM (Room 204)
                                </p>
                            </div>
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                                <BookOpen className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                    <div className="absolute -bottom-4 -right-4 opacity-10">
                        <BookOpen className="w-32 h-32" />
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-400 text-white border-none shadow-xl overflow-hidden relative">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest">Avg Attendance</p>
                                <h3 className="text-3xl font-bold">{attendancePercentage}%</h3>
                                <p className="text-emerald-100 text-xs flex items-center gap-1.5 font-medium bg-white/10 w-fit px-2 py-1 rounded-full backdrop-blur-sm">
                                    <TrendingUp className="w-3 h-3" /> Normal range
                                </p>
                            </div>
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                                <Users className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                    <div className="absolute -bottom-4 -right-4 opacity-10">
                        <Users className="w-32 h-32" />
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-amber-600 via-orange-500 to-orange-400 text-white border-none shadow-xl overflow-hidden relative">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <p className="text-amber-100 text-xs font-bold uppercase tracking-widest">Students Under Care</p>
                                <h3 className="text-3xl font-bold">{totalStudentsInClasses}</h3>
                                <p className="text-amber-100 text-xs flex items-center gap-1.5 font-medium bg-white/10 w-fit px-2 py-1 rounded-full backdrop-blur-sm">
                                    <Users className="w-3 shadow h-3" /> All Sections
                                </p>
                            </div>
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                                <Users className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                    <div className="absolute -bottom-4 -right-4 opacity-10">
                        <Users className="w-32 h-32" />
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-rose-600 via-rose-500 to-rose-400 text-white border-none shadow-xl overflow-hidden relative">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <p className="text-rose-100 text-xs font-bold uppercase tracking-widest">Active Assessments</p>
                                <h3 className="text-3xl font-bold">{upcomingExams.length}</h3>
                                <p className="text-rose-100 text-xs flex items-center gap-1.5 font-medium bg-white/10 w-fit px-2 py-1 rounded-full backdrop-blur-sm">
                                    <Calendar className="w-3 h-3" /> For your classes
                                </p>
                            </div>
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                    <div className="absolute -bottom-4 -right-4 opacity-10">
                        <CheckCircle2 className="w-32 h-32" />
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Dashboard Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Assigned Classes */}
                    <Card className="border shadow-lg overflow-hidden bg-white rounded-2xl">
                        <CardHeader className="bg-muted/10 border-b py-5">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-xl flex items-center gap-2 font-bold">
                                    <div className="p-1.5 bg-indigo-100 rounded-lg">
                                        <BookOpen className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    Assigned Class Schedule
                                </CardTitle>
                                <Link to="/academic" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                                    Full Curriculum <ArrowUpRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-y md:divide-y-0 overflow-hidden">
                                {assignedClasses.map((cls, idx) => (
                                    <div key={cls} className="p-6 hover:bg-muted/20 transition-all group">
                                        <div className="flex items-center justify-between mb-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
                                                    {cls.split(' ')[1]}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-lg leading-tight">{cls}</h4>
                                                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-0.5">Section A • Morning</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center justify-end gap-1.5 text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                                    <Users className="w-3 h-3" />
                                                    42
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1 h-9 text-xs font-bold border-muted-foreground/10 hover:border-primary/30 hover:bg-primary/5 transition-all"
                                                onClick={() => navigate('/exams')}
                                            >
                                                Log Marks
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1 h-9 text-xs font-bold bg-primary/5 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all"
                                                onClick={() => navigate('/attendance')}
                                            >
                                                Attendance
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {assignedClasses.length === 0 && (
                                    <div className="p-12 text-center col-span-2 text-muted-foreground italic flex flex-col items-center gap-3">
                                        <AlertTriangle className="w-10 h-10 opacity-20" />
                                        <p className="font-medium">No classes assigned to you currently.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upcoming Exams for Teacher's Classes */}
                    <Card className="border shadow-lg overflow-hidden bg-white rounded-2xl">
                        <CardHeader className="bg-muted/10 border-b py-5">
                            <CardTitle className="text-xl flex items-center gap-2 font-bold">
                                <div className="p-1.5 bg-rose-100 rounded-lg">
                                    <ClipboardList className="w-5 h-5 text-rose-600" />
                                </div>
                                Exams & Assessments
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 space-y-4">
                            {upcomingExams.map(exam => (
                                <div key={exam.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-muted hover:border-rose-200 hover:bg-rose-50/30 transition-all gap-4 group">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-rose-200 group-hover:rotate-12 transition-transform">
                                            <div className="text-center">
                                                <p className="text-[9px] font-black leading-none uppercase">{format(new Date(exam.date), 'MMM')}</p>
                                                <p className="text-lg font-black leading-none">{format(new Date(exam.date), 'dd')}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-base">{exam.name}</h4>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-xs text-muted-foreground font-medium">{exam.class}</span>
                                                <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                                <span className="text-xs text-muted-foreground font-medium">Main Hall</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between sm:justify-end gap-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${exam.status === 'Ongoing' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 animate-pulse' : 'bg-muted/50 text-muted-foreground border-transparent'
                                            }`}>
                                            {exam.status}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-10 w-10 p-0 rounded-xl hover:bg-rose-100 hover:text-rose-600 border border-transparent hover:border-rose-200 transition-all outline-none"
                                            onClick={() => navigate('/exams')}
                                        >
                                            <ArrowUpRight className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {upcomingExams.length === 0 && (
                                <div className="py-12 text-center text-muted-foreground flex flex-col items-center gap-2">
                                    <ClipboardList className="w-8 h-8 opacity-20" />
                                    <p className="font-medium">No upcoming exams assigned for your classes.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar area: Announcements */}
                <div className="space-y-6">
                    <Card className="border shadow-lg overflow-hidden bg-white rounded-2xl">
                        <CardHeader className="bg-muted/10 border-b py-5">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-xl flex items-center gap-2 font-bold">
                                    <div className="p-1.5 bg-amber-100 rounded-lg">
                                        <Bell className="w-5 h-5 text-amber-600" />
                                    </div>
                                    Notice Board
                                </CardTitle>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-amber-100 hover:text-amber-600">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-5 space-y-7 pt-7">
                            {announcements.map((item, idx) => (
                                <div key={item.id} className="relative pl-7 space-y-2 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-[2px] before:bg-muted last:before:hidden">
                                    <div className="absolute left-[-4px] top-2 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-white shadow-sm" />
                                    <div className="flex items-center justify-between gap-2">
                                        <span className={`inline-block px-2 py-0.5 text-[9px] font-black rounded-lg border uppercase tracking-widest shadow-sm ${getPriorityColor(item.priority)}`}>
                                            {item.priority} Priority
                                        </span>
                                        <span className="text-[10px] text-muted-foreground font-bold">{format(new Date(item.date), 'MMM dd')}</span>
                                    </div>
                                    <h5 className="font-black text-sm text-foreground leading-tight">{item.title}</h5>
                                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                                        {item.content}
                                    </p>
                                </div>
                            ))}
                            <Button className="w-full text-[10px] font-black py-6 bg-primary/5 text-primary hover:bg-primary hover:text-white border-2 border-dashed border-primary/20 hover:border-primary transition-all uppercase tracking-widest" variant="outline">
                                View Full Archive
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border shadow-lg overflow-hidden bg-white relative rounded-2xl group">
                        <CardHeader className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-6">
                            <CardTitle className="text-lg flex items-center gap-2 font-bold">
                                <TrendingUp className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                Session Progress
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-3">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    <span>Syllabus Covered</span>
                                    <span className="text-violet-600">85%</span>
                                </div>
                                <div className="h-2.5 bg-muted rounded-full overflow-hidden p-0.5">
                                    <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full shadow-lg" style={{ width: '85%' }} />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    <span>Grading Queue</span>
                                    <span className="text-amber-600">40%</span>
                                </div>
                                <div className="h-2.5 bg-muted rounded-full overflow-hidden p-0.5">
                                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full shadow-lg" style={{ width: '40%' }} />
                                </div>
                            </div>
                            <div className="pt-4 border-t border-dashed">
                                <p className="text-xs text-muted-foreground font-bold text-center flex items-center justify-center gap-2 leading-tight">
                                    <Clock className="w-3.5 h-3.5 text-primary" />
                                    Next Grade Sync: <span className="text-foreground">Today at 5:00 PM</span>
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Portal Switch */}
                    <Card className="border border-dashed border-muted-foreground/30 bg-muted/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white border shadow-sm flex items-center justify-center">
                            <LogOut className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="font-bold text-sm">Switch Workspace</p>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Exit Teacher Portal for Admin View</p>
                        </div>
                        <Button variant="ghost" size="sm" className="font-black text-[10px] uppercase tracking-widest text-primary hover:bg-primary/10" onClick={() => navigate('/')}>
                            Return to Dashboard
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}

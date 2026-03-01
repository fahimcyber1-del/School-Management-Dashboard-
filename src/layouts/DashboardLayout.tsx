import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  FileText,
  CreditCard,
  Settings,
  Menu,
  Bell,
  Search,
  ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toaster } from 'sonner';

const sidebarLinks = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Teacher Portal', href: '/teacher-dashboard', icon: ClipboardList },
  { name: 'Academic', href: '/academic', icon: GraduationCap },
  { name: 'Teachers', href: '/teachers', icon: Users },
  { name: 'Students', href: '/students', icon: Users },
  { name: 'Attendance', href: '/attendance', icon: CalendarCheck },
  { name: 'Exams & Results', href: '/exams', icon: FileText },
  { name: 'Fees & Accounts', href: '/fees', icon: CreditCard },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className={cn(
        "bg-card border-r flex-shrink-0 transition-all duration-300 z-20 flex flex-col",
        sidebarOpen ? "w-64 translate-x-0" : "-translate-x-full hidden md:flex md:w-20 md:translate-x-0"
      )}>
        <div className="h-16 flex items-center justify-center border-b px-4">
          <h1 className={cn("font-bold text-xl text-primary truncate transition-all", !sidebarOpen && "md:hidden")}>
            BD School ERP
          </h1>
          {!sidebarOpen && <span className="hidden md:block font-bold text-xl text-primary">ERP</span>}
        </div>
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground hover:text-foreground",
                  !sidebarOpen && "md:justify-center"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className={cn(!sidebarOpen && "md:hidden")}>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-card border-b flex items-center justify-between px-4 lg:px-8 z-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="w-5 h-5" />
            </Button>
            <div className="relative hidden sm:block w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-9 bg-muted/50" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full"></span>
            </Button>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
              SA
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <Outlet />
        </main>
        <Toaster position="top-right" />
      </div>
    </div>
  );
}

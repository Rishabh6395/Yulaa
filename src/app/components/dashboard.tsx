import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Home, FileText, ShoppingBag, ClipboardCheck, BookOpen, Bus, DollarSign, GraduationCap, LogOut, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { HomeTab } from './tabs/home-tab';
import { AdmissionsTab } from './tabs/admissions-tab';
import { AccessoriesTab } from './tabs/accessories-tab';
import { AttendanceTab } from './tabs/attendance-tab';
import { HomeworkTab } from './tabs/homework-tab';
import { TransportTab } from './tabs/transport-tab';
import { FeesTab } from './tabs/fees-tab';
import { ExamsTab } from './tabs/exams-tab';
import { toast } from 'sonner';

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<any>(null);
  const [showMobileNav, setShowMobileNav] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    onLogout();
  };

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, component: HomeTab },
    { id: 'admissions', label: 'Admissions', icon: FileText, component: AdmissionsTab },
    { id: 'accessories', label: 'Shop', icon: ShoppingBag, component: AccessoriesTab },
    { id: 'attendance', label: 'Attendance', icon: ClipboardCheck, component: AttendanceTab },
    { id: 'homework', label: 'Homework', icon: BookOpen, component: HomeworkTab },
    { id: 'transport', label: 'Transport', icon: Bus, component: TransportTab },
    { id: 'fees', label: 'Fees', icon: DollarSign, component: FeesTab },
    { id: 'exams', label: 'Exams', icon: GraduationCap, component: ExamsTab },
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || HomeTab;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setShowMobileNav(!showMobileNav)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900">School Portal</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-sm text-gray-600">
            {user?.user_metadata?.name || user?.email}
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 pb-20 md:pb-4">
        <div className="max-w-7xl mx-auto p-4">
          <ActiveComponent user={user} />
        </div>
      </div>

      {/* Bottom Navigation - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 grid grid-cols-4 gap-1 z-40">
        {tabs.slice(0, 4).map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Mobile Drawer for More Tabs */}
      {showMobileNav && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setShowMobileNav(false)}>
          <div className="bg-white w-64 h-full p-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Navigation</h2>
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setShowMobileNav(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Navigation - Tabs */}
      <div className="hidden md:block border-b border-gray-200 bg-white sticky top-[57px] z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

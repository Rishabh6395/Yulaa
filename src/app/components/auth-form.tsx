import { useState } from 'react';
import { supabase, API_BASE_URL } from '../lib/supabase';
import { publicAnonKey } from '/utils/supabase/info';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';

interface AuthFormProps {
  onAuthSuccess: () => void;
}

export function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showFirstTimeModal, setShowFirstTimeModal] = useState(false);
  const [isNewStudent, setIsNewStudent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phoneNumber: '',
    studentId: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      toast.success('Login successful!');
      onAuthSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          studentId: formData.studentId || `STU${Date.now()}`,
          role: 'student',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      toast.success('Account created! Please log in.');
      setIsLogin(true);
      setShowFirstTimeModal(false);
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFirstTimeSignup = () => {
    setIsLogin(false);
    setShowFirstTimeModal(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">School Portal</h1>
          <p className="text-gray-600">Manage your academic journey</p>
        </div>

        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@school.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleFirstTimeSignup}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                First time here? Sign up
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="student@school.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                required
              />
            </div>

            {!isNewStudent && (
              <div>
                <Label htmlFor="studentId">Student ID (if existing)</Label>
                <Input
                  id="studentId"
                  type="text"
                  placeholder="STU12345"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                />
              </div>
            )}

            <div>
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Already have an account? Login
              </button>
            </div>
          </form>
        )}
      </div>

      <Dialog open={showFirstTimeModal} onOpenChange={setShowFirstTimeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome to School Portal!</DialogTitle>
            <DialogDescription>
              Are you a new student applying for admission, or an existing student?
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button
              onClick={() => {
                setIsNewStudent(true);
                setShowFirstTimeModal(false);
              }}
              variant="outline"
              className="h-24 flex flex-col gap-2"
            >
              <span className="text-2xl">📝</span>
              <span>New Student</span>
              <span className="text-xs text-gray-500">Apply for admission</span>
            </Button>

            <Button
              onClick={() => {
                setIsNewStudent(false);
                setShowFirstTimeModal(false);
              }}
              variant="outline"
              className="h-24 flex flex-col gap-2"
            >
              <span className="text-2xl">🎓</span>
              <span>Existing Student</span>
              <span className="text-xs text-gray-500">Use student ID</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

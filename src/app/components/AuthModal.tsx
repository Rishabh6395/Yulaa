import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { UserPlus, LogIn } from 'lucide-react';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ open, onOpenChange }) => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'choice' | 'signin' | 'signup'>('choice');
  const [loading, setLoading] = useState(false);
  
  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });

  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'student' as 'student' | 'parent' | 'teacher' | 'admin',
    phone: '',
    studentId: '',
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(signInData.email, signInData.password);
      toast.success('Successfully signed in!');
      onOpenChange(false);
      setMode('choice');
    } catch (err: any) {
      toast.error(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(signUpData);
      toast.success('Account created successfully!');
      onOpenChange(false);
      setMode('choice');
    } catch (err: any) {
      toast.error(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setMode('choice');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-md">
        {mode === 'choice' && (
          <>
            <DialogHeader>
              <DialogTitle>Welcome to EduManage</DialogTitle>
              <DialogDescription>
                Please choose an option to continue
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Button
                className="w-full h-auto py-6 flex-col gap-2"
                onClick={() => setMode('signup')}
              >
                <UserPlus className="w-6 h-6" />
                <div>
                  <div className="font-semibold">New Student</div>
                  <div className="text-xs opacity-90">Create a new account and apply for admission</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full h-auto py-6 flex-col gap-2"
                onClick={() => setMode('signin')}
              >
                <LogIn className="w-6 h-6" />
                <div>
                  <div className="font-semibold">Existing Student</div>
                  <div className="text-xs opacity-70">Sign in with your student ID</div>
                </div>
              </Button>
            </div>
          </>
        )}

        {mode === 'signin' && (
          <>
            <DialogHeader>
              <DialogTitle>Sign In</DialogTitle>
              <DialogDescription>
                Enter your credentials to access your account
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="student@school.edu"
                  value={signInData.email}
                  onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  value={signInData.password}
                  onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setMode('choice')} className="flex-1">
                  Back
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </div>
            </form>
          </>
        )}

        {mode === 'signup' && (
          <>
            <DialogHeader>
              <DialogTitle>Create Account</DialogTitle>
              <DialogDescription>
                Fill in your details to get started
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSignUp} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <Label htmlFor="signup-name">Full Name *</Label>
                <Input
                  id="signup-name"
                  placeholder="John Doe"
                  value={signUpData.name}
                  onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="signup-email">Email *</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="student@school.edu"
                  value={signUpData.email}
                  onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="signup-password">Password *</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
              <div>
                <Label htmlFor="signup-phone">Phone Number</Label>
                <Input
                  id="signup-phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={signUpData.phone}
                  onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="signup-role">Role *</Label>
                <Select
                  value={signUpData.role}
                  onValueChange={(value: any) => setSignUpData({ ...signUpData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {signUpData.role === 'student' && (
                <div>
                  <Label htmlFor="signup-studentid">Student ID (if existing)</Label>
                  <Input
                    id="signup-studentid"
                    placeholder="STU12345"
                    value={signUpData.studentId}
                    onChange={(e) => setSignUpData({ ...signUpData, studentId: e.target.value })}
                  />
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setMode('choice')} className="flex-1">
                  Back
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Account'}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

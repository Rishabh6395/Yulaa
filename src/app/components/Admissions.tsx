import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { toast } from 'sonner';
import { FileText, CheckCircle, Clock, XCircle, ChevronRight, ChevronLeft } from 'lucide-react';

export const Admissions: React.FC = () => {
  const { user, accessToken } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    // Personal Details
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    
    // Guardian Info
    guardianName: '',
    guardianEmail: '',
    guardianPhone: '',
    guardianRelation: '',
    address: '',
    
    // Academic Info
    previousSchool: '',
    previousGrade: '',
    appliedGrade: '',
    
    // Additional
    medicalConditions: '',
    specialNeeds: '',
  });

  const isAdmin = user?.role === 'admin' || user?.role === 'teacher';

  useEffect(() => {
    if (isAdmin) {
      fetchApplications();
    }
  }, [isAdmin]);

  const fetchApplications = async () => {
    if (!accessToken) return;
    try {
      const response = await fetch(`${API_BASE_URL}/admissions?status=pending`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setApplications(data.admissions);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      toast.error('Please sign in to submit application');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Application submitted successfully!');
        setFormData({
          firstName: '', lastName: '', dateOfBirth: '', gender: '', bloodGroup: '',
          guardianName: '', guardianEmail: '', guardianPhone: '', guardianRelation: '', address: '',
          previousSchool: '', previousGrade: '', appliedGrade: '',
          medicalConditions: '', specialNeeds: '',
        });
        setStep(1);
      } else {
        toast.error(data.error || 'Failed to submit application');
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      toast.error('Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (admissionId: string, status: 'approved' | 'rejected') => {
    if (!accessToken) return;
    try {
      const response = await fetch(`${API_BASE_URL}/admissions/${admissionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`Application ${status}!`);
        fetchApplications();
      } else {
        toast.error(data.error || 'Failed to update application');
      }
    } catch (err) {
      console.error('Error updating application:', err);
      toast.error('Failed to update application');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Input
                  id="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                />
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Guardian Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guardianName">Guardian Name *</Label>
                <Input
                  id="guardianName"
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="guardianRelation">Relation *</Label>
                <Input
                  id="guardianRelation"
                  value={formData.guardianRelation}
                  onChange={(e) => setFormData({ ...formData, guardianRelation: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="guardianEmail">Email *</Label>
                <Input
                  id="guardianEmail"
                  type="email"
                  value={formData.guardianEmail}
                  onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="guardianPhone">Phone *</Label>
                <Input
                  id="guardianPhone"
                  type="tel"
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  required
                />
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="previousSchool">Previous School</Label>
                <Input
                  id="previousSchool"
                  value={formData.previousSchool}
                  onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="previousGrade">Previous Grade</Label>
                <Input
                  id="previousGrade"
                  value={formData.previousGrade}
                  onChange={(e) => setFormData({ ...formData, previousGrade: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="appliedGrade">Applied For Grade *</Label>
                <Input
                  id="appliedGrade"
                  value={formData.appliedGrade}
                  onChange={(e) => setFormData({ ...formData, appliedGrade: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="medicalConditions">Medical Conditions</Label>
                <Input
                  id="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="specialNeeds">Special Needs</Label>
                <Textarea
                  id="specialNeeds"
                  value={formData.specialNeeds}
                  onChange={(e) => setFormData({ ...formData, specialNeeds: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          </div>
        );
    }
  };

  if (isAdmin) {
    return (
      <div className="md:ml-64 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Admission Applications</h1>
          
          <div className="space-y-4">
            {applications.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  No pending applications
                </CardContent>
              </Card>
            ) : (
              applications.map((app) => (
                <Card key={app.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>
                          {app.firstName} {app.lastName}
                        </CardTitle>
                        <CardDescription>
                          Applied for Grade {app.appliedGrade}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-600">Guardian:</span> {app.guardianName}
                      </div>
                      <div>
                        <span className="text-gray-600">Contact:</span> {app.guardianPhone}
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span> {app.guardianEmail}
                      </div>
                      <div>
                        <span className="text-gray-600">DOB:</span> {app.dateOfBirth}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApproval(app.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleApproval(app.id, 'rejected')}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:ml-64 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">New Admission Application</h1>
          <p className="text-gray-600">Complete the form below to apply for admission</p>
        </div>

        <Card>
          <CardHeader>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Step {step} of 3</span>
                <span className="text-sm text-gray-600">{Math.round((step / 3) * 100)}%</span>
              </div>
              <Progress value={(step / 3) * 100} />
            </div>
            <div className="flex gap-2">
              <div className={`flex-1 text-center pb-2 border-b-2 ${step >= 1 ? 'border-blue-600 text-blue-600' : 'border-gray-200 text-gray-400'}`}>
                Personal
              </div>
              <div className={`flex-1 text-center pb-2 border-b-2 ${step >= 2 ? 'border-blue-600 text-blue-600' : 'border-gray-200 text-gray-400'}`}>
                Guardian
              </div>
              <div className={`flex-1 text-center pb-2 border-b-2 ${step >= 3 ? 'border-blue-600 text-blue-600' : 'border-gray-200 text-gray-400'}`}>
                Academic
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {renderStep()}
              
              <div className="flex gap-2 mt-6">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="ml-auto"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" className="ml-auto" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Application'}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

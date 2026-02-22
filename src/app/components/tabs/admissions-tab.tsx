import { useState } from 'react';
import { API_BASE_URL, supabase } from '../../lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { FileText, CheckCircle, Clock, XCircle } from 'lucide-react';

export function AdmissionsTab({ user }: { user: any }) {
  const [step, setStep] = useState(1);
  const [applicationStatus, setApplicationStatus] = useState<any>(null);
  const [formData, setFormData] = useState({
    // Personal Details
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    // Guardian Info
    guardianName: '',
    guardianEmail: '',
    guardianPhone: '',
    guardianRelation: '',
    // Academic Info
    previousSchool: '',
    lastGrade: '',
    // Address
    address: '',
    city: '',
    state: '',
    zipCode: '',
    // Additional
    medicalConditions: '',
    emergencyContact: '',
  });

  const handleSubmitApplication = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please log in to submit an application');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/admissions/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      toast.success('Application submitted successfully!');
      setApplicationStatus({
        id: data.applicationId,
        status: 'pending',
        submittedAt: new Date().toISOString(),
      });
      setStep(1);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <Clock className="h-5 w-5 text-orange-600" />;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>First Name</Label>
          <Input
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder="John"
          />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder="Doe"
          />
        </div>
        <div>
          <Label>Date of Birth</Label>
          <Input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
          />
        </div>
        <div>
          <Label>Gender</Label>
          <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={() => setStep(2)}>Next</Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Guardian Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Guardian Name</Label>
          <Input
            value={formData.guardianName}
            onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <Label>Guardian Email</Label>
          <Input
            type="email"
            value={formData.guardianEmail}
            onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
            placeholder="guardian@email.com"
          />
        </div>
        <div>
          <Label>Guardian Phone</Label>
          <Input
            type="tel"
            value={formData.guardianPhone}
            onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
            placeholder="+1234567890"
          />
        </div>
        <div>
          <Label>Relationship</Label>
          <Select value={formData.guardianRelation} onValueChange={(value) => setFormData({ ...formData, guardianRelation: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mother">Mother</SelectItem>
              <SelectItem value="father">Father</SelectItem>
              <SelectItem value="guardian">Guardian</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
        <Button onClick={() => setStep(3)}>Next</Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Academic & Additional Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Previous School</Label>
          <Input
            value={formData.previousSchool}
            onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
            placeholder="Previous School Name"
          />
        </div>
        <div>
          <Label>Last Grade Completed</Label>
          <Input
            value={formData.lastGrade}
            onChange={(e) => setFormData({ ...formData, lastGrade: e.target.value })}
            placeholder="Grade 9"
          />
        </div>
        <div className="md:col-span-2">
          <Label>Address</Label>
          <Input
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="123 Main St"
          />
        </div>
        <div>
          <Label>City</Label>
          <Input
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="New York"
          />
        </div>
        <div>
          <Label>State</Label>
          <Input
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            placeholder="NY"
          />
        </div>
        <div className="md:col-span-2">
          <Label>Medical Conditions (if any)</Label>
          <Textarea
            value={formData.medicalConditions}
            onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
            placeholder="Please list any medical conditions or allergies"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
        <Button onClick={handleSubmitApplication}>Submit Application</Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Admissions</h2>
      </div>

      {applicationStatus ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              {getStatusIcon(applicationStatus.status)}
              <div>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>Application ID: {applicationStatus.id}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Status:</strong>{' '}
                <span className={`capitalize ${
                  applicationStatus.status === 'approved' ? 'text-green-600' :
                  applicationStatus.status === 'rejected' ? 'text-red-600' :
                  'text-orange-600'
                }`}>
                  {applicationStatus.status}
                </span>
              </p>
              <p>
                <strong>Submitted:</strong>{' '}
                {new Date(applicationStatus.submittedAt).toLocaleDateString()}
              </p>
              {applicationStatus.reviewNotes && (
                <p>
                  <strong>Notes:</strong> {applicationStatus.reviewNotes}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setApplicationStatus(null)}
            >
              Submit New Application
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                New Admission Application
              </div>
            </CardTitle>
            <CardDescription>Step {step} of 3</CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

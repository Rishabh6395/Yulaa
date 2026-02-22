import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import { ClipboardCheck, Calendar, CheckCircle, XCircle, QrCode } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

export const Attendance: React.FC = () => {
  const { user, accessToken } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [manualEntry, setManualEntry] = useState({
    studentId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present' as 'present' | 'absent' | 'late',
  });
  const [showQRCode, setShowQRCode] = useState(false);

  const isTeacherOrAdmin = user?.role === 'admin' || user?.role === 'teacher';
  const qrCodeData = JSON.stringify({
    studentId: user?.studentId || user?.id,
    timestamp: Date.now(),
  });

  useEffect(() => {
    if (user) {
      fetchAttendance();
    }
  }, [user]);

  const fetchAttendance = async () => {
    if (!user || !accessToken) return;
    
    const studentId = user.studentId || user.id;
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setAttendanceRecords(data.records);
      }
    } catch (err) {
      console.error('Error fetching attendance:', err);
    }
  };

  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      toast.error('Please sign in');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...manualEntry,
          method: 'manual',
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Attendance marked successfully!');
        fetchAttendance();
        setManualEntry({
          studentId: '',
          date: new Date().toISOString().split('T')[0],
          status: 'present',
        });
      } else {
        toast.error(data.error || 'Failed to mark attendance');
      }
    } catch (err) {
      console.error('Error marking attendance:', err);
      toast.error('Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = async () => {
    if (!accessToken) {
      toast.error('Please sign in');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          studentId: user?.studentId || user?.id,
          date: new Date().toISOString().split('T')[0],
          status: 'present',
          method: 'qr_code',
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Attendance marked via QR code!');
        fetchAttendance();
        setShowQRCode(false);
      } else {
        toast.error(data.error || 'Failed to mark attendance');
      }
    } catch (err) {
      console.error('Error marking attendance:', err);
      toast.error('Failed to mark attendance');
    }
  };

  const getAttendanceStats = () => {
    const total = attendanceRecords.length;
    const present = attendanceRecords.filter(r => r.status === 'present').length;
    const absent = attendanceRecords.filter(r => r.status === 'absent').length;
    const late = attendanceRecords.filter(r => r.status === 'late').length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, late, percentage };
  };

  const stats = getAttendanceStats();

  return (
    <div className="md:ml-64 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Attendance</h1>
          <p className="text-gray-600">Track and manage attendance records</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Attendance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.percentage}%</div>
              <p className="text-xs text-gray-500 mt-1">Overall performance</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Present Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.present}</div>
              <p className="text-xs text-gray-500 mt-1">Total present</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Absent Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.absent}</div>
              <p className="text-xs text-gray-500 mt-1">Total absent</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Late Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.late}</div>
              <p className="text-xs text-gray-500 mt-1">Total late</p>
            </CardContent>
          </Card>
        </div>

        {/* QR Code Section for Students */}
        {!isTeacherOrAdmin && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quick Check-In</CardTitle>
              <CardDescription>
                Show this QR code to mark your attendance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
                  <DialogTrigger asChild>
                    <Button>
                      <QrCode className="w-4 h-4 mr-2" />
                      Show QR Code
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Your Attendance QR Code</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-4 py-4">
                      <QRCodeSVG value={qrCodeData} size={256} />
                      <p className="text-sm text-gray-600 text-center">
                        Show this code to your teacher to mark attendance
                      </p>
                      <Button onClick={handleQRScan}>
                        Mark Attendance Now
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Manual Entry Form for Teachers */}
        {isTeacherOrAdmin && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Mark Attendance</CardTitle>
              <CardDescription>
                Manually record student attendance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleMarkAttendance} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input
                      id="studentId"
                      value={manualEntry.studentId}
                      onChange={(e) => setManualEntry({ ...manualEntry, studentId: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={manualEntry.date}
                      onChange={(e) => setManualEntry({ ...manualEntry, date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={manualEntry.status}
                      onChange={(e) => setManualEntry({ ...manualEntry, status: e.target.value as any })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                    </select>
                  </div>
                </div>
                <Button type="submit" disabled={loading}>
                  <ClipboardCheck className="w-4 h-4 mr-2" />
                  {loading ? 'Marking...' : 'Mark Attendance'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Attendance History */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
            <CardDescription>
              View past attendance records
            </CardDescription>
          </CardHeader>
          <CardContent>
            {attendanceRecords.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No attendance records found
              </div>
            ) : (
              <div className="space-y-2">
                {attendanceRecords
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 10)
                  .map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="font-medium">
                            {new Date(record.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </div>
                          <div className="text-sm text-gray-500 capitalize">
                            Method: {record.method || 'Manual'}
                          </div>
                        </div>
                      </div>
                      <Badge
                        className={
                          record.status === 'present'
                            ? 'bg-green-100 text-green-800'
                            : record.status === 'absent'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-orange-100 text-orange-800'
                        }
                      >
                        {record.status === 'present' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {record.status === 'absent' && <XCircle className="w-3 h-3 mr-1" />}
                        {record.status.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

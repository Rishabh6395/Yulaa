import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { GraduationCap, TrendingUp, TrendingDown, Download, Plus, BarChart3 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ExamResult {
  id: string;
  studentId: string;
  examName: string;
  subject: string;
  score: number;
  maxScore: number;
  period: 'monthly' | 'quarterly' | 'final';
  date: string;
}

const sampleResults: ExamResult[] = [
  { id: '1', studentId: 'STU001', examName: 'Mid-term Exam', subject: 'Mathematics', score: 85, maxScore: 100, period: 'monthly', date: '2026-02-15' },
  { id: '2', studentId: 'STU001', examName: 'Mid-term Exam', subject: 'Science', score: 92, maxScore: 100, period: 'monthly', date: '2026-02-15' },
  { id: '3', studentId: 'STU001', examName: 'Mid-term Exam', subject: 'English', score: 88, maxScore: 100, period: 'monthly', date: '2026-02-15' },
  { id: '4', studentId: 'STU001', examName: 'Mid-term Exam', subject: 'History', score: 78, maxScore: 100, period: 'monthly', date: '2026-02-15' },
  { id: '5', studentId: 'STU001', examName: 'Monthly Test', subject: 'Mathematics', score: 75, maxScore: 100, period: 'monthly', date: '2026-01-20' },
  { id: '6', studentId: 'STU001', examName: 'Monthly Test', subject: 'Science', score: 88, maxScore: 100, period: 'monthly', date: '2026-01-20' },
  { id: '7', studentId: 'STU001', examName: 'Q1 Exam', subject: 'Mathematics', score: 90, maxScore: 100, period: 'quarterly', date: '2025-12-15' },
  { id: '8', studentId: 'STU001', examName: 'Q1 Exam', subject: 'Science', score: 95, maxScore: 100, period: 'quarterly', date: '2025-12-15' },
];

export const Exams: React.FC = () => {
  const { user, accessToken } = useAuth();
  const [results, setResults] = useState<ExamResult[]>(sampleResults);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [newResult, setNewResult] = useState({
    studentId: '',
    examName: '',
    subject: '',
    score: '',
    maxScore: '100',
    period: 'monthly' as 'monthly' | 'quarterly' | 'final',
    date: new Date().toISOString().split('T')[0],
  });

  const isTeacherOrAdmin = user?.role === 'admin' || user?.role === 'teacher';

  useEffect(() => {
    if (user) {
      fetchResults();
    }
  }, [user]);

  const fetchResults = async () => {
    if (!user || !accessToken) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/exams/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (data.success && data.exams.length > 0) {
        setResults(data.exams);
      }
    } catch (err) {
      console.error('Error fetching exam results:', err);
    }
  };

  const handleUploadResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      toast.error('Please sign in');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/exams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...newResult,
          score: parseFloat(newResult.score),
          maxScore: parseFloat(newResult.maxScore),
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Exam result uploaded!');
        fetchResults();
        setUploadDialogOpen(false);
        setNewResult({
          studentId: '',
          examName: '',
          subject: '',
          score: '',
          maxScore: '100',
          period: 'monthly',
          date: new Date().toISOString().split('T')[0],
        });
      } else {
        toast.error(data.error || 'Failed to upload result');
      }
    } catch (err) {
      console.error('Error uploading result:', err);
      toast.error('Failed to upload result');
    }
  };

  const getAverageScore = () => {
    if (results.length === 0) return 0;
    const total = results.reduce((sum, r) => sum + (r.score / r.maxScore) * 100, 0);
    return (total / results.length).toFixed(1);
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-600' };
    if (percentage >= 70) return { grade: 'B', color: 'text-blue-600' };
    if (percentage >= 60) return { grade: 'C', color: 'text-yellow-600' };
    return { grade: 'D', color: 'text-red-600' };
  };

  const getSubjectPerformance = () => {
    const subjects = new Map<string, { total: number; count: number }>();
    
    results.forEach(r => {
      const percentage = (r.score / r.maxScore) * 100;
      const existing = subjects.get(r.subject) || { total: 0, count: 0 };
      subjects.set(r.subject, {
        total: existing.total + percentage,
        count: existing.count + 1,
      });
    });

    return Array.from(subjects.entries()).map(([subject, data]) => ({
      subject,
      average: data.total / data.count,
    }));
  };

  const getMonthlyTrend = () => {
    const monthly = results
      .filter(r => r.period === 'monthly')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const grouped = new Map<string, { total: number; count: number }>();
    
    monthly.forEach(r => {
      const month = new Date(r.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const percentage = (r.score / r.maxScore) * 100;
      const existing = grouped.get(month) || { total: 0, count: 0 };
      grouped.set(month, {
        total: existing.total + percentage,
        count: existing.count + 1,
      });
    });

    return Array.from(grouped.entries()).map(([month, data]) => ({
      month,
      average: data.total / data.count,
    }));
  };

  const subjectPerformance = getSubjectPerformance();
  const monthlyTrend = getMonthlyTrend();
  const averageScore = parseFloat(getAverageScore());
  const overallGrade = getGrade(averageScore);

  return (
    <div className="md:ml-64 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Exam Results</h1>
            <p className="text-gray-600">Track academic performance and progress</p>
          </div>
          {isTeacherOrAdmin && (
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Result
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Exam Result</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUploadResult} className="space-y-4">
                  <div>
                    <Label htmlFor="studentId">Student ID *</Label>
                    <Input
                      id="studentId"
                      value={newResult.studentId}
                      onChange={(e) => setNewResult({ ...newResult, studentId: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="examName">Exam Name *</Label>
                    <Input
                      id="examName"
                      value={newResult.examName}
                      onChange={(e) => setNewResult({ ...newResult, examName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={newResult.subject}
                      onChange={(e) => setNewResult({ ...newResult, subject: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="score">Score *</Label>
                      <Input
                        id="score"
                        type="number"
                        value={newResult.score}
                        onChange={(e) => setNewResult({ ...newResult, score: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxScore">Max Score *</Label>
                      <Input
                        id="maxScore"
                        type="number"
                        value={newResult.maxScore}
                        onChange={(e) => setNewResult({ ...newResult, maxScore: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="period">Period *</Label>
                    <select
                      id="period"
                      value={newResult.period}
                      onChange={(e) => setNewResult({ ...newResult, period: e.target.value as any })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="final">Final</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newResult.date}
                      onChange={(e) => setNewResult({ ...newResult, date: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Upload Result
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Overall Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold">{averageScore}%</div>
                <div className={`text-xl font-bold ${overallGrade.color}`}>
                  {overallGrade.grade}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{results.length}</div>
              <p className="text-xs text-gray-500 mt-1">All periods</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <div className="text-2xl font-bold text-green-600">+5%</div>
              </div>
              <p className="text-xs text-gray-500 mt-1">vs last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList>
            <TabsTrigger value="reports">Test Reports</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Performance</TabsTrigger>
            <TabsTrigger value="quarterly">Quarterly Performance</TabsTrigger>
          </TabsList>

          {/* Test Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            {results.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No exam results yet</p>
                </CardContent>
              </Card>
            ) : (
              results
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((result) => {
                  const percentage = (result.score / result.maxScore) * 100;
                  const grade = getGrade(percentage);

                  return (
                    <Card key={result.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{result.subject}</Badge>
                              <Badge className="capitalize">{result.period}</Badge>
                            </div>
                            <CardTitle className="text-lg">{result.examName}</CardTitle>
                            <CardDescription>
                              {new Date(result.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </CardDescription>
                          </div>
                          <GraduationCap className="w-6 h-6 text-gray-400" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-3">
                            <div className="text-4xl font-bold">
                              {result.score}/{result.maxScore}
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-gray-600">
                                {percentage.toFixed(1)}%
                              </div>
                              <div className={`text-xl font-bold ${grade.color}`}>
                                Grade: {grade.grade}
                              </div>
                            </div>
                          </div>
                          <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
            )}
          </TabsContent>

          {/* Monthly Performance Tab */}
          <TabsContent value="monthly">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance Trend</CardTitle>
                <CardDescription>
                  Track your progress over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {monthlyTrend.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="average"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          name="Average Score (%)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {monthlyTrend.map((trend, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-600">{trend.month}</div>
                          <div className="text-2xl font-bold">
                            {trend.average.toFixed(1)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    No monthly data available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quarterly Performance Tab */}
          <TabsContent value="quarterly">
            <Card>
              <CardHeader>
                <CardTitle>Subject-wise Performance</CardTitle>
                <CardDescription>
                  Compare your performance across subjects
                </CardDescription>
              </CardHeader>
              <CardContent>
                {subjectPerformance.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={subjectPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="subject" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="average" fill="#8b5cf6" name="Average Score (%)" />
                      </BarChart>
                    </ResponsiveContainer>
                    
                    <div className="mt-6 space-y-2">
                      {subjectPerformance.map((perf, index) => {
                        const grade = getGrade(perf.average);
                        return (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <BarChart3 className="w-5 h-5 text-gray-500" />
                              <span className="font-medium">{perf.subject}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold">{perf.average.toFixed(1)}%</span>
                              <Badge className={`${grade.color.replace('text-', 'bg-')}/10 ${grade.color}`}>
                                {grade.grade}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    No subject performance data available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

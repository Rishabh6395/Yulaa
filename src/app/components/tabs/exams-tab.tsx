import { useState, useEffect } from 'react';
import { API_BASE_URL, supabase } from '../../lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { GraduationCap, TrendingUp, Download, Award } from 'lucide-react';

export function ExamsTab({ user }: { user: any }) {
  const [examResults, setExamResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExamResults();
  }, []);

  const loadExamResults = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const studentId = user?.user_metadata?.studentId || user?.id;
      const response = await fetch(`${API_BASE_URL}/exams/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        setExamResults(data.results || []);
      }
    } catch (error) {
      console.error('Failed to load exam results:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock exam data
  const recentTests = [
    { id: 1, subject: 'Mathematics', score: 92, maxScore: 100, date: '2026-02-15', grade: 'A' },
    { id: 2, subject: 'Science', score: 88, maxScore: 100, date: '2026-02-18', grade: 'B+' },
    { id: 3, subject: 'English', score: 95, maxScore: 100, date: '2026-02-20', grade: 'A' },
    { id: 4, subject: 'History', score: 85, maxScore: 100, date: '2026-02-21', grade: 'B' },
  ];

  const monthlyPerformance = [
    { month: 'Sep', average: 78 },
    { month: 'Oct', average: 82 },
    { month: 'Nov', average: 85 },
    { month: 'Dec', average: 87 },
    { month: 'Jan', average: 88 },
    { month: 'Feb', average: 90 },
  ];

  const quarterlyData = [
    { quarter: 'Q1', Mathematics: 85, Science: 82, English: 88, History: 80 },
    { quarter: 'Q2', Mathematics: 88, Science: 85, English: 90, History: 83 },
    { quarter: 'Q3', Mathematics: 90, Science: 87, English: 92, History: 85 },
  ];

  const subjectPerformance = [
    { subject: 'Mathematics', current: 92, previous: 88, trend: 'up' },
    { subject: 'Science', current: 88, previous: 90, trend: 'down' },
    { subject: 'English', current: 95, previous: 92, trend: 'up' },
    { subject: 'History', current: 85, previous: 83, trend: 'up' },
  ];

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-700 border-green-300';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-700 border-blue-300';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const currentAverage = recentTests.reduce((sum, test) => sum + (test.score / test.maxScore * 100), 0) / recentTests.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Exams & Performance</h2>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Current Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-blue-600">
                {currentAverage.toFixed(1)}%
              </div>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Class Rank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">5th</div>
            <p className="text-xs text-gray-500">out of 120 students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Tests Taken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{recentTests.length}</div>
            <p className="text-xs text-gray-500">this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              <Award className="h-4 w-4 inline mr-1" />
              Awards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">3</div>
            <p className="text-xs text-gray-500">this semester</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="tests" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tests">Test Reports</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Performance</TabsTrigger>
          <TabsTrigger value="quarterly">Quarterly Analysis</TabsTrigger>
        </TabsList>

        {/* Test Reports */}
        <TabsContent value="tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Test Results</CardTitle>
              <CardDescription>Your latest test scores and grades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <GraduationCap className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{test.subject}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(test.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${getScoreColor(test.score, test.maxScore)}`}>
                          {test.score}/{test.maxScore}
                        </p>
                        <p className="text-sm text-gray-500">
                          {((test.score / test.maxScore) * 100).toFixed(1)}%
                        </p>
                      </div>
                      <Badge className={getGradeColor(test.grade)}>
                        {test.grade}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Subject Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjectPerformance.map((subject) => (
                  <div key={subject.subject}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{subject.subject}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">
                          Previous: {subject.previous}%
                        </span>
                        <span className={`font-bold ${subject.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {subject.current}% {subject.trend === 'up' ? '↑' : '↓'}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${subject.trend === 'up' ? 'bg-green-600' : 'bg-red-600'}`}
                        style={{ width: `${subject.current}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monthly Performance */}
        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Average Trend</CardTitle>
              <CardDescription>Your average score over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyPerformance}>
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
                    dot={{ fill: '#3b82f6', r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quarterly Analysis */}
        <TabsContent value="quarterly">
          <Card>
            <CardHeader>
              <CardTitle>Quarterly Subject Comparison</CardTitle>
              <CardDescription>Performance across subjects by quarter</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={quarterlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Mathematics" fill="#3b82f6" />
                  <Bar dataKey="Science" fill="#10b981" />
                  <Bar dataKey="English" fill="#8b5cf6" />
                  <Bar dataKey="History" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { API_BASE_URL, supabase } from '../../lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { BookOpen, Calendar, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export function HomeworkTab({ user }: { user: any }) {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [submission, setSubmission] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadHomework();
  }, []);

  const loadHomework = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`${API_BASE_URL}/homework`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        setAssignments(data.assignments || []);
      }
    } catch (error) {
      console.error('Failed to load homework:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!submission.trim()) {
      toast.error('Please enter your submission');
      return;
    }

    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please log in to submit homework');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/homework/submit/${selectedAssignment.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          content: submission,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit homework');
      }

      toast.success('Homework submitted successfully!');
      setSubmission('');
      setSelectedAssignment(null);
      loadHomework();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const getDaysUntilDue = (dueDate: string) => {
    const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getSubjectColor = (subject: string) => {
    const colors: any = {
      mathematics: 'bg-blue-100 text-blue-700',
      science: 'bg-green-100 text-green-700',
      english: 'bg-purple-100 text-purple-700',
      history: 'bg-orange-100 text-orange-700',
      default: 'bg-gray-100 text-gray-700',
    };
    return colors[subject.toLowerCase()] || colors.default;
  };

  // Mock assignments if none exist
  const displayAssignments = assignments.length > 0 ? assignments : [
    {
      id: 'hw1',
      title: 'Chapter 5 Exercises',
      description: 'Complete exercises 1-20 from the textbook',
      subject: 'Mathematics',
      dueDate: '2026-02-28',
      classGroup: 'Grade 10A',
      createdAt: '2026-02-20',
    },
    {
      id: 'hw2',
      title: 'Essay on Climate Change',
      description: 'Write a 500-word essay discussing the impacts of climate change',
      subject: 'Science',
      dueDate: '2026-03-01',
      classGroup: 'Grade 10A',
      createdAt: '2026-02-21',
    },
    {
      id: 'hw3',
      title: 'Reading Comprehension',
      description: 'Read Chapter 3 and answer the questions at the end',
      subject: 'English',
      dueDate: '2026-02-25',
      classGroup: 'Grade 10A',
      createdAt: '2026-02-18',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Homework</h2>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {displayAssignments.length} assignments
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{displayAssignments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Due This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {displayAssignments.filter(a => getDaysUntilDue(a.dueDate) <= 7 && getDaysUntilDue(a.dueDate) > 0).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {displayAssignments.filter(a => isOverdue(a.dueDate)).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading assignments...</div>
        ) : (
          displayAssignments.map((assignment) => {
            const daysUntil = getDaysUntilDue(assignment.dueDate);
            const overdue = isOverdue(assignment.dueDate);

            return (
              <Card key={assignment.id} className={overdue ? 'border-red-300 bg-red-50' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="h-5 w-5" />
                        <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      </div>
                      <CardDescription>{assignment.description}</CardDescription>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge className={getSubjectColor(assignment.subject)}>
                          {assignment.subject}
                        </Badge>
                        <Badge variant="outline">
                          <Calendar className="h-3 w-3 mr-1" />
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </Badge>
                        {overdue ? (
                          <Badge variant="destructive">Overdue</Badge>
                        ) : daysUntil <= 2 ? (
                          <Badge variant="outline" className="text-orange-600 border-orange-600">
                            Due in {daysUntil} day{daysUntil !== 1 ? 's' : ''}
                          </Badge>
                        ) : null}
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button onClick={() => setSelectedAssignment(assignment)}>
                          Submit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Submit Homework: {assignment.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-2">
                              <strong>Subject:</strong> {assignment.subject}
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                              <strong>Due:</strong> {new Date(assignment.dueDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Description:</strong> {assignment.description}
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Your Submission
                            </label>
                            <Textarea
                              value={submission}
                              onChange={(e) => setSubmission(e.target.value)}
                              placeholder="Type your homework submission here or describe your uploaded file..."
                              rows={6}
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={handleSubmit}
                              disabled={submitting}
                              className="flex-1"
                            >
                              {submitting ? 'Submitting...' : 'Submit Homework'}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

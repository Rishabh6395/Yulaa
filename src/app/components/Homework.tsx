import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { BookOpen, Calendar, Plus, Upload, CheckCircle, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface Homework {
  id: string;
  title: string;
  subject: string;
  description: string;
  dueDate: string;
  createdAt: string;
  createdBy: string;
}

export const Homework: React.FC = () => {
  const { user, accessToken } = useAuth();
  const [homework, setHomework] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newHomework, setNewHomework] = useState({
    title: '',
    subject: '',
    description: '',
    dueDate: '',
  });

  const isTeacherOrAdmin = user?.role === 'admin' || user?.role === 'teacher';

  useEffect(() => {
    fetchHomework();
  }, []);

  const fetchHomework = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/homework`);
      const data = await response.json();
      if (data.success) {
        setHomework(data.homework);
      }
    } catch (err) {
      console.error('Error fetching homework:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      toast.error('Please sign in');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/homework`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newHomework),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Homework assigned successfully!');
        setHomework([data.homework, ...homework]);
        setNewHomework({ title: '', subject: '', description: '', dueDate: '' });
        setCreateDialogOpen(false);
      } else {
        toast.error(data.error || 'Failed to create homework');
      }
    } catch (err) {
      console.error('Error creating homework:', err);
      toast.error('Failed to create homework');
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const getDaysUntilDue = (dueDate: string) => {
    const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="md:ml-64 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Homework</h1>
            <p className="text-gray-600">View and manage assignments</p>
          </div>
          {isTeacherOrAdmin && (
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Assign Homework
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign New Homework</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateHomework} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={newHomework.title}
                      onChange={(e) => setNewHomework({ ...newHomework, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={newHomework.subject}
                      onChange={(e) => setNewHomework({ ...newHomework, subject: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={newHomework.description}
                      onChange={(e) => setNewHomework({ ...newHomework, description: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due Date *</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newHomework.dueDate}
                      onChange={(e) => setNewHomework({ ...newHomework, dueDate: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Assign Homework
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Homework Cards */}
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                Loading homework...
              </CardContent>
            </Card>
          ) : homework.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No homework assignments yet</p>
              </CardContent>
            </Card>
          ) : (
            homework.map((hw) => {
              const daysUntilDue = getDaysUntilDue(hw.dueDate);
              const overdue = isOverdue(hw.dueDate);

              return (
                <Card key={hw.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{hw.subject}</Badge>
                          {overdue ? (
                            <Badge className="bg-red-100 text-red-800">
                              Overdue
                            </Badge>
                          ) : daysUntilDue <= 2 ? (
                            <Badge className="bg-orange-100 text-orange-800">
                              <Clock className="w-3 h-3 mr-1" />
                              Due soon
                            </Badge>
                          ) : null}
                        </div>
                        <CardTitle className="text-xl">{hw.title}</CardTitle>
                        <CardDescription className="mt-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Due: {new Date(hw.dueDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        </CardDescription>
                      </div>
                      <BookOpen className="w-6 h-6 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-line mb-4">
                      {hw.description}
                    </p>
                    
                    {!isTeacherOrAdmin && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3">Submit Your Work</h4>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor={`file-${hw.id}`} className="text-sm">
                              Upload File
                            </Label>
                            <Input
                              id={`file-${hw.id}`}
                              type="file"
                              className="cursor-pointer"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`notes-${hw.id}`} className="text-sm">
                              Additional Notes (optional)
                            </Label>
                            <Textarea
                              id={`notes-${hw.id}`}
                              placeholder="Add any notes for your teacher..."
                              rows={2}
                            />
                          </div>
                          <Button className="w-full sm:w-auto">
                            <Upload className="w-4 h-4 mr-2" />
                            Submit Homework
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {isTeacherOrAdmin && (
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            Assigned on: {new Date(hw.createdAt).toLocaleDateString()}
                          </div>
                          <Button variant="outline" size="sm">
                            View Submissions
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

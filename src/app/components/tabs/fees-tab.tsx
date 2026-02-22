import { useState, useEffect } from 'react';
import { API_BASE_URL, supabase } from '../../lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { DollarSign, CreditCard, Download, Heart } from 'lucide-react';
import { toast } from 'sonner';

export function FeesTab({ user }: { user: any }) {
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [selectedFee, setSelectedFee] = useState<any>(null);
  const [donationAmount, setDonationAmount] = useState('');

  // Mock fee data
  const fees = [
    {
      id: 'fee1',
      type: 'Tuition Fee',
      term: 'Spring 2026',
      amount: 2500.00,
      dueDate: '2026-03-15',
      status: 'pending',
    },
    {
      id: 'fee2',
      type: 'Lab Fee',
      term: 'Spring 2026',
      amount: 150.00,
      dueDate: '2026-03-15',
      status: 'pending',
    },
    {
      id: 'fee3',
      type: 'Library Fee',
      term: 'Spring 2026',
      amount: 75.00,
      dueDate: '2026-03-15',
      status: 'paid',
      paidDate: '2026-02-10',
    },
    {
      id: 'fee4',
      type: 'Sports Fee',
      term: 'Spring 2026',
      amount: 200.00,
      dueDate: '2026-03-15',
      status: 'pending',
    },
  ];

  const paymentHistory = [
    {
      id: 'pay1',
      date: '2026-02-10',
      description: 'Library Fee - Spring 2026',
      amount: 75.00,
      method: 'Credit Card',
      status: 'completed',
    },
    {
      id: 'pay2',
      date: '2026-01-15',
      description: 'Tuition Fee - Winter 2026',
      amount: 2500.00,
      method: 'Bank Transfer',
      status: 'completed',
    },
  ];

  const donationCampaigns = [
    {
      id: 'don1',
      title: 'New Computer Lab',
      description: 'Help us build a state-of-the-art computer lab',
      raised: 45000,
      goal: 100000,
    },
    {
      id: 'don2',
      title: 'Scholarship Fund',
      description: 'Support students in need with scholarships',
      raised: 28000,
      goal: 50000,
    },
  ];

  const handlePayFee = async () => {
    setPaymentProcessing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please log in to make a payment');
        return;
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await fetch(`${API_BASE_URL}/fees/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          feeId: selectedFee.id,
          amount: selectedFee.amount,
          paymentMethod: 'card',
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      toast.success('Payment successful!');
      setSelectedFee(null);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleDonate = async () => {
    const amount = parseFloat(donationAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    toast.success(`Thank you for your donation of $${amount.toFixed(2)}!`);
    setDonationAmount('');
  };

  const pendingFees = fees.filter(f => f.status === 'pending');
  const totalPending = pendingFees.reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Fees & Donations</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-red-50 to-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700">Total Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">${totalPending.toFixed(2)}</div>
            <p className="text-xs text-gray-600 mt-1">{pendingFees.length} pending items</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700">Paid This Term</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">$75.00</div>
            <p className="text-xs text-gray-600 mt-1">1 item paid</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700">Next Due Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Mar 15</div>
            <p className="text-xs text-gray-600 mt-1">21 days remaining</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Fees */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Pending Fees</h3>
        <div className="space-y-3">
          {pendingFees.map((fee) => (
            <Card key={fee.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="h-5 w-5 text-gray-500" />
                      <h4 className="font-semibold">{fee.type}</h4>
                      <Badge variant="outline">{fee.term}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Due: {new Date(fee.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-600">
                        ${fee.amount.toFixed(2)}
                      </p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button onClick={() => setSelectedFee(fee)}>Pay Now</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Pay Fee</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">{fee.type}</h4>
                            <p className="text-sm text-gray-600">Term: {fee.term}</p>
                            <p className="text-2xl font-bold mt-2">${fee.amount.toFixed(2)}</p>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-medium">Payment Method</h4>
                            <div className="flex gap-2">
                              <Button variant="outline" className="flex-1">
                                <CreditCard className="h-4 w-4 mr-2" />
                                Card
                              </Button>
                              <Button variant="outline" className="flex-1">
                                Bank
                              </Button>
                            </div>
                          </div>

                          <Button
                            className="w-full"
                            onClick={handlePayFee}
                            disabled={paymentProcessing}
                          >
                            {paymentProcessing ? 'Processing...' : 'Complete Payment'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Payment History</h3>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              {paymentHistory.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium">{payment.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(payment.date).toLocaleDateString()} • {payment.method}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-green-600">
                      ${payment.amount.toFixed(2)}
                    </span>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Donation Campaigns */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Support Our School
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {donationCampaigns.map((campaign) => {
            const percentage = (campaign.raised / campaign.goal * 100).toFixed(1);
            return (
              <Card key={campaign.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{campaign.title}</CardTitle>
                  <CardDescription>{campaign.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Raised</span>
                        <span className="font-semibold">{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="font-semibold text-blue-600">
                          ${campaign.raised.toLocaleString()}
                        </span>
                        <span className="text-gray-500">
                          Goal: ${campaign.goal.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={handleDonate}>
                        <Heart className="h-4 w-4 mr-2" />
                        Donate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

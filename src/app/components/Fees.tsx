import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import { DollarSign, CreditCard, Download, Heart, Receipt, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface Payment {
  id: string;
  amount: number;
  type: 'tuition' | 'transport' | 'books' | 'donation';
  description: string;
  status: 'completed' | 'pending';
  paidAt: string;
}

const defaultInvoices = [
  { id: '1', description: 'Tuition Fee - Semester 1', amount: 5000, dueDate: '2026-03-15', status: 'pending' },
  { id: '2', description: 'Transport Fee - March', amount: 50, dueDate: '2026-03-01', status: 'pending' },
  { id: '3', description: 'Books & Materials', amount: 200, dueDate: '2026-03-10', status: 'pending' },
];

const donationCampaigns = [
  { id: '1', name: 'Library Expansion Fund', goal: 50000, raised: 35000, description: 'Help us build a new library wing with modern facilities' },
  { id: '2', name: 'Sports Equipment', goal: 10000, raised: 7500, description: 'Support our athletics program with new equipment' },
  { id: '3', name: 'Scholarship Fund', goal: 30000, raised: 22000, description: 'Provide scholarships for deserving students' },
];

export const Fees: React.FC = () => {
  const { user, accessToken } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState(defaultInvoices);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [donationDialogOpen, setDonationDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchPayments();
    }
  }, [user]);

  const fetchPayments = async () => {
    if (!user || !accessToken) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/fees/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setPayments(data.payments);
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
    }
  };

  const handlePayment = async (invoice: any) => {
    if (!accessToken) {
      toast.error('Please sign in');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/fees/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          amount: invoice.amount,
          type: 'tuition',
          description: invoice.description,
          invoiceId: invoice.id,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Payment successful!');
        fetchPayments();
        setPaymentDialogOpen(false);
        
        // Update invoice status
        setInvoices(invoices.map(inv => 
          inv.id === invoice.id ? { ...inv, status: 'paid' } : inv
        ));
      } else {
        toast.error(data.error || 'Payment failed');
      }
    } catch (err) {
      console.error('Error processing payment:', err);
      toast.error('Payment failed');
    }
  };

  const handleDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      toast.error('Please sign in');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/fees/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          amount: parseFloat(donationAmount),
          type: 'donation',
          description: `Donation to ${selectedCampaign.name}`,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Thank you for your donation!');
        fetchPayments();
        setDonationDialogOpen(false);
        setDonationAmount('');
      } else {
        toast.error(data.error || 'Donation failed');
      }
    } catch (err) {
      console.error('Error processing donation:', err);
      toast.error('Donation failed');
    }
  };

  const getTotalPaid = () => {
    return payments.reduce((sum, p) => sum + p.amount, 0);
  };

  const getTotalPending = () => {
    return invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0);
  };

  return (
    <div className="md:ml-64 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Fees & Donations</h1>
          <p className="text-gray-600">Manage payments and support school initiatives</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">${getTotalPaid()}</div>
              <p className="text-xs text-gray-500 mt-1">This academic year</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">${getTotalPending()}</div>
              <p className="text-xs text-gray-500 mt-1">Due soon</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {getTotalPending() === 0 ? (
                  <Badge className="bg-green-100 text-green-800 text-lg px-3 py-1">
                    All Clear ✓
                  </Badge>
                ) : (
                  <Badge className="bg-orange-100 text-orange-800 text-lg px-3 py-1">
                    Action Required
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="invoices" className="space-y-6">
          <TabsList>
            <TabsTrigger value="invoices">
              <Receipt className="w-4 h-4 mr-2" />
              Invoices
            </TabsTrigger>
            <TabsTrigger value="history">
              <Calendar className="w-4 h-4 mr-2" />
              Payment History
            </TabsTrigger>
            <TabsTrigger value="donations">
              <Heart className="w-4 h-4 mr-2" />
              Donations
            </TabsTrigger>
          </TabsList>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-4">
            {invoices.map((invoice) => (
              <Card key={invoice.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{invoice.description}</CardTitle>
                      <CardDescription className="mt-1">
                        Due: {new Date(invoice.dueDate).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge
                      className={
                        invoice.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }
                    >
                      {invoice.status === 'paid' ? 'Paid' : 'Pending'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">${invoice.amount}</div>
                    {invoice.status === 'pending' ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button onClick={() => setSelectedInvoice(invoice)}>
                            <CreditCard className="w-4 h-4 mr-2" />
                            Pay Now
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Payment Confirmation</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <div className="text-sm text-gray-600 mb-1">Amount to Pay</div>
                              <div className="text-3xl font-bold">${invoice.amount}</div>
                              <div className="text-sm text-gray-600 mt-2">{invoice.description}</div>
                            </div>
                            <div className="space-y-3">
                              <div>
                                <Label>Card Number</Label>
                                <Input placeholder="4242 4242 4242 4242" />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <Label>Expiry</Label>
                                  <Input placeholder="MM/YY" />
                                </div>
                                <div>
                                  <Label>CVV</Label>
                                  <Input placeholder="123" type="password" />
                                </div>
                              </div>
                            </div>
                            <Button
                              className="w-full"
                              onClick={() => handlePayment(invoice)}
                            >
                              Complete Payment
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Receipt
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Payment History Tab */}
          <TabsContent value="history" className="space-y-4">
            {payments.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  No payment history yet
                </CardContent>
              </Card>
            ) : (
              payments.map((payment) => (
                <Card key={payment.id}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">{payment.description}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(payment.paidAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${payment.amount}</div>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Donations Tab */}
          <TabsContent value="donations" className="space-y-4">
            {donationCampaigns.map((campaign) => {
              const percentage = (campaign.raised / campaign.goal) * 100;
              
              return (
                <Card key={campaign.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <Heart className="w-5 h-5 text-red-500" />
                          {campaign.name}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {campaign.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-semibold">
                            ${campaign.raised.toLocaleString()} / ${campaign.goal.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-pink-500 to-red-500 h-3 rounded-full transition-all"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {percentage.toFixed(0)}% funded
                        </div>
                      </div>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="w-full"
                            onClick={() => setSelectedCampaign(campaign)}
                          >
                            <Heart className="w-4 h-4 mr-2" />
                            Donate Now
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Make a Donation</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleDonation} className="space-y-4">
                            <div className="p-4 bg-gradient-to-r from-pink-50 to-red-50 rounded-lg">
                              <div className="font-semibold mb-1">{campaign.name}</div>
                              <div className="text-sm text-gray-600">{campaign.description}</div>
                            </div>
                            <div>
                              <Label htmlFor="amount">Donation Amount ($)</Label>
                              <Input
                                id="amount"
                                type="number"
                                min="1"
                                value={donationAmount}
                                onChange={(e) => setDonationAmount(e.target.value)}
                                placeholder="Enter amount"
                                required
                              />
                            </div>
                            <div className="flex gap-2">
                              {[10, 25, 50, 100].map((amt) => (
                                <Button
                                  key={amt}
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setDonationAmount(amt.toString())}
                                >
                                  ${amt}
                                </Button>
                              ))}
                            </div>
                            <Button type="submit" className="w-full">
                              Complete Donation
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

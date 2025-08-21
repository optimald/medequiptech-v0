'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Bid {
  id: string;
  job_id: string;
  user_id: string;
  amount: number;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
  created_at: string;
  job: {
    id: string;
    title: string;
    job_type: 'tech' | 'trainer';
    company_name: string;
    customer_name: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    status: 'OPEN' | 'BIDDING' | 'AWARDED' | 'IN_PROGRESS' | 'COMPLETED';
    met_date: string;
    shipping_city: string;
    shipping_state: string;
  };
}

// Helper functions
const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'ACCEPTED':
      return 'bg-green-100 text-green-800';
    case 'REJECTED':
      return 'bg-red-100 text-red-800';
    case 'WITHDRAWN':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'URGENT':
      return 'bg-red-100 text-red-800';
    case 'HIGH':
      return 'bg-orange-100 text-orange-800';
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800';
    case 'LOW':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function BidsPage() {
  const { user, isDemoUser, demoRole } = useAuth();
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchBids();
    }
  }, [user]);

  const fetchBids = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bids/my-bids');
      
      if (!response.ok) {
        throw new Error('Failed to fetch bids');
      }
      
      const data = await response.json();
      setBids(data.bids || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bids');
    } finally {
      setLoading(false);
    }
  };

  const withdrawBid = async (bidId: string) => {
    try {
      const response = await fetch(`/api/bids/${bidId}/withdraw`, {
        method: 'PATCH',
      });
      
      if (!response.ok) {
        throw new Error('Failed to withdraw bid');
      }
      
      // Refresh bids after withdrawal
      await fetchBids();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to withdraw bid');
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Please sign in to view your bids.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Loading your bids...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-red-600">Error: {error}</p>
            <Button onClick={fetchBids} className="mt-4 mx-auto block">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingBids = bids.filter(bid => bid.status === 'PENDING');
  const acceptedBids = bids.filter(bid => bid.status === 'ACCEPTED');
  const rejectedBids = bids.filter(bid => bid.status === 'REJECTED');
  const withdrawnBids = bids.filter(bid => bid.status === 'WITHDRAWN');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bids</h1>
        <p className="text-gray-600 mt-2">Track and manage your job bids</p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">
            Pending ({pendingBids.length})
          </TabsTrigger>
          <TabsTrigger value="accepted">
            Accepted ({acceptedBids.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedBids.length})
          </TabsTrigger>
          <TabsTrigger value="withdrawn">
            Withdrawn ({withdrawnBids.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <div className="grid gap-4">
            {pendingBids.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-600">No pending bids</p>
                </CardContent>
              </Card>
            ) : (
              pendingBids.map((bid) => (
                <BidCard key={bid.id} bid={bid} onWithdraw={withdrawBid} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="accepted" className="mt-6">
          <div className="grid gap-4">
            {acceptedBids.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-600">No accepted bids</p>
                </CardContent>
              </Card>
            ) : (
              acceptedBids.map((bid) => (
                <BidCard key={bid.id} bid={bid} onWithdraw={withdrawBid} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          <div className="grid gap-4">
            {rejectedBids.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-600">No rejected bids</p>
                </CardContent>
              </Card>
            ) : (
              rejectedBids.map((bid) => (
                <BidCard key={bid.id} bid={bid} onWithdraw={withdrawBid} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="withdrawn" className="mt-6">
          <div className="grid gap-4">
            {withdrawnBids.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-600">No withdrawn bids</p>
                </CardContent>
              </Card>
            ) : (
              withdrawnBids.map((bid) => (
                <BidCard key={bid.id} bid={bid} onWithdraw={withdrawBid} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BidCard({ bid, onWithdraw }: { bid: Bid; onWithdraw: (bidId: string) => void }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{bid.job.title}</CardTitle>
            <CardDescription>
              {bid.job.company_name} • {bid.job.customer_name}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(bid.amount)}
            </div>
            <Badge className={`mt-2 ${getStatusColor(bid.status)}`}>
              {bid.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Job Type</p>
            <p className="font-medium capitalize">{bid.job.job_type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Priority</p>
            <Badge className={getPriorityColor(bid.job.priority)}>
              {bid.job.priority}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-500">MET Date</p>
            <p className="font-medium">{formatDate(bid.job.met_date)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{bid.job.shipping_city}, {bid.job.shipping_state}</p>
          </div>
        </div>
        
        {bid.message && (
          <div className="mb-4">
            <p className="text-sm text-gray-500">Your Message</p>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{bid.message}</p>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Bid placed on {formatDate(bid.created_at)}
          </p>
          
          {bid.status === 'PENDING' && (
            <Button
              variant="outline"
              onClick={() => onWithdraw(bid.id)}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              Withdraw Bid
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

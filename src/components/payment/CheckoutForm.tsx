'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { PaymentPlan } from '@/types';
import { CreditCard, Lock, Shield } from 'lucide-react';

interface CheckoutFormProps {
  plan: PaymentPlan;
  onSuccess: (paymentId: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function CheckoutForm({ plan, onSuccess, onCancel, loading = false }: CheckoutFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'razorpay'>('stripe');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    country: 'US'
  });

  const countries = [
    { value: 'US', label: 'United States' },
    { value: 'IN', label: 'India' },
    { value: 'CA', label: 'Canada' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'AU', label: 'Australia' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'JP', label: 'Japan' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Here you would integrate with your payment processor
      // For demonstration, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const paymentId = `pay_${Math.random().toString(36).substr(2, 9)}`;
      onSuccess(paymentId);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Complete Your Purchase
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {/* Plan Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{plan.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {plan.interval === 'monthly' ? 'Monthly' : plan.interval === 'yearly' ? 'Yearly' : 'One-time'} billing
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  ${plan.price}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {plan.interval === 'monthly' ? '/month' : plan.interval === 'yearly' ? '/year' : ''}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('stripe')}
                className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                  paymentMethod === 'stripe'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Stripe</span>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setPaymentMethod('razorpay')}
                className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                  paymentMethod === 'razorpay'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Razorpay</span>
                </div>
              </button>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              placeholder="your@email.com"
            />

            <Input
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              placeholder="John Doe"
            />

            <Input
              label="Card Number"
              type="text"
              value={formData.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
              required
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry Date"
                type="text"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                required
                placeholder="MM/YY"
                maxLength={5}
              />

              <Input
                label="CVV"
                type="text"
                value={formData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                required
                placeholder="123"
                maxLength={4}
              />
            </div>

            <Select
              label="Country"
              options={countries}
              value={formData.country}
              onChange={(value) => handleInputChange('country', value)}
            />

            {/* Security Notice */}
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Lock className="h-4 w-4" />
              <span>Your payment information is secure and encrypted</span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                loading={loading}
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Processing...' : `Pay $${plan.price}`}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 
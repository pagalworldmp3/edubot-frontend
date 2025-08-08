import React from 'react';
import { Check, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PaymentPlan } from '@/types';

interface PricingCardProps {
  plan: PaymentPlan;
  onSelect: (plan: PaymentPlan) => void;
  loading?: boolean;
  currentPlan?: string;
}

export function PricingCard({ plan, onSelect, loading = false, currentPlan }: PricingCardProps) {
  const isCurrentPlan = currentPlan === plan.id;
  const isPopular = plan.isPopular;

  return (
    <Card className={`relative ${isPopular ? 'ring-2 ring-blue-500 shadow-xl' : ''}`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
            <Star className="h-3 w-3 mr-1" />
            Most Popular
          </span>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
          {plan.name}
        </CardTitle>
        <div className="mt-4">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">
            ${plan.price}
          </span>
          <span className="text-gray-600 dark:text-gray-300 ml-2">
            /{plan.interval === 'monthly' ? 'month' : plan.interval === 'yearly' ? 'year' : 'one-time'}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Features */}
        <div className="space-y-3">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
            </div>
          ))}
        </div>

        {/* Limits */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
          <h4 className="font-medium text-gray-900 dark:text-white text-sm">Usage Limits</h4>
          <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
            <div>• {plan.limits.courseGenerations === -1 ? 'Unlimited' : plan.limits.courseGenerations} course generations</div>
            <div>• {plan.limits.exports === -1 ? 'Unlimited' : plan.limits.exports} exports per month</div>
            <div>• {Math.round(plan.limits.storage / 1024)}GB storage</div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={() => onSelect(plan)}
          disabled={loading || isCurrentPlan}
          loading={loading}
          className={`w-full ${
            isCurrentPlan 
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
              : isPopular 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
          }`}
        >
          {isCurrentPlan ? 'Current Plan' : `Get ${plan.name}`}
        </Button>

        {isCurrentPlan && (
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            You're currently on this plan
          </p>
        )}
      </CardContent>
    </Card>
  );
} 
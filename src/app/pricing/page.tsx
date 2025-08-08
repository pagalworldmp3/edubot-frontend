'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { 
  Check, 
  Star, 
  Zap, 
  Users, 
  Download, 
  Shield, 
  Globe, 
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PricingCard } from '@/components/payment/PricingCard';
import { CheckoutForm } from '@/components/payment/CheckoutForm';
import { PaymentPlan } from '@/types';

export default function PricingPage() {
  const { user, isLoaded } = useUser();
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(false);

  const plans: PaymentPlan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      currency: 'USD',
      interval: 'monthly',
      features: [
        '3 course generations per day',
        'Basic templates',
        'Course preview',
        'Community support',
        'Standard AI models'
      ],
      limits: {
        courseGenerations: 3,
        exports: 0,
        storage: 100 * 1024 * 1024 // 100MB
      },
      isPopular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: billingInterval === 'monthly' ? 29 : 290,
      currency: 'USD',
      interval: billingInterval,
      features: [
        'Unlimited course generations',
        'Premium templates',
        'PDF & PowerPoint export',
        'Priority support',
        'Advanced AI models (GPT-4, Claude)',
        'Custom branding',
        'Certificate generation',
        'Video recommendations'
      ],
      limits: {
        courseGenerations: -1, // unlimited
        exports: -1, // unlimited
        storage: 5 * 1024 * 1024 * 1024 // 5GB
      },
      isPopular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: billingInterval === 'monthly' ? 99 : 990,
      currency: 'USD',
      interval: billingInterval,
      features: [
        'Everything in Pro',
        'Team collaboration',
        'API access',
        'White-label solution',
        'Dedicated support',
        'Custom integrations',
        'Advanced analytics',
        'SCORM export',
        'SSO integration'
      ],
      limits: {
        courseGenerations: -1, // unlimited
        exports: -1, // unlimited
        storage: 50 * 1024 * 1024 * 1024 // 50GB
      },
      isPopular: false
    }
  ];

  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Generation',
      description: 'Create comprehensive courses with advanced AI models'
    },
    {
      icon: Download,
      title: 'Multiple Export Formats',
      description: 'Export to PDF, PowerPoint, or SCORM for LMS integration'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security with encryption and compliance'
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Generate courses in 10+ languages with localization'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together with your team on course creation'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Get help whenever you need it with priority support'
    }
  ];

  const handlePlanSelect = (plan: PaymentPlan) => {
    if (plan.id === 'free') {
      // Handle free plan signup
      if (!isLoaded || !user) {
        // Redirect to signup
        window.location.href = '/sign-up';
        return;
      }
      // Upgrade to free plan
      alert('You are now on the Free plan!');
      return;
    }

    setSelectedPlan(plan);
    setShowCheckout(true);
  };

  const handlePaymentSuccess = (paymentId: string) => {
    setShowCheckout(false);
    setSelectedPlan(null);
    alert(`Payment successful! Payment ID: ${paymentId}`);
    // Here you would update the user's subscription status
  };

  const handlePaymentCancel = () => {
    setShowCheckout(false);
    setSelectedPlan(null);
  };

  if (showCheckout && selectedPlan) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Complete Your Purchase
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              You're just one step away from unlocking premium features
            </p>
          </div>
          
          <CheckoutForm
            plan={selectedPlan}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
            loading={loading}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                <Sparkles className="h-4 w-4 mr-2" />
                Choose Your Plan
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Start free and upgrade as you grow. All plans include our core AI-powered course generation features.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className={`text-sm ${billingInterval === 'monthly' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingInterval(billingInterval === 'monthly' ? 'yearly' : 'monthly')}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingInterval === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm ${billingInterval === 'yearly' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                Yearly
                <span className="ml-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full">
                  Save 20%
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              onSelect={handlePlanSelect}
              loading={loading}
              currentPlan={user?.publicMetadata?.subscriptionPlan as string}
            />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Create Amazing Courses
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Our AI-powered platform handles the heavy lifting so you can focus on what matters most.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We accept all major credit cards, PayPal, and bank transfers for enterprise plans.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, you can start with our free plan which includes 3 course generations per day.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We offer a 30-day money-back guarantee for all paid plans.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Create Your First Course?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of educators and trainers who are already using CourseGenie AI.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
} 
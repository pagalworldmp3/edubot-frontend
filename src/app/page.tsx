'use client';

import { useState } from 'react';
import { SignInButton, SignUpButton, useUser } from '@clerk/nextjs';
import { 
  Sparkles, 
  BookOpen, 
  Users, 
  Zap, 
  Download, 
  Brain, 
  Globe, 
  Award,
  CheckCircle,
  ArrowRight,
  Star,
  Play
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { isSignedIn, user } = useUser();
  const [activeTab, setActiveTab] = useState('features');

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Generation",
      description: "Create comprehensive courses with advanced AI models including GPT-4, Gemini, and Claude"
    },
    {
      icon: BookOpen,
      title: "Complete Course Structure",
      description: "Generate modules, lessons, quizzes, and assignments automatically"
    },
    {
      icon: Download,
      title: "Multiple Export Formats",
      description: "Export to PDF, PowerPoint, or SCORM for LMS integration"
    },
    {
      icon: Globe,
      title: "Multi-Language Support",
      description: "Generate courses in English, Hindi, Spanish, and more"
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Share courses publicly or keep them private for your team"
    },
    {
      icon: Award,
      title: "Professional Certificates",
      description: "Auto-generate certificates with custom branding"
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "3 course generations per day",
        "Basic templates",
        "Course preview",
        "Community support"
      ],
      popular: false
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      features: [
        "Unlimited course generations",
        "Premium templates",
        "PDF & PPT export",
        "Priority support",
        "Custom branding",
        "Advanced AI models"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "per month",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "API access",
        "White-label solution",
        "Dedicated support",
        "Custom integrations"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold gradient-text">CourseGenie AI</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => setActiveTab('features')}
                className={`${activeTab === 'features' ? 'text-blue-600' : 'text-gray-600 dark:text-gray-300'} hover:text-blue-600 transition-colors`}
              >
                Features
              </button>
              <button 
                onClick={() => setActiveTab('pricing')}
                className={`${activeTab === 'pricing' ? 'text-blue-600' : 'text-gray-600 dark:text-gray-300'} hover:text-blue-600 transition-colors`}
              >
                Pricing
              </button>
              <button 
                onClick={() => setActiveTab('about')}
                className={`${activeTab === 'about' ? 'text-blue-600' : 'text-gray-600 dark:text-gray-300'} hover:text-blue-600 transition-colors`}
              >
                About
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {isSignedIn ? (
                <Link href="/dashboard" className="btn-primary">
                  Dashboard
                </Link>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="btn-primary">
                      Get Started
                    </button>
                  </SignUpButton>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Course Generation
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Create Professional Courses
            <span className="block gradient-text">in Minutes, Not Months</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Transform your expertise into engaging courses with AI. Generate comprehensive learning materials, 
            interactive quizzes, and professional certificates automatically.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isSignedIn ? (
              <Link href="/dashboard" className="btn-primary text-lg px-8 py-3">
                Create Your First Course
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            ) : (
              <SignUpButton mode="modal">
                <button className="btn-primary text-lg px-8 py-3">
                  Start Creating Courses
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </SignUpButton>
            )}
            <button className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">
              <Play className="h-5 w-5 mr-2" />
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {activeTab === 'features' && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Everything You Need to Create Amazing Courses
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Our AI-powered platform handles the heavy lifting so you can focus on what matters most - your expertise.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="card hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section */}
      {activeTab === 'pricing' && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Choose Your Plan
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Start free and upgrade as you grow
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <div key={index} className={`card relative ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        {plan.price}
                      </span>
                      <span className="text-gray-600 dark:text-gray-300">
                        /{plan.period}
                      </span>
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <SignUpButton mode="modal">
                    <button className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                      plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'
                    }`}>
                      Get Started
                    </button>
                  </SignUpButton>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      {activeTab === 'about' && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              About CourseGenie AI
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              CourseGenie AI is a cutting-edge platform that revolutionizes course creation. 
              We combine the power of advanced AI models with intuitive design to help educators, 
              trainers, and content creators build professional courses in minutes.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                <div className="text-gray-600 dark:text-gray-300">Courses Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
                <div className="text-gray-600 dark:text-gray-300">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
                <div className="text-gray-600 dark:text-gray-300">Uptime</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">CourseGenie AI</span>
              </div>
              <p className="text-gray-400">
                Transform your expertise into engaging courses with AI-powered generation.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CourseGenie AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

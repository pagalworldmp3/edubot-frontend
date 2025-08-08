export interface User {
  id: string;
  email: string;
  name: string;
  role: 'free' | 'pro' | 'enterprise';
  subscriptionStatus: 'active' | 'inactive' | 'cancelled';
  createdAt: Date;
  lastLogin: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'expert';
  language: string;
  modules: Module[];
  learningOutcomes: string[];
  thumbnail?: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  publicShareId?: string;
  tags: string[];
  estimatedDuration: number; // in minutes
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  quiz: Quiz;
  order: number;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  duration: number; // in minutes
  order: number;
  resources?: Resource[];
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  passingScore: number;
  timeLimit?: number; // in minutes
}

export interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'video' | 'document' | 'link' | 'image';
  url: string;
  description?: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'google' | 'anthropic';
  model: string;
  maxTokens: number;
  costPerToken: number;
  isActive: boolean;
}

export interface GenerationRequest {
  title: string;
  description?: string;
  level: 'beginner' | 'intermediate' | 'expert';
  language: string;
  aiModel: string;
  includeQuizzes: boolean;
  includeAssignments: boolean;
  customInstructions?: string;
}

export interface GenerationResponse {
  course: Course;
  generationTime: number;
  tokensUsed: number;
  cost: number;
}

export interface ExportOptions {
  format: 'pdf' | 'ppt' | 'scorm';
  includeQuizzes: boolean;
  includeCertificates: boolean;
  branding?: {
    logo?: string;
    colors?: {
      primary: string;
      secondary: string;
    };
  };
}

export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly' | 'lifetime';
  features: string[];
  limits: {
    courseGenerations: number;
    exports: number;
    storage: number;
  };
  isPopular: boolean;
}

export interface Analytics {
  totalCourses: number;
  totalGenerations: number;
  totalUsers: number;
  revenue: {
    monthly: number;
    total: number;
  };
  popularTopics: Array<{
    topic: string;
    count: number;
  }>;
  userGrowth: Array<{
    date: string;
    users: number;
  }>;
}

export interface AdminSettings {
  siteName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  aiModels: AIModel[];
  paymentGateways: {
    stripe: {
      enabled: boolean;
      publishableKey: string;
      secretKey: string;
    };
    razorpay: {
      enabled: boolean;
      keyId: string;
      keySecret: string;
    };
  };
  limits: {
    freeGenerationsPerDay: number;
    freeExportsPerMonth: number;
  };
} 
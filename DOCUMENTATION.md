# CourseGenie AI - Complete Documentation

Welcome to the comprehensive documentation for CourseGenie AI, the premium AI-powered course generation platform.

## 📚 Table of Contents

1. [Getting Started](#getting-started)
2. [User Guide](#user-guide)
3. [Admin Guide](#admin-guide)
4. [API Reference](#api-reference)
5. [Configuration](#configuration)
6. [Customization](#customization)
7. [Troubleshooting](#troubleshooting)
8. [FAQ](#faq)

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager
- API keys for AI services
- Clerk account for authentication

### Quick Installation
```bash
# Clone the repository
git clone https://github.com/your-username/coursegenie-ai.git
cd coursegenie-ai

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local

# Start development server
npm run dev
```

### Environment Variables
```env
# Required
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
OPENAI_API_KEY=your_openai_key

# Optional
GOOGLE_API_KEY=your_google_key
ANTHROPIC_API_KEY=your_anthropic_key
STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
```

## 👥 User Guide

### Creating Your First Course

#### Step 1: Sign Up
1. Visit your CourseGenie AI instance
2. Click "Get Started" or "Sign Up"
3. Choose your preferred signup method:
   - Email and password
   - Google account
   - GitHub account
   - Microsoft account

#### Step 2: Choose Your Plan
- **Free Plan**: 3 course generations per day
- **Pro Plan**: Unlimited generations, exports, premium features
- **Enterprise Plan**: Team features, API access, white-label

#### Step 3: Generate a Course
1. Navigate to "Create Course" or "Course Generator"
2. Enter course details:
   - **Title**: What your course is about
   - **Description**: Brief overview (optional)
   - **Level**: Beginner, Intermediate, or Expert
   - **Language**: Choose from 10+ languages
3. Configure AI settings:
   - **AI Model**: GPT-4, GPT-3.5, Gemini, or Claude
   - **Include Quizzes**: Generate assessments for each module
   - **Include Assignments**: Add practical exercises
   - **Custom Instructions**: Specific requirements or preferences
4. Click "Generate Course"

#### Step 4: Review and Customize
1. **Preview**: Review the generated course structure
2. **Edit Content**: Modify lessons, quizzes, and assignments
3. **Add Resources**: Include videos, documents, or links
4. **Customize Branding**: Add your logo and colors

#### Step 5: Export Your Course
- **PDF**: Professional document format
- **PowerPoint**: Presentation slides
- **SCORM**: LMS-compatible package
- **Share Link**: Public or private sharing

### Dashboard Features

#### Course Management
- **View All Courses**: See all your created courses
- **Search & Filter**: Find specific courses quickly
- **Status Tracking**: Draft, Published, or Archived
- **Bulk Operations**: Manage multiple courses

#### Analytics
- **Generation Stats**: Track your usage
- **Popular Topics**: See what courses you create most
- **Export History**: Monitor your downloads
- **Progress Tracking**: Course completion rates

### Collaboration Features

#### Team Workspace
- **Invite Members**: Add team members by email
- **Role Assignment**: Admin, Editor, or Viewer roles
- **Shared Courses**: Collaborate on course creation
- **Version Control**: Track changes and revisions

#### Sharing Options
- **Public Links**: Share courses with anyone
- **Private Sharing**: Invite specific people
- **Embed Codes**: Add courses to your website
- **Social Media**: Share on platforms

## 🔧 Admin Guide

### Accessing Admin Panel
1. Navigate to `/admin` in your browser
2. Login with admin credentials
3. Verify admin permissions

### Dashboard Overview

#### Analytics Dashboard
- **User Statistics**: Total users, growth, engagement
- **Revenue Metrics**: Monthly recurring revenue, churn rate
- **Course Analytics**: Popular topics, generation success rates
- **System Health**: Performance metrics, error rates

#### User Management
- **View All Users**: Complete user list with details
- **User Details**: Profile, subscription, activity
- **Role Management**: Assign admin, pro, or free roles
- **Subscription Management**: Upgrade/downgrade plans

### System Configuration

#### AI Model Management
```typescript
// Configure AI models in admin panel
{
  "gpt-4": {
    "enabled": true,
    "maxTokens": 4000,
    "costPerToken": 0.03,
    "priority": 1
  },
  "gemini-pro": {
    "enabled": true,
    "maxTokens": 4000,
    "costPerToken": 0.001,
    "priority": 2
  }
}
```

#### Payment Gateway Setup
1. **Stripe Configuration**:
   - Add publishable and secret keys
   - Configure webhook endpoints
   - Set up product plans

2. **Razorpay Configuration**:
   - Add key ID and secret
   - Configure webhook URLs
   - Set up payment plans

#### Site Customization
- **Branding**: Logo, colors, site name
- **Content**: Custom pages, terms, privacy policy
- **Features**: Enable/disable specific features
- **Limits**: Usage limits per plan

### Security Settings

#### Authentication
- **Two-Factor Authentication**: Require 2FA for all users
- **Session Management**: Configure session timeouts
- **Password Policy**: Set password requirements
- **Login Attempts**: Limit failed login attempts

#### API Security
- **Rate Limiting**: Prevent API abuse
- **CORS Configuration**: Control cross-origin requests
- **Input Validation**: Sanitize all inputs
- **Audit Logging**: Track all admin actions

## 🔌 API Reference

### Authentication
All API requests require authentication using Clerk JWT tokens.

```typescript
// Include token in headers
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### Course Generation API

#### Generate Course
```typescript
POST /api/courses/generate

// Request Body
{
  "title": "Introduction to React",
  "description": "Learn React fundamentals",
  "level": "beginner",
  "language": "English",
  "aiModel": "gpt-4",
  "includeQuizzes": true,
  "includeAssignments": true,
  "customInstructions": "Focus on practical examples"
}

// Response
{
  "success": true,
  "course": {
    "id": "course_123",
    "title": "Introduction to React",
    "modules": [...],
    "learningOutcomes": [...],
    "estimatedDuration": 120
  },
  "generationTime": 15000,
  "tokensUsed": 2500,
  "cost": 0.075
}
```

#### Get Course
```typescript
GET /api/courses/:id

// Response
{
  "success": true,
  "course": {
    "id": "course_123",
    "title": "Introduction to React",
    "description": "Learn React fundamentals",
    "level": "beginner",
    "language": "English",
    "modules": [...],
    "status": "published",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Update Course
```typescript
PUT /api/courses/:id

// Request Body
{
  "title": "Updated Course Title",
  "description": "Updated description",
  "modules": [...]
}

// Response
{
  "success": true,
  "course": {
    "id": "course_123",
    "title": "Updated Course Title",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

### Export API

#### Export to PDF
```typescript
POST /api/courses/:id/export/pdf

// Request Body
{
  "includeQuizzes": true,
  "includeCertificates": false,
  "branding": {
    "logo": "https://example.com/logo.png",
    "colors": {
      "primary": "#3B82F6",
      "secondary": "#8B5CF6"
    }
  }
}

// Response
{
  "success": true,
  "downloadUrl": "https://example.com/downloads/course_123.pdf",
  "expiresAt": "2024-01-16T10:30:00Z"
}
```

#### Export to PowerPoint
```typescript
POST /api/courses/:id/export/ppt

// Request Body
{
  "includeQuizzes": true,
  "branding": {
    "logo": "https://example.com/logo.png"
  }
}

// Response
{
  "success": true,
  "downloadUrl": "https://example.com/downloads/course_123.pptx",
  "expiresAt": "2024-01-16T10:30:00Z"
}
```

### User Management API

#### Get User Profile
```typescript
GET /api/users/profile

// Response
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "pro",
    "subscriptionStatus": "active",
    "createdAt": "2024-01-01T00:00:00Z",
    "lastLogin": "2024-01-15T10:30:00Z"
  }
}
```

#### Update User Profile
```typescript
PUT /api/users/profile

// Request Body
{
  "name": "John Smith",
  "preferences": {
    "language": "English",
    "timezone": "UTC",
    "notifications": {
      "email": true,
      "push": false
    }
  }
}

// Response
{
  "success": true,
  "user": {
    "id": "user_123",
    "name": "John Smith",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

### Analytics API

#### Get User Analytics
```typescript
GET /api/analytics/user

// Response
{
  "success": true,
  "analytics": {
    "totalCourses": 15,
    "totalGenerations": 25,
    "totalExports": 8,
    "thisMonth": {
      "courses": 3,
      "generations": 5,
      "exports": 2
    },
    "popularTopics": [
      { "topic": "React", "count": 5 },
      { "topic": "Python", "count": 3 }
    ]
  }
}
```

## ⚙️ Configuration

### Next.js Configuration
```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    domains: ['your-domain.com', 'clerk.com'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig
```

### Tailwind CSS Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
}
```

### TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 🎨 Customization

### Theme Customization

#### Color Scheme
```css
/* globals.css */
:root {
  --primary: 59 130 246; /* Blue */
  --secondary: 139 92 246; /* Purple */
  --accent: 34 197 94; /* Green */
  --background: 255 255 255;
  --foreground: 15 23 42;
}

.dark {
  --primary: 59 130 246;
  --secondary: 139 92 246;
  --accent: 34 197 94;
  --background: 15 23 42;
  --foreground: 248 250 252;
}
```

#### Custom Components
```typescript
// components/ui/CustomButton.tsx
import { Button } from './Button'

export function CustomButton({ children, ...props }) {
  return (
    <Button
      className="bg-gradient-to-r from-primary to-secondary text-white"
      {...props}
    >
      {children}
    </Button>
  )
}
```

### Branding Customization

#### Logo and Colors
1. **Update Logo**: Replace logo in `public/` directory
2. **Custom Colors**: Modify CSS variables in `globals.css`
3. **Site Name**: Update in admin settings or environment variables

#### Custom Pages
```typescript
// app/about/page.tsx
export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">About Us</h1>
      <p className="text-lg text-gray-600">
        Your custom about page content here.
      </p>
    </div>
  )
}
```

### Feature Customization

#### Enable/Disable Features
```typescript
// lib/features.ts
export const FEATURES = {
  QUIZZES: process.env.NEXT_PUBLIC_ENABLE_QUIZZES === 'true',
  ASSIGNMENTS: process.env.NEXT_PUBLIC_ENABLE_ASSIGNMENTS === 'true',
  CERTIFICATES: process.env.NEXT_PUBLIC_ENABLE_CERTIFICATES === 'true',
  EXPORTS: process.env.NEXT_PUBLIC_ENABLE_EXPORTS === 'true',
}
```

#### Custom AI Prompts
```typescript
// lib/ai-prompts.ts
export const CUSTOM_PROMPTS = {
  courseGeneration: `
    You are an expert course designer. Create a comprehensive course on {title}.
    Focus on practical, hands-on learning with real-world examples.
    Include industry best practices and current trends.
  `,
  quizGeneration: `
    Create engaging quiz questions that test understanding of {topic}.
    Include a mix of multiple choice, true/false, and short answer questions.
    Provide detailed explanations for correct answers.
  `
}
```

## 🐛 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### Authentication Issues
1. **Check Clerk Configuration**:
   - Verify publishable and secret keys
   - Check domain configuration
   - Ensure redirect URLs are correct

2. **Environment Variables**:
   - Verify all required variables are set
   - Check for typos in variable names
   - Restart development server after changes

#### AI Service Issues
1. **API Key Problems**:
   - Verify API keys are valid
   - Check API quotas and limits
   - Ensure proper error handling

2. **Rate Limiting**:
   - Implement exponential backoff
   - Add retry logic
   - Monitor API usage

#### Payment Issues
1. **Stripe Configuration**:
   - Verify publishable and secret keys
   - Check webhook endpoints
   - Ensure test/live mode is correct

2. **Razorpay Configuration**:
   - Verify key ID and secret
   - Check webhook URLs
   - Test payment flow

### Performance Issues

#### Slow Loading
1. **Optimize Images**:
   - Use Next.js Image component
   - Implement lazy loading
   - Compress images

2. **Code Splitting**:
   - Use dynamic imports
   - Implement route-based splitting
   - Optimize bundle size

#### Memory Issues
1. **Database Optimization**:
   - Implement connection pooling
   - Add proper indexing
   - Optimize queries

2. **Caching Strategy**:
   - Implement Redis caching
   - Use CDN for static assets
   - Cache API responses

### Debug Mode
```typescript
// Enable debug logging
const DEBUG = process.env.NODE_ENV === 'development'

if (DEBUG) {
  console.log('Debug mode enabled')
  // Add debug logging here
}
```

## ❓ FAQ

### General Questions

**Q: How many courses can I generate per day?**
A: Free users can generate 3 courses per day. Pro and Enterprise users have unlimited generations.

**Q: What AI models are supported?**
A: We support GPT-4, GPT-3.5 Turbo, Gemini Pro, and Claude 3. You can choose which model to use for each generation.

**Q: Can I export courses to different formats?**
A: Yes! You can export to PDF, PowerPoint, and SCORM formats. Pro and Enterprise users have unlimited exports.

**Q: Is my data secure?**
A: Absolutely. We use bank-level encryption, secure authentication, and never store sensitive information like payment details.

### Technical Questions

**Q: Can I customize the AI prompts?**
A: Yes, you can customize prompts in the admin panel or by modifying the AI service configuration.

**Q: How do I add custom branding?**
A: You can customize logos, colors, and site name through the admin panel or by modifying the theme configuration.

**Q: Can I integrate with my existing LMS?**
A: Yes! We support SCORM export which is compatible with most Learning Management Systems.

**Q: Is there an API available?**
A: Enterprise users get access to our REST API for custom integrations.

### Billing Questions

**Q: Can I change my plan anytime?**
A: Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.

**Q: Do you offer refunds?**
A: We offer a 30-day money-back guarantee for all paid plans.

**Q: What payment methods do you accept?**
A: We accept all major credit cards, PayPal, and bank transfers for enterprise plans.

**Q: Is there a free trial?**
A: Yes, you can start with our free plan which includes 3 course generations per day.

### Support Questions

**Q: How do I get help?**
A: You can contact us through email at support@coursegenie.ai, use our live chat, or check our documentation.

**Q: Do you offer custom development?**
A: Yes, we offer custom development services for enterprise clients. Contact us for more information.

**Q: Can I host this on my own server?**
A: Yes, the code is provided as a complete application that you can host anywhere that supports Next.js.

---

## 📞 Support

- **Email**: support@coursegenie.ai
- **Documentation**: [docs.coursegenie.ai](https://docs.coursegenie.ai)
- **Community**: [community.coursegenie.ai](https://community.coursegenie.ai)
- **GitHub**: [github.com/your-username/coursegenie-ai](https://github.com/your-username/coursegenie-ai)

---

**CourseGenie AI** - Transform your expertise into engaging courses with AI! 🚀 
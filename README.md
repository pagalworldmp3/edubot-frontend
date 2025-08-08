# CourseGenie AI - Premium AI Course Generator SaaS

![CourseGenie AI](https://img.shields.io/badge/CourseGenie-AI%20Course%20Generator-blue?style=for-the-badge&logo=react)
![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

> **Transform your expertise into engaging courses with AI in minutes, not months!**

CourseGenie AI is a premium, feature-rich SaaS platform that revolutionizes course creation using advanced AI models. Generate comprehensive learning materials, interactive quizzes, and professional certificates automatically.

## 🚀 Features

### ✨ Core Features
- **AI-Powered Course Generation** - Multiple AI models (GPT-4, Gemini, Claude)
- **Complete Course Structure** - Modules, lessons, quizzes, and assignments
- **Multi-Language Support** - 10+ languages with localization
- **Multiple Export Formats** - PDF, PowerPoint, SCORM
- **Professional Certificates** - Auto-generated with custom branding
- **Video Recommendations** - AI-suggested YouTube videos per topic

### 👥 User Management
- **Secure Authentication** - Clerk integration with social login
- **Role-Based Access** - Free, Pro, and Enterprise tiers
- **Team Collaboration** - Shared workspaces and version control
- **Progress Tracking** - Monitor course completion rates

### 💰 Monetization
- **Freemium Model** - Free tier with premium upgrades
- **Multiple Payment Gateways** - Stripe and Razorpay integration
- **Subscription Management** - Monthly, yearly, and lifetime plans
- **Revenue Analytics** - Track income and growth metrics

### 🎨 Design & UX
- **Modern UI/UX** - Responsive design with dark/light mode
- **Custom Branding** - White-label solution for enterprise
- **Accessibility** - WCAG 2.1 compliant
- **Performance Optimized** - Fast loading and caching

### 🔧 Admin Features
- **Comprehensive Dashboard** - Analytics and user management
- **AI Model Management** - Enable/disable and configure models
- **System Settings** - Site configuration and customization
- **Security Monitoring** - Audit logs and security features

## 📋 Requirements

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Clerk** account for authentication
- **OpenAI API** key (or other AI providers)
- **Stripe** account for payments (optional)
- **Razorpay** account for payments (optional)

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/coursegenie-ai.git
cd coursegenie-ai
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# AI Providers
OPENAI_API_KEY=your_openai_api_key
GOOGLE_API_KEY=your_google_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Payment Gateways (Optional)
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Database (if using external database)
DATABASE_URL=your_database_url

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Project Structure

```
coursegenie-ai/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── admin/             # Admin dashboard
│   │   ├── course-generator/  # Course generation page
│   │   ├── dashboard/         # User dashboard
│   │   ├── pricing/           # Pricing page
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable components
│   │   ├── ui/               # UI components (Button, Card, etc.)
│   │   └── payment/          # Payment components
│   ├── lib/                  # Utility libraries
│   │   ├── ai-service.ts     # AI integration service
│   │   ├── export-service.ts # Export functionality
│   │   └── utils.ts          # Utility functions
│   └── types/                # TypeScript type definitions
├── public/                   # Static assets
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🔧 Configuration

### AI Models Configuration
Configure AI models in the admin panel or environment variables:

```typescript
// Supported AI Models
- GPT-4 (OpenAI)
- GPT-3.5 Turbo (OpenAI)
- Gemini Pro (Google)
- Claude 3 (Anthropic)
```

### Payment Gateway Setup

#### Stripe Integration
1. Create a Stripe account
2. Get your API keys from the Stripe dashboard
3. Add keys to environment variables
4. Configure webhook endpoints

#### Razorpay Integration
1. Create a Razorpay account
2. Get your API keys from the Razorpay dashboard
3. Add keys to environment variables
4. Configure webhook endpoints

### Customization

#### Branding
- Update site name and logo in admin settings
- Customize colors and themes
- Add custom CSS for advanced styling

#### Features
- Enable/disable features in admin panel
- Configure usage limits per plan
- Set up custom domains

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- **Netlify** - Static site hosting
- **Railway** - Full-stack hosting
- **DigitalOcean** - App Platform
- **AWS** - Amplify or EC2
- **Google Cloud** - App Engine

### Production Checklist
- [ ] Set up production environment variables
- [ ] Configure custom domain
- [ ] Set up SSL certificate
- [ ] Configure database (if using external)
- [ ] Set up monitoring and analytics
- [ ] Configure backup strategy

## 📊 Usage

### For End Users
1. **Sign Up** - Create an account with email or social login
2. **Choose Plan** - Start with free plan or upgrade to premium
3. **Generate Course** - Enter course title and configure settings
4. **Customize** - Edit generated content as needed
5. **Export** - Download in PDF, PowerPoint, or SCORM format

### For Administrators
1. **Access Admin Panel** - Navigate to `/admin`
2. **Configure Settings** - Set up AI models, payment gateways
3. **Manage Users** - View and manage user accounts
4. **Monitor Analytics** - Track usage and revenue metrics

## 🔒 Security

- **Authentication** - Secure user authentication with Clerk
- **Authorization** - Role-based access control
- **Data Encryption** - End-to-end encryption for sensitive data
- **API Security** - Rate limiting and input validation
- **Compliance** - GDPR and CCPA compliant

## 📈 Analytics & Monitoring

- **User Analytics** - Track user growth and engagement
- **Revenue Tracking** - Monitor subscription revenue
- **Performance Metrics** - Application performance monitoring
- **Error Tracking** - Automatic error reporting and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the **Extended License** - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation** - [docs.coursegenie.ai](https://docs.coursegenie.ai)
- **Email Support** - support@coursegenie.ai
- **Community Forum** - [community.coursegenie.ai](https://community.coursegenie.ai)
- **Live Chat** - Available in the application

## 🎯 Roadmap

### Upcoming Features
- [ ] Advanced AI image generation
- [ ] Interactive video lessons
- [ ] Gamification elements
- [ ] Advanced analytics dashboard
- [ ] Mobile app (iOS/Android)
- [ ] API for third-party integrations
- [ ] Advanced LMS integrations
- [ ] AI-powered course recommendations

### Version History
- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added multi-language support
- **v1.2.0** - Enhanced admin dashboard
- **v1.3.0** - Added SCORM export
- **v1.4.0** - Team collaboration features

## 🙏 Acknowledgments

- **Next.js** - React framework
- **Tailwind CSS** - Utility-first CSS framework
- **Clerk** - Authentication service
- **OpenAI** - AI model provider
- **Stripe** - Payment processing
- **Razorpay** - Payment gateway

---

**CourseGenie AI** - Transform your expertise into engaging courses with AI! 🚀

Made with ❤️ for educators and content creators worldwide.

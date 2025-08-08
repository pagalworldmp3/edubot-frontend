# CourseGenie AI - Deployment Guide

This guide provides comprehensive instructions for deploying CourseGenie AI to various hosting platforms.

## 🚀 Quick Deploy Options

### 1. Vercel (Recommended - One-Click Deploy)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/coursegenie-ai)

1. Click the "Deploy with Vercel" button above
2. Connect your GitHub account
3. Configure environment variables
4. Deploy automatically

### 2. Railway (Alternative - One-Click Deploy)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/new?template=https://github.com/your-username/coursegenie-ai)

1. Click the "Deploy on Railway" button
2. Connect your GitHub account
3. Add environment variables
4. Deploy automatically

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] **API Keys Ready**
  - [ ] Clerk authentication keys
  - [ ] OpenAI API key (or other AI providers)
  - [ ] Stripe keys (if using payments)
  - [ ] Razorpay keys (if using payments)

- [ ] **Domain Ready** (optional)
  - [ ] Custom domain purchased
  - [ ] DNS access

- [ ] **Database Setup** (if using external database)
  - [ ] Database instance created
  - [ ] Connection string ready

## 🛠️ Manual Deployment

### Vercel Deployment

#### Step 1: Prepare Your Repository
```bash
# Clone the repository
git clone https://github.com/your-username/coursegenie-ai.git
cd coursegenie-ai

# Push to your GitHub repository
git remote add origin https://github.com/your-username/coursegenie-ai.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

#### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your repository
5. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

#### Step 3: Environment Variables
Add these environment variables in Vercel dashboard:

```env
# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# AI Providers
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=your_google_api_key
ANTHROPIC_API_KEY=sk-ant-...

# Payment Gateways
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_secret_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

#### Step 4: Deploy
Click "Deploy" and wait for the build to complete.

### Netlify Deployment

#### Step 1: Build Configuration
Create a `netlify.toml` file in the root directory:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NEXT_USE_NETLIFY_EDGE = "true"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Step 2: Deploy
1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login with GitHub
3. Click "New site from Git"
4. Connect your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
6. Add environment variables
7. Deploy

### Railway Deployment

#### Step 1: Prepare for Railway
Create a `railway.json` file in the root directory:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### Step 2: Deploy
1. Go to [railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Add environment variables
7. Deploy

### DigitalOcean App Platform

#### Step 1: Prepare for DigitalOcean
Create a `.do/app.yaml` file:

```yaml
name: coursegenie-ai
services:
- name: web
  source_dir: /
  github:
    repo: your-username/coursegenie-ai
    branch: main
  run_command: npm start
  build_command: npm run build
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
```

#### Step 2: Deploy
1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Connect your GitHub repository
4. Configure build settings
5. Add environment variables
6. Deploy

### AWS Amplify

#### Step 1: Prepare for AWS
Create an `amplify.yml` file in the root directory:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

#### Step 2: Deploy
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Click "New app" > "Host web app"
3. Connect your GitHub repository
4. Configure build settings
5. Add environment variables
6. Deploy

## 🔧 Environment Configuration

### Required Environment Variables

```env
# Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# AI Providers (At least one required)
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=your_google_api_key
ANTHROPIC_API_KEY=sk-ant-...

# App Configuration (Required)
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Payment Gateways (Optional)
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_secret_key

# Database (Optional)
DATABASE_URL=your_database_url

# Additional Configuration (Optional)
NEXT_PUBLIC_SITE_NAME=CourseGenie AI
NEXT_PUBLIC_SITE_DESCRIPTION=AI-Powered Course Generator
```

### Environment Variable Setup by Platform

#### Vercel
1. Go to your project dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add each variable with appropriate environment (Production, Preview, Development)

#### Netlify
1. Go to your site dashboard
2. Navigate to "Site settings" > "Environment variables"
3. Add each variable

#### Railway
1. Go to your project dashboard
2. Navigate to "Variables" tab
3. Add each variable

#### DigitalOcean
1. Go to your app dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add each variable

#### AWS Amplify
1. Go to your app dashboard
2. Navigate to "Environment variables"
3. Add each variable

## 🌐 Custom Domain Setup

### Vercel
1. Go to your project dashboard
2. Navigate to "Settings" > "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Netlify
1. Go to your site dashboard
2. Navigate to "Domain settings"
3. Add custom domain
4. Update DNS records

### Other Platforms
Follow similar steps for your chosen platform.

## 🔒 SSL Certificate

Most platforms automatically provision SSL certificates:
- **Vercel**: Automatic SSL
- **Netlify**: Automatic SSL
- **Railway**: Automatic SSL
- **DigitalOcean**: Automatic SSL
- **AWS Amplify**: Automatic SSL

## 📊 Monitoring & Analytics

### Vercel Analytics
1. Enable Vercel Analytics in your project
2. Add analytics code to your app
3. Monitor performance and errors

### Other Monitoring Options
- **Sentry**: Error tracking
- **Google Analytics**: User analytics
- **Mixpanel**: Event tracking
- **LogRocket**: Session replay

## 🔄 CI/CD Setup

### GitHub Actions
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Environment Variables Not Working
1. Check variable names (case-sensitive)
2. Ensure variables are set for correct environment
3. Redeploy after adding variables

#### Authentication Issues
1. Verify Clerk keys are correct
2. Check domain configuration in Clerk dashboard
3. Ensure redirect URLs are properly set

#### Payment Issues
1. Verify Stripe/Razorpay keys
2. Check webhook endpoints
3. Ensure test/live mode is correct

### Performance Optimization

#### Enable Caching
```typescript
// next.config.ts
module.exports = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    domains: ['your-domain.com'],
  },
}
```

#### Enable Compression
```typescript
// next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  compress: true,
})
```

## 📈 Scaling Considerations

### Horizontal Scaling
- Use multiple instances
- Implement load balancing
- Use CDN for static assets

### Database Scaling
- Use managed database services
- Implement connection pooling
- Consider read replicas

### Caching Strategy
- Implement Redis for session storage
- Use CDN for static content
- Cache API responses

## 🔐 Security Best Practices

### Environment Variables
- Never commit secrets to version control
- Use platform-specific secret management
- Rotate keys regularly

### HTTPS
- Always use HTTPS in production
- Redirect HTTP to HTTPS
- Use HSTS headers

### Authentication
- Implement proper session management
- Use secure cookies
- Enable 2FA where possible

## 📞 Support

If you encounter issues during deployment:

1. **Check Documentation**: Review platform-specific docs
2. **Community Support**: Ask in GitHub issues
3. **Professional Support**: Contact support@coursegenie.ai

## 🎯 Next Steps

After successful deployment:

1. **Test All Features**: Ensure everything works correctly
2. **Set Up Monitoring**: Configure error tracking and analytics
3. **Configure Backups**: Set up data backup strategy
4. **Performance Testing**: Run load tests
5. **Security Audit**: Review security configuration
6. **Go Live**: Announce your platform

---

**Happy Deploying! 🚀**

Your CourseGenie AI platform is now ready to transform education worldwide. 
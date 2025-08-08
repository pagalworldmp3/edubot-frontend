# 🚀 CourseGenie AI - Deployment Guide

## ✅ Pre-Deployment Checklist

### 1. Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here
CLERK_WEBHOOK_SECRET=whsec_your_clerk_webhook_secret_here

# AI Service API Keys
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Payment Gateways
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/coursegenie

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=CourseGenie AI
```

### 2. Database Setup

1. **Local PostgreSQL Setup:**
   ```bash
   # Install PostgreSQL
   # Create database
   createdb coursegenie
   
   # Run migrations
   npm run db:generate
   npm run db:push
   ```

2. **Cloud Database (Recommended):**
   - Use **Supabase**, **Neon**, or **Railway** for PostgreSQL
   - Update `DATABASE_URL` in environment variables

### 3. API Keys Setup

1. **Clerk Authentication:**
   - Sign up at [clerk.com](https://clerk.com)
   - Create a new application
   - Get your publishable and secret keys
   - Set up webhook endpoint: `https://your-domain.com/api/webhooks/clerk`

2. **OpenAI API:**
   - Sign up at [openai.com](https://openai.com)
   - Get your API key from dashboard

3. **Google AI (Gemini):**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create API key

4. **Anthropic (Claude):**
   - Sign up at [anthropic.com](https://anthropic.com)
   - Get your API key

5. **Stripe:**
   - Sign up at [stripe.com](https://stripe.com)
   - Get your publishable and secret keys

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect Repository:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

2. **Environment Variables:**
   - Go to Vercel Dashboard
   - Add all environment variables from `.env.local`

3. **Database:**
   - Use Vercel Postgres or external database
   - Update `DATABASE_URL`

### Option 2: Railway

1. **Deploy:**
   ```bash
   # Install Railway CLI
   npm i -g @railway/cli
   
   # Login and deploy
   railway login
   railway init
   railway up
   ```

2. **Environment Variables:**
   - Add in Railway dashboard

### Option 3: Netlify

1. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Environment Variables:**
   - Add in Netlify dashboard

## 🔧 Post-Deployment Setup

### 1. Database Migrations

```bash
# Run migrations on production
npm run db:generate
npm run db:push
```

### 2. Webhook Configuration

1. **Clerk Webhook:**
   - URL: `https://your-domain.com/api/webhooks/clerk`
   - Events: `user.created`, `user.updated`, `user.deleted`

2. **Stripe Webhook:**
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `customer.subscription.updated`

### 3. Domain Setup

1. **Custom Domain:**
   - Add domain in your hosting provider
   - Update `NEXT_PUBLIC_APP_URL`

2. **SSL Certificate:**
   - Most providers auto-configure SSL

## 🐛 Troubleshooting

### Common Issues:

1. **Build Errors:**
   ```bash
   # Clear cache and rebuild
   rm -rf .next
   npm run build
   ```

2. **Database Connection:**
   - Check `DATABASE_URL` format
   - Ensure database is accessible

3. **Environment Variables:**
   - Verify all required variables are set
   - Check for typos in variable names

4. **Clerk Issues:**
   - Verify publishable key starts with `pk_`
   - Check webhook endpoint is accessible

### Support:

- Check logs in your hosting provider dashboard
- Verify all environment variables are correctly set
- Test database connection

## 📊 Monitoring

1. **Analytics:**
   - Set up Google Analytics
   - Monitor application performance

2. **Error Tracking:**
   - Consider Sentry for error monitoring
   - Monitor API response times

## 🔒 Security Checklist

- [ ] All API keys are secure
- [ ] Database connection is encrypted
- [ ] Webhook endpoints are protected
- [ ] Environment variables are not exposed
- [ ] SSL certificate is active
- [ ] Rate limiting is configured

---

**🎉 Your CourseGenie AI application is now ready for deployment!** 
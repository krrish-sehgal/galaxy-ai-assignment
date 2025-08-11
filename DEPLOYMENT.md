# Vercel Deployment Guide

This guide will help you deploy your ChatGPT Clone to Vercel.

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fchatgpt-home-clone)

## 📋 Pre-deployment Checklist

### 1. **Environment Variables**

Ensure you have all required environment variables:

```bash
# Required for production
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
MEM0_API_KEY=your_mem0_api_key

# Optional
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your_secret_key
```

### 2. **Build Test**

Run a local build test before deploying:

```bash
npm run vercel:build
```

This will run linting, type checking, and build the project.

## 🎯 Deployment Steps

### Option 1: Using Vercel CLI

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Deploy to preview**

   ```bash
   npm run vercel:preview
   ```

4. **Deploy to production**
   ```bash
   npm run vercel:deploy
   ```

### Option 2: Using GitHub Integration

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "feat: prepare for vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy

## ⚙️ Vercel Configuration

The project includes a `vercel.json` file with optimized settings:

- **Framework**: Next.js 15
- **Build Command**: `npm run build`
- **Functions**: 30s timeout for API routes
- **Headers**: CORS configuration for API routes
- **Regions**: `iad1` (US East)

## 🔧 Environment Variables Setup in Vercel

1. Go to your project dashboard on Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add each environment variable:

| Variable                       | Description               | Required |
| ------------------------------ | ------------------------- | -------- |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google Gemini API key     | ✅       |
| `MONGODB_URI`                  | MongoDB connection string | ✅       |
| `CLOUDINARY_CLOUD_NAME`        | Cloudinary cloud name     | ✅       |
| `CLOUDINARY_API_KEY`           | Cloudinary API key        | ✅       |
| `CLOUDINARY_API_SECRET`        | Cloudinary API secret     | ✅       |
| `MEM0_API_KEY`                 | Mem0 API key              | ✅       |
| `NEXT_PUBLIC_APP_URL`          | Your app URL              | ⚠️       |
| `NEXTAUTH_SECRET`              | NextAuth secret           | ⚠️       |

## 📱 Performance Optimizations

The project is configured with:

- **Image Optimization**: WebP and AVIF formats
- **SWC Minification**: Faster builds
- **Compression**: Gzip compression enabled
- **External Packages**: Mongoose configured for serverless
- **Font Optimization**: Inter font with display swap

## 🔍 Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check TypeScript errors: `npm run type-check`
   - Check ESLint errors: `npm run lint`
   - Verify environment variables are set

2. **API Route Timeouts**
   - API routes have 30s timeout limit
   - Optimize database queries
   - Use connection pooling for MongoDB

3. **Image Loading Issues**
   - Verify Cloudinary configuration
   - Check image domain allowlist in `next.config.mjs`

4. **Font Loading**
   - Using Inter font for better compatibility
   - Font display: swap for faster loading

## 🚀 Post-Deployment

After successful deployment:

1. **Test all features**
   - Chat functionality
   - File uploads
   - Memory system
   - Theme switching

2. **Monitor performance**
   - Check Vercel Analytics
   - Monitor API route performance
   - Check error logs

3. **Set up domain** (optional)
   - Configure custom domain in Vercel
   - Update `NEXT_PUBLIC_APP_URL` environment variable

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)

---

**Need help?** Check the [troubleshooting section](#-troubleshooting) or create an issue in the repository.

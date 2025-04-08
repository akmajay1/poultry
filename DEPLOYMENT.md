# Shree Pratap Poultry Farm - Deployment Guide

This guide explains how to deploy the complete application with both frontend and backend services.

## Frontend Deployment (Vercel)

The frontend is currently deployed on Vercel in demo mode. This means it works without a real backend connection and uses mock data for demonstration purposes.

### How to deploy to Vercel:

1. **Push your code to GitHub**
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select "frontend" as the root directory
   - Set the build command: `npm run build`
   - Set the output directory: `build`

3. **Environment Variables**:
   - Set `REACT_APP_API_URL` to point to your backend URL when you deploy it
   - For now, it's in demo mode (no need to set this variable)

## Backend Deployment

For a complete production deployment, you need to deploy the backend API and connect it to a MongoDB database.

### Option 1: Deploy Backend to Railway

1. **Create a Railway Account**:
   - Go to [railway.app](https://railway.app)
   - Sign up and create a new project

2. **Setup MongoDB**:
   - Add a MongoDB service to your project
   - Railway will automatically provide a connection string

3. **Deploy Node.js Backend**:
   - Connect your GitHub repository
   - Set the root directory to "backend"
   - Set these environment variables:
     ```
     NODE_ENV=production
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_secure_jwt_secret
     FRONTEND_URL=your_vercel_frontend_url
     ```

4. **Update Frontend Configuration**:
   - Go back to your Vercel frontend deployment
   - Set `REACT_APP_API_URL` to your Railway backend URL
   - Redeploy the frontend

### Option 2: Deploy to Render

1. **Create a Render Account**:
   - Go to [render.com](https://render.com)
   - Sign up and create a new Web Service

2. **Setup MongoDB Atlas**:
   - Create an account at [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create a new cluster
   - Get your connection string

3. **Deploy Node.js Backend**:
   - Connect to your GitHub repository
   - Set the root directory to "backend"
   - Set the start command: `node server.js`
   - Add the environment variables as in Option 1

## Converting from Demo Mode to Production

When you have deployed your backend:

1. Update your frontend's environment variable `REACT_APP_API_URL` to point to your backend
2. The application will automatically switch from demo mode to production mode
3. Real API calls will be made instead of using mock data

## Database Setup

For a complete setup, you need to populate your MongoDB database with initial data:

1. The application will automatically create default admin and customer users when first started
2. Default admin credentials: 
   - Username: "akhilesh" 
   - Password: "Pratap2425,"
3. Default customer credentials:
   - Username: "my lifeline"
   - Password: "customer123"

## Need Help?

If you need assistance with deployment, contact our support team. 
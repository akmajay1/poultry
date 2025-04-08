# Shree Pratap Poultry Farm Website

A comprehensive dashboard system for managing a poultry farm business, with features for tracking chick mortality, fraud detection, and business management.

## Project Overview

This web application serves as a complete management system for Shree Pratap Poultry Farm, featuring:

- Secure login system with Admin and Customer roles
- Dashboard for tracking chick mortality
- Proof submission system with fraud detection
- Invoice and business deal management
- Multilingual support (Hindi/English)
- Responsive design for mobile and desktop

## Project Structure

```
/
├── frontend/            # React frontend application
│   ├── public/          # Static assets
│   └── src/             # React source code
├── backend/             # Node.js Express backend
│   ├── controllers/     # API controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   └── utils/           # Utility functions
├── .env.example         # Example environment variables
└── README.md           # Project documentation
```

## Technology Stack

- **Frontend**: React.js with Material UI
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Vercel (Frontend), Railway/Render (Backend)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB installation)

### Installation

1. Clone the repository
2. Set up environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Update the variables with your MongoDB connection string and other configurations

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

### Backend Setup

```bash
cd backend
npm install
npm start
```

## Deployment

For complete deployment instructions with visual guides:
- [Hosting Guide](./docs/HOSTING_GUIDE.md) 📘

Key requirements:
- MongoDB Atlas cluster configured
- Domain purchased and DNS configured
- Environment variables set in both platforms

### Quick Links
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Railway Projects](https://railway.app/projects)
- [MongoDB Atlas](https://cloud.mongodb.com)

## Features

- **Dashboard**: Real-time metrics and business overview
- **Proof Submission**: Image uploads with timestamp and geolocation
- **Fraud Detection**: Automated system to detect duplicate or suspicious submissions
- **Invoice Management**: Create, view, and manage invoices
- **Business Deal Tracking**: Record and monitor business transactions
- **Multilingual Support**: Toggle between Hindi/English

## Troubleshooting

Common issues and solutions:
1. **Deployment Failures**:
   - Verify all environment variables
   - Check platform build logs
   - Ensure correct Node.js version (v18+)

2. **Database Connection Issues**:
   - Whitelist IP in MongoDB Atlas
   - Verify connection string format

3. **Image Upload Errors**:
   - Check file size (<5MB)
   - Verify image format (JPEG/PNG)

Full troubleshooting guide: [Hosting Documentation](./docs/HOSTING_GUIDE.md#verification-steps)

## Verification Checklist

✅ Test frontend/backend connectivity
✅ Validate HTTPS enforcement
✅ Confirm automated fraud detection runs
✅ Test multilingual functionality
✅ Verify daily report generation

## User Credentials

- **Admin**: ID - "akhilesh", Password - "Pratap2425,"
- **Test Customer**: ID - "my lifeline", Password - (set during initial setup)
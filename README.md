# 🎨 Creative Mark - Business Management System

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=flat)](#)

A comprehensive business management system for Creative Mark, featuring client management, application processing, payment handling, real-time chat, and multi-language support (English/Arabic).

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

Creative Mark BMS is a full-stack monorepo application designed to streamline business operations. The system provides role-based access control for Admins, Employees, Partners, and Clients, with features ranging from application management to real-time communication.

### Key Highlights

- **Multi-tenant Architecture**: Role-based access (Admin, Employee, Partner, Client)
- **Real-time Communication**: Socket.IO powered chat and notifications
- **Internationalization**: Full English and Arabic support with RTL layout
- **Payment Management**: Installment tracking, invoice generation, and PDF export
- **Document Management**: File upload, preview, and secure storage
- **Responsive Design**: Mobile-first approach with Tailwind CSS

---

## ✨ Features

### 👤 User Management
- User registration and authentication (JWT-based)
- Role-based access control (RBAC)
- Profile management with image upload
- Multi-language user interface

### 📝 Application Processing
- Service type selection (visa, license, tax, legal, etc.)
- Multi-step application forms with validation
- Document upload and management
- Application status tracking and history
- Admin/Employee application review and processing

### 💳 Payment System
- Multiple payment plans (Full payment, Installments)
- Receipt upload and verification
- Invoice generation with PDF export
- Installment tracking and reminders
- Payment history and analytics

### 💬 Communication
- Real-time chat system with Socket.IO
- File sharing in conversations
- Unread message notifications
- Message search and filtering
- Online/offline status indicators

### 📊 Dashboard & Analytics
- Role-specific dashboards
- Application statistics
- Payment analytics
- User activity tracking
- Revenue reports

### 🧾 Invoice System
- Professional invoice generation
- Multi-language invoices (EN/AR)
- Print-optimized layouts
- PDF download functionality
- Company branding integration

---

## 🛠️ Tech Stack

### Frontend (`creative-mark-bm`)
- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript/JSX
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Real-time**: Socket.IO Client
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **PDF Generation**: html2pdf.js
- **i18n**: Custom Translation Context

### Backend (`creative-mark-backend`)
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer
- **Real-time**: Socket.IO
- **Security**: bcryptjs, CORS, Helmet
- **Validation**: Custom middleware

### Development Tools
- **Testing**: Jest + Supertest (Backend), React Testing Library (Frontend)
- **Code Quality**: ESLint
- **Version Control**: Git
- **Package Manager**: npm

---

## 📁 Project Structure

```
creativemark-bms/
├── creative-mark-bm/          # Next.js Frontend Application
│   ├── public/                # Static assets (images, logos, locales)
│   ├── src/
│   │   ├── app/              # Next.js App Router pages
│   │   │   ├── admin/        # Admin dashboard
│   │   │   ├── client/       # Client dashboard
│   │   │   ├── employee/     # Employee dashboard
│   │   │   ├── partner/      # Partner dashboard
│   │   │   └── layout.js     # Root layout with providers
│   │   ├── components/       # Reusable React components
│   │   │   ├── admin/        # Admin-specific components
│   │   │   ├── client/       # Client-specific components
│   │   │   └── shared/       # Shared components
│   │   ├── contexts/         # React Context providers
│   │   │   ├── AuthContext.js
│   │   │   ├── SocketContext.js
│   │   │   └── MessageNotificationContext.js
│   │   ├── i18n/            # Internationalization
│   │   │   └── TranslationContext.js
│   │   ├── services/        # API service layer
│   │   └── __tests__/       # Frontend tests
│   ├── package.json
│   └── README.md            # Frontend documentation
│
├── creative-mark-backend/     # Express.js Backend API
│   ├── config/               # Configuration files
│   │   └── db.js            # MongoDB connection
│   ├── controllers/          # Route controllers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── applicationController.js
│   │   ├── paymentController.js
│   │   └── chatController.js
│   ├── middleware/          # Express middleware
│   │   ├── auth.js          # JWT authentication
│   │   ├── roleCheck.js     # Role authorization
│   │   └── upload.js        # File upload handling
│   ├── models/              # Mongoose schemas
│   │   ├── User.js
│   │   ├── Application.js
│   │   ├── Payment.js
│   │   └── Chat.js
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   ├── uploads/             # Uploaded files storage
│   ├── __tests__/           # Backend tests
│   ├── server.js            # Entry point
│   ├── package.json
│   └── README.md            # Backend documentation
│
├── .gitignore
├── package.json             # Root package.json (if using workspaces)
└── README.md               # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **MongoDB** 6.x or higher (local or Atlas)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd creativemark-bms
   ```

2. **Install Backend Dependencies**
   ```bash
   cd creative-mark-backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../creative-mark-bm
   npm install
   ```

4. **Set up Environment Variables**

   Create `.env` files in both directories:

   **Backend (`creative-mark-backend/.env`)**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/creativemark
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

   **Frontend (`creative-mark-bm/.env.local`)**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   ```

5. **Start Development Servers**

   **Terminal 1 - Backend:**
   ```bash
   cd creative-mark-backend
   npm run dev
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd creative-mark-bm
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

---

## 🔧 Environment Setup

### MongoDB Setup

#### Option 1: Local MongoDB
```bash
# Install MongoDB locally
# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Connection string
MONGODB_URI=mongodb://localhost:27017/creativemark
```

#### Option 2: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `.env` with your connection string

### File Upload Configuration

Ensure the `uploads/` directory exists in the backend:
```bash
cd creative-mark-backend
mkdir -p uploads/profiles uploads/documents uploads/receipts
```

---

## 💻 Development

### Frontend Development

```bash
cd creative-mark-bm

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Backend Development

```bash
cd creative-mark-backend

# Development with auto-reload
npm run dev

# Production mode
npm start

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Code Organization Best Practices

1. **Components**: Create reusable components in `src/components/`
2. **API Services**: Centralize API calls in `src/services/`
3. **Contexts**: Use Context API for global state
4. **Controllers**: Keep business logic in backend controllers
5. **Middleware**: Use middleware for cross-cutting concerns
6. **Models**: Define clear Mongoose schemas

---

## 🧪 Testing

### Backend Testing (Jest + Supertest)

```bash
cd creative-mark-backend

# Run all tests
npm test

# Run specific test file
npm test -- auth.test.js

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Frontend Testing (React Testing Library)

```bash
cd creative-mark-bm

# Run all tests
npm test

# Run specific test
npm test -- LoadingSpinner.test.jsx

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Structure

```
__tests__/
├── unit/           # Unit tests
├── integration/    # Integration tests
└── e2e/           # End-to-end tests (future)
```

---

## 📦 Deployment

### Frontend Deployment (Vercel)

1. **Connect to Vercel**
   ```bash
   cd creative-mark-bm
   npm install -g vercel
   vercel
   ```

2. **Environment Variables**
   - Add all `.env.local` variables to Vercel dashboard
   - Update `NEXT_PUBLIC_API_URL` to production backend URL

3. **Build Settings**
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Backend Deployment (Railway/Render/AWS)

1. **Build the application**
   ```bash
   cd creative-mark-backend
   npm install --production
   ```

2. **Environment Variables**
   - Set all production environment variables
   - Update `FRONTEND_URL` to production frontend URL
   - Use production MongoDB URI

3. **Start Command**
   ```bash
   npm start
   ```

### Docker Deployment (Optional)

```dockerfile
# Dockerfile for backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

---

## 📚 Documentation

### Additional Resources

- [Frontend Documentation](./creative-mark-bm/README.md) - Detailed frontend guide
- [Backend Documentation](./creative-mark-backend/README.md) - API and backend architecture
- [API Documentation](#) - API endpoints and usage (coming soon)
- [User Guide](#) - End-user documentation (coming soon)

### Key Features Documentation

#### Authentication Flow
1. User registers with role selection
2. JWT token issued upon login
3. Token stored in localStorage (frontend)
4. Protected routes validate token via middleware
5. Role-based access control enforced

#### Payment Processing
1. Client creates payment (full/installments)
2. Receipt upload
3. Admin/Employee verification
4. Status updates and notifications
5. Invoice generation

#### Real-time Chat
1. Socket.IO connection on auth
2. Room-based messaging
3. File sharing support
4. Typing indicators
5. Message notifications

---

## 🤝 Contributing

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

3. **Push to remote**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create Pull Request**
   - Describe changes clearly
   - Reference related issues
   - Ensure tests pass

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding/updating tests
- `chore:` - Maintenance tasks

### Code Style

- **JavaScript**: Follow ESLint configuration
- **Formatting**: Use Prettier (if configured)
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Files**: Descriptive names, proper organization

---

## 🔐 Security

### Best Practices Implemented

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ CORS configuration
- ✅ Input validation and sanitization
- ✅ Role-based access control
- ✅ Secure file upload handling
- ✅ Environment variable management
- ✅ HTTPS enforcement (production)

### Security Checklist

- [ ] Regular dependency updates
- [ ] Security audit with `npm audit`
- [ ] Rate limiting on API endpoints
- [ ] XSS protection
- [ ] CSRF protection
- [ ] SQL/NoSQL injection prevention
- [ ] Secure session management

---

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```bash
# Check if MongoDB is running
mongosh

# Restart MongoDB
brew services restart mongodb-community  # macOS
sudo systemctl restart mongod            # Linux
```

**2. Port Already in Use**
```bash
# Find process using port
lsof -i :3000  # Frontend
lsof -i :5000  # Backend

# Kill process
kill -9 <PID>
```

**3. Module Not Found**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**4. Socket Connection Issues**
- Verify `NEXT_PUBLIC_SOCKET_URL` in frontend `.env.local`
- Check CORS settings in backend
- Ensure both servers are running

---

## 📊 Project Status

### Current Version: 1.0.0

### Completed Features
- ✅ User authentication and authorization
- ✅ Application management system
- ✅ Payment processing with installments
- ✅ Real-time chat system
- ✅ Invoice generation (EN/AR)
- ✅ Multi-language support
- ✅ Responsive design
- ✅ File upload and management

### Upcoming Features
- 🔄 Email notifications
- 🔄 SMS notifications
- 🔄 Advanced analytics dashboard
- 🔄 Report generation
- 🔄 Mobile app (React Native)
- 🔄 Advanced search and filters
- 🔄 Audit logs

---

## 👥 Team

- **Project Lead**: [Name]
- **Frontend Development**: [Team]
- **Backend Development**: [Team]
- **UI/UX Design**: [Team]
- **QA Testing**: [Team]

---

## 📄 License

**Proprietary License** - All rights reserved.

This software is the property of Creative Mark. Unauthorized copying, distribution, or modification of this software, via any medium, is strictly prohibited.

For licensing inquiries, contact: [contact@creativemark.com](mailto:creativemarkimad@gmail.com)

---

## 📞 Support

For support and questions:

- **Email**: kimad1728@gmail.com
- **Documentation**: [Link to docs]
- **Issue Tracker**: [GitHub Issues]

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the database solution
- Socket.IO for real-time capabilities
- Tailwind CSS for styling utilities
- All contributors and team members

---

<div align="center">

**Built with ❤️ by Imad Hussain Khan**

[Website](#) • [Documentation](#) • [Report Bug](#) • [Request Feature](#)

</div>


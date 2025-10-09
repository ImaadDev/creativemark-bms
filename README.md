# 🎯 Creative Mark BMS - Business Management System

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-green?style=for-the-badge&logo=mongodb)
![React](https://img.shields.io/badge/React-19.1-blue?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?style=for-the-badge&logo=tailwind-css)

**A comprehensive business management system for managing clients, applications, tasks, and communications**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 About

Creative Mark Business Management System (BMS) is a full-stack web application designed to streamline business operations including client management, application processing, task tracking, employee coordination, partner collaboration, and customer support.

### 🎯 Key Features

- **🔐 Multi-Role System** - Admin, Client, Employee, and Partner roles
- **📋 Application Management** - Complete workflow from submission to approval
- **✅ Task Tracking** - Assign and monitor tasks across teams
- **💬 Real-time Communication** - Socket.io powered messaging
- **🎫 Support Tickets** - Integrated ticketing system
- **💰 Payment Processing** - Track and manage payments
- **📊 Reports & Analytics** - Comprehensive business insights
- **🌍 Multi-language** - English and Arabic support
- **📱 Responsive Design** - Works on all devices
- **🧪 Fully Tested** - 45+ passing tests

---

## 🏗️ Architecture

This is a monorepo containing both frontend and backend applications:

```
creativemark-bms/
├── creative-mark-backend/    # Node.js + Express API
├── creative-mark-bm/         # Next.js Frontend
├── TESTING_GUIDE.md          # Testing documentation
├── JEST_CHEATSHEET.md        # Jest quick reference
└── README.md                 # This file
```

### 🔧 Technology Stack

#### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.18
- **Database:** MongoDB 7.x with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Real-time:** Socket.io 4.8
- **File Storage:** Cloudinary
- **Email:** Nodemailer + Resend
- **Testing:** Jest + Supertest

#### Frontend
- **Framework:** Next.js 15.5 (App Router)
- **UI Library:** React 19.1
- **Styling:** TailwindCSS 4.x
- **State Management:** React Context API
- **Real-time:** Socket.io-client 4.8
- **i18n:** next-intl 4.3
- **Charts:** Chart.js 4.5
- **Animations:** Framer Motion 12.23
- **Testing:** Jest + React Testing Library

---

## ✨ Features

### For Admins
- 👥 User management (create, update, delete)
- 📋 Application review and approval
- ✅ Task assignment and monitoring
- 💼 Employee and client management
- 💰 Payment oversight
- 📊 System reports and analytics
- ⚙️ System configuration

### For Clients
- 📝 Submit applications with document upload
- 📍 Track application status in real-time
- 💳 View payment history
- 🎫 Create support tickets
- 📧 Receive notifications
- 👤 Profile management

### For Employees
- ✅ View and manage assigned tasks
- 📋 Process client applications
- 💬 Communicate with clients
- 📊 Generate reports
- 🎫 Handle support tickets
- 🔔 Real-time notifications

### For Partners
- 📋 Access assigned tasks
- 📁 Upload documents
- 💬 Communication hub
- 💰 View billing information
- 📊 Access reports
- 👤 Profile management

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** v7 or higher
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/creativemark-bms.git
   cd creativemark-bms
   ```

2. **Backend Setup**
   ```bash
   cd creative-mark-backend
   npm install
   
   # Create .env file and configure
   cp .env.example .env
   # Edit .env with your configuration
   
   # Start backend server
   npm run dev
   ```
   
   Backend runs on: `http://localhost:5000`

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd creative-mark-bm
   npm install
   
   # Create .env.local file and configure
   cp .env.example .env.local
   # Edit .env.local with your configuration
   
   # Start frontend server
   npm run dev
   ```
   
   Frontend runs on: `http://localhost:3000`

4. **Access the Application**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)
   - API Health: [http://localhost:5000/api/status/health](http://localhost:5000/api/status/health)

---

## 🔐 Environment Variables

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/creativemark-bms

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Frontend URL
CLIENT_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
RESEND_API_KEY=your_resend_api_key
```

### Frontend (.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📚 Documentation

- **[Backend README](./creative-mark-backend/README.md)** - Backend API documentation
- **[Frontend README](./creative-mark-bm/README.md)** - Frontend documentation
- **[Testing Guide](./TESTING_GUIDE.md)** - Comprehensive testing guide
- **[Jest Cheatsheet](./JEST_CHEATSHEET.md)** - Quick reference for Jest

---

## 🧪 Testing

The project includes comprehensive test suites for both frontend and backend.

### Run All Tests

```bash
# Backend tests
cd creative-mark-backend
npm test

# Frontend tests
cd creative-mark-bm
npm test
```

### Test Coverage

- ✅ **Backend:** 14 tests passing
- ✅ **Frontend:** 31 tests passing
- ✅ **Total:** 45 tests passing

### Test Commands

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

For detailed testing instructions, see [TESTING_GUIDE.md](./TESTING_GUIDE.md)

---

## 📁 Project Structure

```
creativemark-bms/
│
├── creative-mark-backend/           # Backend API
│   ├── config/                      # Configuration files
│   ├── controllers/                 # Request handlers
│   ├── middlewares/                 # Custom middleware
│   ├── models/                      # Mongoose schemas
│   ├── routes/                      # API routes
│   ├── utils/                       # Utility functions
│   ├── __tests__/                   # Test files
│   ├── server.js                    # Entry point
│   └── README.md                    # Backend docs
│
├── creative-mark-bm/                # Frontend Application
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── app/                     # Next.js pages
│   │   │   ├── admin/              # Admin dashboard
│   │   │   ├── client/             # Client dashboard
│   │   │   ├── employee/           # Employee dashboard
│   │   │   └── partner/            # Partner dashboard
│   │   ├── components/              # React components
│   │   ├── contexts/                # Context providers
│   │   ├── hooks/                   # Custom hooks
│   │   ├── services/                # API services
│   │   ├── utils/                   # Utility functions
│   │   └── __tests__/               # Test files
│   └── README.md                    # Frontend docs
│
├── TESTING_GUIDE.md                 # Testing documentation
├── JEST_CHEATSHEET.md               # Jest quick reference
├── TEST_SETUP_SUMMARY.md            # Test setup overview
└── README.md                        # This file
```

---

## 🎨 Screenshots

### Admin Dashboard
![Admin Dashboard](./docs/screenshots/admin-dashboard.png)

### Client Application Form
![Application Form](./docs/screenshots/application-form.png)

### Task Management
![Task Management](./docs/screenshots/task-management.png)

### Real-time Messaging
![Messaging](./docs/screenshots/messaging.png)

---

## 🔧 Development Workflow

### 1. Start Development Servers

```bash
# Terminal 1 - Backend
cd creative-mark-backend
npm run dev

# Terminal 2 - Frontend
cd creative-mark-bm
npm run dev

# Terminal 3 - MongoDB (if local)
mongod
```

### 2. Make Changes

- Backend: Edit files in `creative-mark-backend/`
- Frontend: Edit files in `creative-mark-bm/src/`
- Both servers support hot reload

### 3. Run Tests

```bash
# Run tests as you develop
npm test

# Or use watch mode
npm run test:watch
```

### 4. Commit Changes

```bash
git add .
git commit -m "Add: your feature description"
git push origin your-branch
```

---

## 🚀 Deployment

### Recommended Setup

- **Frontend:** Vercel
- **Backend:** Railway / Heroku / Render
- **Database:** MongoDB Atlas
- **File Storage:** Cloudinary

### Quick Deploy

#### Frontend (Vercel)

```bash
cd creative-mark-bm
vercel
```

#### Backend (Railway)

1. Connect GitHub repository to Railway
2. Add MongoDB plugin
3. Configure environment variables
4. Deploy!

For detailed deployment instructions, see individual README files.

---

## 🔒 Security

- ✅ JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ Environment variable protection
- ✅ MongoDB injection prevention
- ✅ Rate limiting (recommended to add)
- ✅ HTTPS in production

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Reset password request
- `GET /api/auth/me` - Get current user

### Applications
- `GET /api/applications` - List applications
- `POST /api/applications` - Create application
- `GET /api/applications/:id` - Get application
- `PUT /api/applications/:id` - Update application
- `POST /api/applications/:id/submit` - Submit application

### Tasks
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `GET /api/tasks/my-tasks` - Get assigned tasks

### More endpoints...

See [Backend README](./creative-mark-backend/README.md) for complete API documentation.

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Write/update tests**
5. **Run tests**
   ```bash
   npm test
   ```
6. **Commit your changes**
   ```bash
   git commit -m "Add: amazing feature"
   ```
7. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
8. **Open a Pull Request**

### Commit Convention

- `Add:` - New features
- `Fix:` - Bug fixes
- `Update:` - Updates to existing features
- `Refactor:` - Code refactoring
- `Docs:` - Documentation changes
- `Test:` - Test additions or updates

---

## 📝 Roadmap

### Version 1.1 (Planned)
- [ ] Calendar integration
- [ ] Advanced analytics dashboard
- [ ] Export reports to PDF/Excel
- [ ] Email templates customization
- [ ] Two-factor authentication
- [ ] Mobile app (React Native)

### Version 1.2 (Future)
- [ ] AI-powered task suggestions
- [ ] Advanced search with filters
- [ ] Integration with third-party services
- [ ] Webhook support
- [ ] Custom workflow builder
- [ ] White-label support

---

## 🐛 Known Issues

See [GitHub Issues](https://github.com/yourusername/creativemark-bms/issues) for current bugs and feature requests.

---

## 📜 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Project Lead** - [Your Name](https://github.com/yourusername)
- **Backend Developer** - [Name](https://github.com/username)
- **Frontend Developer** - [Name](https://github.com/username)
- **UI/UX Designer** - [Name](https://github.com/username)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Express.js](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [Socket.io](https://socket.io/) - Real-time communication
- [Cloudinary](https://cloudinary.com/) - File storage
- All open-source contributors

---

## 📞 Support

- **Email:** support@creativemark.com
- **Documentation:** [docs.creativemark.com](https://docs.creativemark.com)
- **Issues:** [GitHub Issues](https://github.com/yourusername/creativemark-bms/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/creativemark-bms/discussions)

---

## 🌟 Star History

If you find this project useful, please consider giving it a ⭐ on GitHub!

---

## 📈 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/creativemark-bms?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/creativemark-bms?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/creativemark-bms)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/creativemark-bms)

---

<div align="center">

**[⬆ back to top](#-creative-mark-bms---business-management-system)**

Made with ❤️ by Creative Mark Team

**[Backend README](./creative-mark-backend/README.md)** • **[Frontend README](./creative-mark-bm/README.md)** • **[Testing Guide](./TESTING_GUIDE.md)**

</div>


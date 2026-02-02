# 🚀 Alquiler Motos - Motorcycle Rental Management System

A comprehensive web application for managing motorcycle rentals, built with Next.js 16, TypeScript, and Prisma. Features role-based access control, payment processing, invoice generation, and administrative dashboards.

## ✨ Features

### 🔐 Authentication & Authorization
- **OAuth Integration**: Google, Apple, Facebook login
- **Role-based Access Control**: Admin, Operator, Client roles
- **Two-Factor Authentication (2FA)**: TOTP with QR codes and backup codes
- **Phone Verification**: OTP verification system
- **Secure Sessions**: NextAuth.js with encrypted JWT tokens

### 🏍️ Motorcycle Management
- **Inventory Management**: Add, edit, and track motorcycles
- **Contract Management**: Create and manage rental contracts
- **Payment Processing**: MercadoPago integration
- **Invoice Generation**: PDF invoices with AFIP integration
- **Alert System**: Automated notifications for due dates and renewals

### 📊 Dashboard & Analytics
- **Admin Dashboard**: Comprehensive overview with charts
- **Revenue Analytics**: Income tracking and visualization
- **Client Management**: Customer database with verification
- **Payment Tracking**: Complete payment history and status

### 👤 User Management
- **Profile Management**: Complete user profiles with verification badges
- **Password Management**: Secure password changes with validation
- **Device Management**: Session tracking and security monitoring
- **Email Notifications**: Automated email communications

### 🔧 Technical Features
- **Progressive Web App (PWA)**: Offline-capable mobile experience
- **Cron Jobs**: Automated background tasks for renewals and billing
- **API Integration**: RESTful API with proper error handling
- **Database**: PostgreSQL with Prisma ORM
- **Email Service**: SendGrid integration for notifications
- **Document Generation**: PDF creation with custom templates

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js 5
- **Payments**: MercadoPago
- **Email**: SendGrid
- **PDF Generation**: PDFKit
- **2FA**: Speakeasy (TOTP)
- **Deployment**: Vercel-ready

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Environment variables configured

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd alquiler-motos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with required variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/alquiler_motos"

   # Authentication
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"

   # OAuth Providers (optional)
   GOOGLE_CLIENT_ID="..."
   GOOGLE_CLIENT_SECRET="..."
   APPLE_CLIENT_ID="..."
   APPLE_CLIENT_SECRET="..."
   FACEBOOK_CLIENT_ID="..."
   FACEBOOK_CLIENT_SECRET="..."

   # Payments
   MERCADOPAGO_ACCESS_TOKEN="..."

   # Email
   SENDGRID_API_KEY="..."

   # AFIP Integration
   AFIP_CERT="..."
   AFIP_KEY="..."
   AFIP_CUIT="..."

   # Other
   RETOOL_API_KEY="..."  # For external integrations
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma db push

   # Seed with test data
   npm run seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

### Quick Start Testing

1. **Check Configuration**
   ```bash
   npm run test:env
   ```

2. **Test Database**
   ```bash
   npm run test:db
   ```

3. **Test Authentication**
   ```bash
   npm run test:auth
   ```

4. **Run Full Backend Tests**
   ```bash
   npm run test:backend
   ```

5. **Run All Tests**
   ```bash
   npm run test:all
   ```

### Manual Testing Checklist

For comprehensive testing including UI interactions, authentication flows, and integration testing, see [`TESTING_CHECKLIST.md`](TESTING_CHECKLIST.md).

### Test User Accounts

- **Admin**: `admin@example.com` / `admin123`
- **Client**: `juan@example.com` / `cliente123`
- **Operator**: `maria@example.com` / `operador123`

### Testing Environment Setup

1. Ensure PostgreSQL is running
2. Copy `.env.example` to `.env.local` and configure
3. Run database migrations: `npx prisma db push`
4. Seed test data: `npm run seed`
5. Start server: `npm run dev`
6. Run tests: `npm run test:all`

## 📋 Available Scripts

### Core Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with test data

### Testing Scripts
- `npm run test:env` - Check environment configuration
- `npm run test:db` - Test database connectivity and data
- `npm run test:auth` - Test authentication system
- `npm run test:backend` - Run comprehensive backend tests
- `npm run test:all` - Run all tests in sequence

## 🏗️ Project Structure

```
src/
├── app/
│   ├── admin/          # Admin dashboard pages
│   ├── api/            # API routes
│   ├── components/     # Reusable UI components
│   ├── perfil/         # User profile pages
│   └── ...
├── auth.ts             # Authentication configuration
├── lib/                # Utility functions and configurations
│   ├── prisma.ts       # Database client
│   ├── authz.ts        # Authorization helpers
│   ├── email.ts        # Email service
│   └── ...
└── middleware.ts       # Next.js middleware
```

## 🔒 Security Features

- **Input Validation**: Comprehensive validation with Zod schemas
- **SQL Injection Protection**: Parameterized queries with Prisma
- **XSS Protection**: Content Security Policy headers
- **CSRF Protection**: NextAuth.js built-in protection
- **Rate Limiting**: API rate limiting for sensitive endpoints
- **Audit Logging**: Security event tracking

## 📱 API Endpoints

### Public Endpoints (No Auth Required)
- `GET /api/public/motos` - List available motorcycles
- `GET /api/public/alertas` - Public alerts

### Protected Endpoints
- `/api/auth/*` - Authentication routes
- `/api/usuarios/*` - User management
- `/api/clientes/*` - Client management
- `/api/motos/*` - Motorcycle inventory
- `/api/contratos/*` - Contract management
- `/api/pagos/*` - Payment processing
- `/api/facturas/*` - Invoice management
- `/api/dashboard/*` - Analytics and reporting

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
Ensure all production environment variables are set:
- Database connection string
- OAuth provider credentials
- Payment processor keys
- Email service credentials
- Security secrets

## 🔧 Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Prettier for consistent formatting
- Husky pre-commit hooks

### Database Migrations
```bash
# Create new migration
npx prisma migrate dev --name migration-name

# Apply migrations
npx prisma db push
```

### Testing
- Unit tests with Jest
- Integration tests for API endpoints
- E2E tests with Playwright (planned)

## 📊 Monitoring & Analytics

- **Application Monitoring**: Vercel Analytics integration
- **Error Tracking**: Sentry integration (recommended)
- **Database Monitoring**: Prisma query logging
- **Performance Monitoring**: Core Web Vitals tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper TypeScript types
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For technical support or questions:
- Check the documentation files in the `docs/` folder
- Review existing issues and pull requests
- Create a new issue with detailed information

## 🔄 Recent Updates

- ✅ Complete authentication system with OAuth
- ✅ Role-based authorization middleware
- ✅ User profile management with 2FA
- ✅ Comprehensive admin dashboard
- ✅ Payment integration with MercadoPago
- ✅ Invoice generation with AFIP
- ✅ Automated alert system
- ✅ PWA capabilities
- ✅ Cron job automation

---

**Built with ❤️ using Next.js and modern web technologies**

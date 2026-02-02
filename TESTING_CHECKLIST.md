# 🧪 Backend Testing Checklist

## Pre-Testing Setup

- [ ] Ensure Node.js 18+ is installed
- [ ] Ensure PostgreSQL is running
- [ ] Copy `.env.example` to `.env.local` and fill required values
- [ ] Run `npm install` to install dependencies
- [ ] Run `npx prisma generate` to generate Prisma client
- [ ] Run `npx prisma db push` to sync database schema
- [ ] Run `npm run seed` to populate test data
- [ ] Run `npm run dev` to start development server

## Automated Testing

- [ ] Run `./test-backend.sh` for comprehensive automated tests
- [ ] Verify all automated tests pass
- [ ] Check for any error messages in console output

## Manual Authentication Testing

### Admin User Testing
- [ ] Visit `http://localhost:3000/login-admin`
- [ ] Login with admin credentials: `admin@example.com` / `admin123`
- [ ] Verify successful login and redirect to admin dashboard
- [ ] Check admin dashboard loads with data
- [ ] Test navigation between admin sections (users, clients, contracts, etc.)
- [ ] Verify logout functionality

### Client User Testing
- [ ] Visit `http://localhost:3000/login`
- [ ] Login with client credentials: `juan@example.com` / `cliente123`
- [ ] Verify successful login and redirect
- [ ] Check that client can only see their own data
- [ ] Verify client cannot access admin areas
- [ ] Test logout functionality

### User Registration Testing
- [ ] Visit `http://localhost:3000/registro`
- [ ] Fill registration form with valid data
- [ ] Verify account creation success
- [ ] Test login with new credentials
- [ ] Verify new user has "cliente" role

## API Endpoint Testing

### Public Endpoints (No Auth Required)
- [ ] GET `/api/public/motos` - Returns motorcycle list
- [ ] GET `/api/public/alertas` - Returns public alerts

### Admin-Only Endpoints
- [ ] GET `/api/usuarios` - Returns all users
- [ ] POST `/api/usuarios` - Creates new user
- [ ] GET `/api/motos` - Returns all motorcycles
- [ ] POST `/api/motos` - Creates new motorcycle
- [ ] GET `/api/clientes` - Returns all clients
- [ ] GET `/api/contratos` - Returns all contracts
- [ ] POST `/api/contratos` - Creates new contract

### Role-Based Access Control
- [ ] Verify admin can access all endpoints
- [ ] Verify operator can access most endpoints (except user management)
- [ ] Verify client can only access their own data
- [ ] Verify unauthenticated requests are rejected

## User Profile Testing

### Profile Management
- [ ] Login as any user
- [ ] Visit `/perfil` page
- [ ] Update name and phone number
- [ ] Verify changes are saved
- [ ] Check email display (read-only)

### Password Change (Credentials Users Only)
- [ ] Login with credentials user
- [ ] Navigate to password change section
- [ ] Test current password validation
- [ ] Test new password requirements (min 6 chars)
- [ ] Test password confirmation matching
- [ ] Verify password change success
- [ ] Test login with new password

### Two-Factor Authentication
- [ ] Navigate to 2FA section
- [ ] Click "Activate 2FA"
- [ ] Verify QR code generation
- [ ] Verify manual code display
- [ ] Enter valid 6-digit code from authenticator app
- [ ] Verify 2FA activation success
- [ ] Test login with 2FA requirement

## Payment Integration Testing

### MercadoPago Integration
- [ ] Create a contract with payment
- [ ] Test payment preference creation
- [ ] Verify MercadoPago checkout URL generation
- [ ] Test webhook handling (mock MercadoPago response)
- [ ] Verify payment status updates in database

## Email Integration Testing

### SendGrid Integration
- [ ] Trigger invoice email sending
- [ ] Verify email is sent successfully
- [ ] Check email content and formatting
- [ ] Test email delivery to recipient

## Invoice Generation Testing

### PDF Generation
- [ ] Create a contract with invoice
- [ ] Trigger PDF generation
- [ ] Verify PDF file creation
- [ ] Check PDF content and formatting
- [ ] Test PDF download functionality

### AFIP Integration
- [ ] Test invoice validation with AFIP
- [ ] Verify CAE (Código de Autorización Electrónico) generation
- [ ] Check proper tax calculation
- [ ] Test error handling for AFIP failures

## Cron Job Testing

### Background Jobs
- [ ] Test contract renewal job
- [ ] Test payment facturation job
- [ ] Test alert generation job
- [ ] Verify jobs run at scheduled intervals
- [ ] Check job execution logs

## Security Testing

### Input Validation
- [ ] Test SQL injection attempts
- [ ] Test XSS attempts in forms
- [ ] Test large payload handling
- [ ] Verify proper error messages (no sensitive data leakage)

### Authentication Security
- [ ] Test session timeout
- [ ] Test concurrent session handling
- [ ] Test brute force protection
- [ ] Verify secure cookie settings

### API Security
- [ ] Test CORS configuration
- [ ] Test CSRF protection
- [ ] Test rate limiting
- [ ] Verify HTTPS enforcement in production

## Performance Testing

### Load Testing
- [ ] Test concurrent user access
- [ ] Test database query performance
- [ ] Monitor memory usage
- [ ] Check response times under load

### Database Performance
- [ ] Test complex queries
- [ ] Verify proper indexing
- [ ] Check for N+1 query problems
- [ ] Monitor database connection pooling

## Mobile/PWA Testing

### Progressive Web App
- [ ] Test app installation
- [ ] Verify offline functionality
- [ ] Test push notifications (if implemented)
- [ ] Check responsive design on mobile devices

## Error Handling Testing

### Graceful Degradation
- [ ] Test behavior when database is down
- [ ] Test behavior when external services fail
- [ ] Verify proper error pages
- [ ] Check error logging

### Data Validation
- [ ] Test invalid input handling
- [ ] Test required field validation
- [ ] Test data type validation
- [ ] Verify proper error messages

## Integration Testing

### Third-Party Services
- [ ] Test OAuth providers (Google, Apple, Facebook)
- [ ] Test payment processor (MercadoPago)
- [ ] Test email service (SendGrid)
- [ ] Test tax service (AFIP)
- [ ] Test ID verification (Verifik)

## Production Readiness Checklist

- [ ] All automated tests pass
- [ ] Manual testing completed
- [ ] Security audit passed
- [ ] Performance benchmarks met
- [ ] Error handling verified
- [ ] Logging configured
- [ ] Environment variables documented
- [ ] Deployment configuration ready
- [ ] Backup strategy in place
- [ ] Monitoring setup configured

## Useful Testing Commands

```bash
# Start development server
npm run dev

# Run automated tests
./test-backend.sh

# Reset database for testing
npx prisma db push --force-reset && npm run seed

# Check TypeScript compilation
npm run build

# View application logs
# (Check terminal output from npm run dev)

# Test specific API endpoint
curl -X GET http://localhost:3000/api/public/motos

# Test with authentication
curl -X GET http://localhost:3000/api/usuarios \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"
```

## Common Issues and Solutions

### Database Connection Issues
- Check PostgreSQL is running
- Verify DATABASE_URL in .env.local
- Run `npx prisma db push` to sync schema

### Authentication Issues
- Clear browser cookies/cache
- Check NEXTAUTH_SECRET is set
- Verify OAuth provider configurations

### Build Issues
- Run `npm install` to ensure dependencies
- Check for TypeScript errors: `npm run build`
- Clear node_modules and reinstall if needed

### API Issues
- Check server is running on correct port
- Verify middleware configuration
- Check network/firewall settings
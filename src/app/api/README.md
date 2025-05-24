# API Routes Documentation

This directory contains all API endpoints for the authentication system. All routes follow REST conventions and return JSON responses.

## Architecture Overview

The API is built using Next.js 15 App Router's Route Handlers, providing a modern, type-safe API layer. All authentication routes are grouped under `/api/auth/` for better organization.

## Authentication Routes

### 🔐 `/api/auth/sign-up`
**Method**: POST  
**Purpose**: Register a new user account  
**Authentication**: None required

**Request Body**:
```typescript
{
  email: string;    // Valid email address
  password: string; // Minimum 6 characters
  name: string;     // User's display name
}
```

**Success Response** (201):
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  }
}
```

**Implementation Details**:
- Validates input using Zod schema
- Checks for existing email to prevent duplicates
- Hashes password with bcrypt (10 rounds)
- Creates JWT token with 24h expiration
- Sets HTTP-only cookie for session

---

### 🔑 `/api/auth/sign-in`
**Method**: POST  
**Purpose**: Authenticate existing user  
**Authentication**: None required

**Request Body**:
```typescript
{
  email: string;
  password: string;
}
```

**Success Response** (200):
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  }
}
```

**Implementation Details**:
- Validates credentials format
- Retrieves user from database
- Compares password hash with bcrypt
- Generates new JWT token
- Updates session cookie

---

### 🚪 `/api/auth/logout`
**Method**: POST  
**Purpose**: End user session  
**Authentication**: Required (valid JWT)

**Success Response** (200):
```json
{
  "success": true
}
```

**Implementation Details**:
- Clears the auth token cookie
- No database interaction required
- Immediate effect

---

### 👤 `/api/auth/me`
**Method**: GET  
**Purpose**: Get current user information  
**Authentication**: Required (valid JWT)

**Success Response** (200):
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "createdAt": "ISO 8601 date string"
  }
}
```

**Implementation Details**:
- Verifies JWT from cookie
- Retrieves fresh user data from database
- Returns user info without password

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "error": "Error message description"
}
```

### Common Error Responses

- **400 Bad Request**: Invalid input data or validation errors
- **401 Unauthorized**: Missing or invalid authentication token
- **409 Conflict**: Resource already exists (e.g., email in use)
- **500 Internal Server Error**: Unexpected server errors

## Security Considerations

1. **Password Security**:
   - Never stored in plain text
   - Hashed using bcrypt with cost factor 10
   - Password requirements enforced via Zod validation

2. **Token Management**:
   - JWT tokens signed with secret key
   - 24-hour expiration for security
   - Stored in HTTP-only cookies to prevent XSS

3. **CORS & Headers**:
   - Handled automatically by Next.js
   - Additional security headers can be configured in `next.config.ts`

## Development Tips

1. **Testing Endpoints**:
   ```bash
   # Register a new user
   curl -X POST http://localhost:3000/api/auth/sign-up \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
   
   # Sign in
   curl -X POST http://localhost:3000/api/auth/sign-in \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

2. **Debugging**:
   - Check browser DevTools Network tab for requests/responses
   - Use `console.log` in route handlers (visible in terminal)
   - Drizzle Studio (`npm run db:studio`) to inspect database

3. **Adding New Routes**:
   - Create a new folder under `/api/`
   - Add `route.ts` file with named exports for HTTP methods
   - Follow existing patterns for consistency

## Future Enhancements

Potential improvements to consider:

- Rate limiting for authentication endpoints
- Email verification flow
- Password reset functionality
- OAuth provider integration
- Two-factor authentication
- Refresh token mechanism
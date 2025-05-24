# Library Utilities Documentation

This directory contains the core business logic, utilities, and data layer for the authentication system. It's organized to maintain a clean separation of concerns and promote code reusability.

## Directory Structure

```
lib/
├── auth.ts         # Authentication logic and JWT handling
├── db/            # Database configuration and schema
│   ├── index.ts   # Database connection and client
│   └── schema.ts  # Drizzle ORM schema definitions
├── utils.ts       # General utility functions
└── validations.ts # Zod validation schemas
```

## Core Modules

### 🔐 `auth.ts` - Authentication Module

This module handles all authentication-related operations, including JWT token management and password hashing.

**Key Functions**:

```typescript
// Hash a password for storage
hashPassword(password: string): Promise<string>

// Compare plain password with hash
comparePasswords(password: string, hash: string): Promise<boolean>

// Create a JWT token
createToken(userId: string): Promise<string>

// Verify and decode a JWT token
verifyToken(token: string): Promise<{ userId: string }>

// Get user from request (using cookies)
getUserFromRequest(request: NextRequest): Promise<User | null>
```

**Design Decisions**:
- **bcrypt** for password hashing: Industry standard, resistant to rainbow table attacks
- **jose** library for JWT: Edge-compatible, modern, and actively maintained
- **24-hour token expiration**: Balance between security and user convenience
- **HTTP-only cookies**: Prevents XSS attacks by making tokens inaccessible to JavaScript

### 🗄️ `db/` - Database Layer

The database layer uses Drizzle ORM with SQLite for type-safe database operations.

#### `db/schema.ts`
Defines the database schema:

```typescript
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});
```

**Schema Design**:
- **UUID v4** for user IDs: Globally unique, no collisions
- **Email as unique constraint**: Prevents duplicate accounts
- **Timestamp storage**: SQLite integers for efficiency
- **No soft deletes**: Simplicity for this implementation

#### `db/index.ts`
Database connection and helper functions:

```typescript
// Database instance
export const db: Database

// User operations
export const createUser(data: UserData): Promise<User>
export const getUserByEmail(email: string): Promise<User | null>
export const getUserById(id: string): Promise<User | null>
```

**Connection Management**:
- Single database instance
- Connection reused across requests
- SQLite file stored in project root

### ✅ `validations.ts` - Input Validation

Zod schemas for runtime validation and TypeScript type inference:

```typescript
// Sign-up validation
export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1)
});

// Sign-in validation
export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

// Type exports
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
```

**Validation Strategy**:
- **Frontend & Backend**: Same schemas used in both
- **Type Safety**: Automatic TypeScript types from schemas
- **Error Messages**: Zod provides clear validation errors

### 🛠️ `utils.ts` - Utility Functions

General-purpose utilities used across the application:

```typescript
// Tailwind CSS class name utility
export function cn(...inputs: ClassValue[]): string
```

Currently contains the `cn` function for managing Tailwind classes, but can be extended with other utilities as needed.

## Usage Examples

### Authentication Flow

```typescript
// Sign up a new user
const hashedPassword = await hashPassword(password);
const user = await createUser({
  email,
  password: hashedPassword,
  name
});
const token = await createToken(user.id);

// Sign in existing user
const user = await getUserByEmail(email);
const isValid = await comparePasswords(password, user.password);
if (isValid) {
  const token = await createToken(user.id);
}

// Verify authenticated request
const user = await getUserFromRequest(request);
if (!user) {
  return new Response('Unauthorized', { status: 401 });
}
```

### Database Operations

```typescript
// Create user
const newUser = await createUser({
  email: 'user@example.com',
  password: hashedPassword,
  name: 'John Doe'
});

// Query user
const existingUser = await getUserByEmail('user@example.com');
```

### Input Validation

```typescript
// Validate sign-up data
const result = signUpSchema.safeParse(requestData);
if (!result.success) {
  return Response.json({ 
    error: result.error.issues[0].message 
  }, { status: 400 });
}

// Use validated data
const { email, password, name } = result.data;
```

## Security Best Practices

1. **Never log passwords**: Even hashed passwords shouldn't appear in logs
2. **Always validate input**: Use Zod schemas before processing
3. **Handle errors gracefully**: Don't expose internal details
4. **Use environment variables**: Keep JWT_SECRET secure
5. **Regular dependency updates**: Keep security libraries current

## Testing Considerations

When testing these modules:

1. **Mock external dependencies**: Database and bcrypt for unit tests
2. **Test edge cases**: Invalid tokens, expired tokens, malformed input
3. **Integration tests**: Full authentication flow testing
4. **Security tests**: SQL injection, XSS attempts

## Future Enhancements

Potential improvements:

1. **Session Management**: Redis for session storage
2. **Rate Limiting**: Prevent brute force attacks
3. **Audit Logging**: Track authentication events
4. **Multi-factor Authentication**: TOTP support
5. **OAuth Providers**: Social login integration
6. **Password Policies**: Complexity requirements
7. **Account Lockout**: After failed attempts
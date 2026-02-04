# Testing Infrastructure Guide

This guide provides comprehensive instructions for setting up and using the testing infrastructure for the Forex project.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Frontend Testing (React + Vite)](#frontend-testing-react--vite)
3. [Backend Testing (Node.js + Express)](#backend-testing-nodejs--express)
4. [Running Tests](#running-tests)
5. [Writing Tests](#writing-tests)
6. [Test Coverage](#test-coverage)
7. [CI/CD Integration](#cicd-integration)
8. [Best Practices](#best-practices)

---

## Overview

This project uses two different testing frameworks:

- **Frontend**: Vitest + React Testing Library
- **Backend**: Jest + Supertest

### Why Two Different Frameworks?

- **Vitest** is optimized for Vite projects and provides faster test execution
- **Jest** is the industry standard for Node.js backend testing with excellent MongoDB integration

---

## Frontend Testing (React + Vite)

### Setup

The frontend testing infrastructure uses:
- **Vitest**: Fast unit test framework
- **React Testing Library**: Component testing utilities
- **jsdom**: DOM environment for testing
- **@testing-library/jest-dom**: Custom matchers for DOM assertions

### Installation

```bash
cd RiteshFrontend
npm install
```

### Configuration Files

- `vitest.config.js`: Main Vitest configuration
- `src/test/setup.js`: Test environment setup (mocks, globals)

### Running Frontend Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (recommended during development)
npm test:watch

# Run tests with UI (interactive)
npm test:ui

# Run tests with coverage report
npm test:coverage
```

### Example Test Structure

```jsx
// src/components/__tests__/MyComponent.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

---

## Backend Testing (Node.js + Express)

### Setup

The backend testing infrastructure uses:
- **Jest**: Test framework
- **Supertest**: HTTP assertion library for API testing
- **MongoDB**: Test database (separate from production)

### Installation

```bash
cd ShraddhaBackend
npm install
```

### Configuration Files

- `jest.config.js`: Jest configuration
- `tests/setup.js`: Test database setup and teardown

### Environment Setup

Create a `.env.test` file in `ShraddhaBackend/`:

```env
NODE_ENV=test
PORT=3001
TEST_DATABASE_URL=mongodb://localhost:27017/forex_test
JWT_SECRET=test_jwt_secret_key_for_testing_only
```

### Running Backend Tests

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode
npm test:watch

# Run only unit tests
npm test:unit

# Run only integration tests
npm test:integration
```

### Test Database Setup

Before running backend tests, ensure MongoDB is running:

```bash
# Start MongoDB (if using local installation)
mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb-test mongo:latest
```

### Example Test Structure

#### Unit Test (Controller)

```javascript
// tests/unit/auth.controller.test.js
import { describe, it, expect } from '@jest/globals';
import { signup } from '../../controllers/auth.controller.js';

describe('Auth Controller', () => {
  it('should validate required fields', async () => {
    // Test implementation
  });
});
```

#### Integration Test (API Routes)

```javascript
// tests/integration/auth.routes.test.js
import request from 'supertest';
import app from '../../server.js';

describe('POST /api/auth/signup', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'test@example.com',
        password: 'password123',
        // ... other fields
      })
      .expect(201);

    expect(response.body.success).toBe(true);
  });
});
```

---

## Running Tests

### Run All Tests (Both Frontend and Backend)

```bash
# From project root
cd RiteshFrontend && npm test && cd ../ShraddhaBackend && npm test
```

### Run Tests in Parallel

Create a script in the root `package.json`:

```json
{
  "scripts": {
    "test:all": "npm --filter riteshfrontend test && npm --filter shraddhabackend test"
  }
}
```

---

## Writing Tests

### Frontend Testing Best Practices

1. **Test User Behavior, Not Implementation**
   ```jsx
   // ✅ Good: Test what user sees
   expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
   
   // ❌ Bad: Test implementation details
   expect(component.state.isSubmitted).toBe(true);
   ```

2. **Use Accessible Queries**
   ```jsx
   // Prefer in this order:
   // 1. getByRole
   // 2. getByLabelText
   // 3. getByText
   // 4. getByTestId (last resort)
   ```

3. **Test User Interactions**
   ```jsx
   import { fireEvent } from '@testing-library/react';
   
   const button = screen.getByRole('button');
   fireEvent.click(button);
   ```

4. **Mock External Dependencies**
   ```jsx
   import { vi } from 'vitest';
   
   vi.mock('../services/api', () => ({
     fetchUserData: vi.fn().mockResolvedValue({ id: 1 }),
   }));
   ```

### Backend Testing Best Practices

1. **Separate Unit and Integration Tests**
   - Unit tests: Test individual functions in isolation
   - Integration tests: Test API endpoints with database

2. **Use Test Database**
   - Always use a separate test database
   - Clean up test data after tests

3. **Mock External Services**
   ```javascript
   jest.mock('../services/emailService', () => ({
     sendEmail: jest.fn().mockResolvedValue(true),
   }));
   ```

4. **Test Error Cases**
   ```javascript
   it('should return 400 for invalid input', async () => {
     const response = await request(app)
       .post('/api/auth/signup')
       .send({ invalid: 'data' })
       .expect(400);
   });
   ```

---

## Test Coverage

### Frontend Coverage

```bash
cd RiteshFrontend
npm test:coverage
```

Coverage report will be generated in `coverage/` directory.

### Backend Coverage

```bash
cd ShraddhaBackend
npm test
```

Coverage report will be generated in `coverage/` directory.

### Coverage Goals

- **Statements**: 70%+
- **Branches**: 60%+
- **Functions**: 70%+
- **Lines**: 70%+

---

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: npm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd RiteshFrontend && npm install && npm test:coverage

  backend-tests:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:latest
        ports:
          - 27017:27017
    steps:
      - uses: actions/checkout@v3
      - uses: npm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd ShraddhaBackend && npm install && npm test
```

---

## Best Practices

### 1. Test Organization

```
Frontend:
src/
  components/
    MyComponent.jsx
    __tests__/
      MyComponent.test.jsx

Backend:
tests/
  unit/
    auth.controller.test.js
  integration/
    auth.routes.test.js
```

### 2. Test Naming

- Use descriptive test names
- Follow pattern: `should [expected behavior] when [condition]`

```javascript
it('should return 401 when password is incorrect', async () => {
  // test
});
```

### 3. Arrange-Act-Assert Pattern

```javascript
it('should login successfully', async () => {
  // Arrange: Set up test data
  const userData = { email: 'test@example.com', password: 'pass123' };
  
  // Act: Perform the action
  const response = await request(app).post('/api/auth/login').send(userData);
  
  // Assert: Verify the result
  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
});
```

### 4. Keep Tests Independent

- Each test should be able to run independently
- Don't rely on test execution order
- Clean up after each test

### 5. Test Edge Cases

- Empty inputs
- Invalid inputs
- Boundary conditions
- Error scenarios

### 6. Mock External APIs

```javascript
// Frontend
vi.mock('../services/api', () => ({
  fetchData: vi.fn().mockResolvedValue({ data: 'test' }),
}));

// Backend
jest.mock('../services/emailService', () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));
```

---

## Troubleshooting

### Frontend Tests

**Issue**: Tests fail with "Cannot find module"
- **Solution**: Check import paths and ensure all dependencies are installed

**Issue**: `screen` is undefined
- **Solution**: Import from `@testing-library/react`: `import { screen } from '@testing-library/react'`

### Backend Tests

**Issue**: MongoDB connection fails
- **Solution**: Ensure MongoDB is running and `TEST_DATABASE_URL` is correct

**Issue**: Tests timeout
- **Solution**: Increase timeout in `jest.config.js` or use `jest.setTimeout(10000)`

**Issue**: Port already in use
- **Solution**: Change `PORT` in `.env.test` or kill the process using the port

---

## Next Steps

1. ✅ Install dependencies: `npm install` in both directories
2. ✅ Set up test database for backend
3. ✅ Run example tests to verify setup
4. ✅ Start writing tests for your components/controllers
5. ✅ Set up CI/CD pipeline
6. ✅ Aim for 70%+ test coverage

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)

---

## Support

If you encounter issues:
1. Check the troubleshooting section
2. Review test configuration files
3. Ensure all dependencies are installed
4. Verify environment variables are set correctly

Happy Testing! 🧪


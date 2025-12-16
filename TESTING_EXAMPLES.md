# Testing Examples

This document provides real-world examples of how to write tests for this project.

## Frontend Examples

### Component Testing

```jsx
// Example: Testing a form component
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignInForm from '../SignInForm';
import { renderWithProviders } from '../../test/utils/testUtils';

describe('SignInForm', () => {
  it('submits form with valid data', async () => {
    const onSubmit = vi.fn();
    renderWithProviders(<SignInForm onSubmit={onSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });
});
```

### API Mocking

```jsx
// Example: Mocking API calls
import { vi } from 'vitest';
import * as api from '../services/api';

vi.mock('../services/api', () => ({
  authAPI: {
    login: vi.fn(),
  },
}));

// In your test
api.authAPI.login.mockResolvedValue({
  success: true,
  token: 'mock-token',
  user: { email: 'test@example.com' }
});
```

## Backend Examples

### Controller Unit Test

```javascript
// Example: Testing a controller function
import { describe, it, expect, jest } from '@jest/globals';
import { createAccount } from '../../controllers/account.controller.js';
import Account from '../../models/Account.js';

jest.mock('../../models/Account.js');

describe('createAccount', () => {
  it('creates account successfully', async () => {
    const mockReq = {
      body: { accountType: 'Standard', status: 'Live' },
      user: { id: 'user123' }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    Account.findOne = jest.fn().mockResolvedValue(null);
    Account.create = jest.fn().mockResolvedValue({
      _id: 'account123',
      type: 'Standard'
    });

    await createAccount(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(Account.create).toHaveBeenCalled();
  });
});
```

### Integration Test

```javascript
// Example: Testing API endpoints
import request from 'supertest';
import { app } from '../../server.js';
import { createTestUserWithToken } from '../utils/authHelpers.js';

describe('POST /api/accounts/create', () => {
  it('creates account with authentication', async () => {
    const { token } = await createTestUserWithToken();
    
    const response = await request(app)
      .post('/api/accounts/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        accountType: 'Standard',
        status: 'Live'
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.account).toBeDefined();
  });
});
```

### Database Seeding

```javascript
// Example: Using seeders in tests
import { seedUser, seedAccount } from '../fixtures/seeders/userSeeder.js';
import { cleanAllCollections } from '../fixtures/cleaners/dbCleaner.js';

describe('Account Management', () => {
  beforeEach(async () => {
    await cleanAllCollections();
  });

  it('creates account for seeded user', async () => {
    const user = await seedUser({ email: 'test@example.com' });
    const account = await seedAccount(user._id, { type: 'Standard' });
    
    expect(account.user.toString()).toBe(user._id.toString());
  });
});
```

## Best Practices

1. **Arrange-Act-Assert Pattern**: Always structure tests clearly
2. **Mock External Dependencies**: Mock API calls, database operations
3. **Clean Up**: Always clean up test data between tests
4. **Test Edge Cases**: Test error conditions, boundary values
5. **Use Descriptive Names**: Test names should describe what they test


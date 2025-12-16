# Testing Best Practices

Project-specific guidelines for writing and maintaining tests.

## Test Organization

### Frontend Structure
```
src/
  components/
    MyComponent.jsx
    __tests__/
      MyComponent.test.jsx
  pages/
    MyPage.jsx
    __tests__/
      MyPage.test.jsx
```

### Backend Structure
```
tests/
  unit/
    controllers/
      *.test.js
  integration/
    routes/
      *.test.js
  middleware/
    *.test.js
```

## Writing Tests

### 1. Test Naming Convention

```javascript
// Good
describe('UserController', () => {
  it('should return 404 when user not found', () => {});
  it('should create user with valid data', () => {});
});

// Bad
describe('UserController', () => {
  it('test1', () => {});
  it('works', () => {});
});
```

### 2. Test Isolation

- Each test should be independent
- Don't rely on test execution order
- Clean up after each test

```javascript
beforeEach(async () => {
  await cleanTestDB();
});
```

### 3. Mock Strategy

- Mock external services (APIs, databases)
- Use real implementations for unit tests when possible
- Use mocks for integration tests to avoid side effects

### 4. Coverage Goals

- Aim for 70%+ coverage
- Focus on critical paths first
- Don't test implementation details

### 5. Error Testing

Always test error cases:

```javascript
it('should return 400 for invalid input', async () => {
  const response = await request(app)
    .post('/api/users')
    .send({ invalid: 'data' })
    .expect(400);
});
```

## Common Patterns

### Testing Async Operations

```javascript
it('handles async operations', async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});
```

### Testing React Components

```javascript
it('renders and interacts correctly', () => {
  renderWithProviders(<Component />);
  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByText('Expected')).toBeInTheDocument();
});
```

### Testing Middleware

```javascript
it('calls next() when authenticated', () => {
  mockReq.headers.authorization = 'Bearer valid-token';
  middleware(mockReq, mockRes, mockNext);
  expect(mockNext).toHaveBeenCalled();
});
```

## Debugging Tests

1. Use `console.log` sparingly
2. Use debugger in IDE
3. Run single test: `pnpm test -- MyTest.test.js`
4. Use `--reporter=verbose` for detailed output

## Performance

- Keep tests fast (< 100ms per test)
- Use parallel execution
- Mock slow operations
- Clean up resources properly

## Maintenance

- Update tests when code changes
- Remove obsolete tests
- Refactor duplicate test code
- Keep test utilities up to date


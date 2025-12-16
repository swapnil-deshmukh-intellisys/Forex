# Testing Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
# Frontend
cd RiteshFrontend
pnpm install

# Backend
cd ../ShraddhaBackend
pnpm install
```

### 2. Backend Test Database Setup

Ensure MongoDB is running:

```bash
# Option 1: Local MongoDB
mongod

# Option 2: Docker
docker run -d -p 27017:27017 --name mongodb-test mongo:latest
```

Create `.env.test` in `ShraddhaBackend/`:

```env
NODE_ENV=test
TEST_DATABASE_URL=mongodb://localhost:27017/forex_test
JWT_SECRET=test_jwt_secret_key
```

### 3. Run Tests

```bash
# Frontend tests
cd RiteshFrontend
pnpm test

# Backend tests
cd ../ShraddhaBackend
pnpm test
```

## 📝 Common Commands

### Frontend
```bash
pnpm test              # Run once
pnpm test:watch        # Watch mode
pnpm test:ui           # Interactive UI
pnpm test:coverage     # With coverage
```

### Backend
```bash
pnpm test              # All tests with coverage
pnpm test:watch        # Watch mode
pnpm test:unit         # Unit tests only
pnpm test:integration  # Integration tests only
```

## 📁 Test File Locations

### Frontend
- Component tests: `src/components/__tests__/`
- Widget tests: `src/widgets/__tests__/`
- Service tests: `src/services/__tests__/`
- Setup: `src/test/setup.js`

### Backend
- Unit tests: `tests/unit/`
- Integration tests: `tests/integration/`
- Setup: `tests/setup.js`

## ✅ Verify Installation

Run the example tests:

```bash
# Frontend
cd RiteshFrontend
pnpm test src/widgets/__tests__/MiniChartUsd.test.jsx

# Backend
cd ../ShraddhaBackend
pnpm test tests/unit/auth.controller.test.js
```

If these pass, your setup is complete! 🎉

## 📚 Next Steps

1. Read `TESTING_GUIDE.md` for detailed documentation
2. Write tests for your components/controllers
3. Aim for 70%+ coverage
4. Set up CI/CD (see guide)

## 🆘 Troubleshooting

**MongoDB connection error?**
- Check if MongoDB is running: `mongosh` or `mongo`
- Verify `TEST_DATABASE_URL` in `.env.test`

**Tests not found?**
- Ensure test files end with `.test.js` or `.test.jsx`
- Check `jest.config.js` and `vitest.config.js` patterns

**Import errors?**
- Run `pnpm install` again
- Clear `node_modules` and reinstall

For more help, see `TESTING_GUIDE.md`

